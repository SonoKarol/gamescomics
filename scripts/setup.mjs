/**
 * Prima configurazione completa del progetto (si può rilanciare senza danni).
 *
 *   npm run setup
 *
 * 1. installa le dipendenze di backend e storefront
 * 2. crea i file .env mancanti dai template
 * 3. avvia PostgreSQL (portatile, oppure quello già attivo)
 * 4. crea il database, le tabelle (migrazioni) e i dati demo (seed)
 * 5. scrive la chiave pubblica dello storefront in storefront/.env.local
 * 6. crea l'utente amministratore e salva le credenziali in .data/admin.txt
 */
import { randomBytes } from "node:crypto"
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import {
  BACKEND,
  DB,
  ROOT,
  STOREFRONT,
  color,
  ensureDatabase,
  fail,
  info,
  ok,
  query,
  run,
  startPostgres,
  step,
} from "./lib.mjs"

const ADMIN_EMAIL = "admin@gamescomics.it"
const npm = process.platform === "win32" ? "npm.cmd" : "npm"
const npx = process.platform === "win32" ? "npx.cmd" : "npx"

const [major] = process.versions.node.split(".").map(Number)
if (major < 20) fail(`Serve Node.js 20 o superiore (hai ${process.versions.node}).`)

// ── 1. Dipendenze ────────────────────────────────────────────────────────────
step("Dipendenze")
for (const [name, dir] of [["backend", BACKEND], ["storefront", STOREFRONT]]) {
  if (existsSync(join(dir, "node_modules", ".package-lock.json"))) {
    ok(`${name}: già installate`)
  } else {
    info(`${name}: npm install (qualche minuto la prima volta)...`)
    await run(npm, ["install", "--no-audit", "--no-fund", "--loglevel=error"], { cwd: dir })
    ok(`${name}: installate`)
  }
}

// ── 2. File .env ─────────────────────────────────────────────────────────────
step("Configurazione (.env)")
for (const [from, to] of [
  [join(BACKEND, ".env.template"), join(BACKEND, ".env")],
  [join(STOREFRONT, ".env.template"), join(STOREFRONT, ".env.local")],
]) {
  if (existsSync(to)) ok(`${to.replace(ROOT + "/", "")} presente`)
  else {
    copyFileSync(from, to)
    ok(`${to.replace(ROOT + "/", "")} creato dal template`)
  }
}

// ── 3-4. Database ────────────────────────────────────────────────────────────
step("Database")
const stopPostgres = await startPostgres()
try {
  await ensureDatabase()

  step("Tabelle (migrazioni Medusa)")
  await run(npx, ["medusa", "db:migrate"], { cwd: BACKEND, capture: true }).catch((e) => {
    console.error(e.out)
    fail("Migrazioni fallite: vedi l'output qui sopra.")
  })
  ok("Schema del database aggiornato")

  step("Dati del negozio (seed)")
  const regions = await query("SELECT 1 FROM region WHERE name = 'Italia' AND deleted_at IS NULL")
  if (regions.length) {
    ok("Dati già presenti, salto il seed")
  } else {
    await run(npm, ["run", "seed"], { cwd: BACKEND, capture: true }).catch((e) => {
      console.error(e.out)
      fail("Seed fallito: vedi l'output qui sopra.")
    })
    ok("Regioni, IVA, spedizioni, categorie e prodotti demo creati")
  }

  // ── 5. Chiave pubblica per lo storefront ───────────────────────────────────
  step("Collegamento negozio ↔ backend")
  const [key] = await query(
    "SELECT token FROM api_key WHERE type = 'publishable' AND revoked_at IS NULL AND deleted_at IS NULL ORDER BY created_at LIMIT 1"
  )
  if (!key) fail("Nessuna chiave API pubblica trovata nel database.")
  const envLocal = join(STOREFRONT, ".env.local")
  let env = readFileSync(envLocal, "utf8")
  const line = `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${key.token}`
  env = /^NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=.*$/m.test(env)
    ? env.replace(/^NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=.*$/m, line)
    : env + `\n${line}\n`
  writeFileSync(envLocal, env)
  ok("Chiave pubblica scritta in storefront/.env.local")

  // ── 6. Utente amministratore ───────────────────────────────────────────────
  step("Utente amministratore")
  const credFile = join(ROOT, ".data", "admin.txt")
  const users = await query('SELECT 1 FROM "user" WHERE email = $1 AND deleted_at IS NULL', [ADMIN_EMAIL])
  if (users.length) {
    ok(`${ADMIN_EMAIL} esiste già${existsSync(credFile) ? " (credenziali in .data/admin.txt)" : ""}`)
  } else {
    const password = randomBytes(9).toString("base64url")
    await run(npx, ["medusa", "user", "-e", ADMIN_EMAIL, "-p", password], { cwd: BACKEND, capture: true }).catch((e) => {
      console.error(e.out)
      fail("Creazione dell'utente admin fallita.")
    })
    mkdirSync(join(ROOT, ".data"), { recursive: true })
    writeFileSync(credFile, `Pannello admin: http://localhost:9000/app\nEmail:    ${ADMIN_EMAIL}\nPassword: ${password}\n`, { mode: 0o600 })
    ok(`Creato ${ADMIN_EMAIL} — credenziali salvate in .data/admin.txt`)
  }
} finally {
  await stopPostgres()
}

if (!process.env.GC_FROM_DEV) console.log(`
${color.green(color.bold("Tutto pronto!"))} Avvia il progetto con:

  ${color.cyan("npm run dev")}

  Negozio  → http://localhost:8000
  Admin    → http://localhost:9000/app   (credenziali in .data/admin.txt)
  Database → postgres://${DB.user}:${DB.password}@localhost:${DB.port}/${DB.name}
`)
