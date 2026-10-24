/**
 * Utility condivise dagli script di setup e sviluppo.
 * PostgreSQL "portatile": i binari arrivano dal pacchetto npm `embedded-postgres`
 * e i dati vivono in `.data/postgres` dentro il progetto. Niente sudo, niente Docker.
 */
import { spawn } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import EmbeddedPostgres from "embedded-postgres"
import pg from "pg"

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
export const BACKEND = join(ROOT, "backend")
export const STOREFRONT = join(ROOT, "storefront")
export const DATA_DIR = join(ROOT, ".data", "postgres")

export const DB = {
  host: "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: "postgres",
  password: "postgres",
  name: "gamescomics",
}

const c = (code) => (s) => (process.stdout.isTTY ? `\x1b[${code}m${s}\x1b[0m` : s)
export const color = { yellow: c("33"), green: c("32"), red: c("31"), cyan: c("36"), bold: c("1"), dim: c("2") }

export const step = (msg) => console.log(`\n${color.yellow("▶")} ${color.bold(msg)}`)
export const ok = (msg) => console.log(`  ${color.green("✔")} ${msg}`)
export const info = (msg) => console.log(`  ${color.dim(msg)}`)
export const fail = (msg) => {
  console.error(`\n${color.red("✖")} ${msg}\n`)
  process.exit(1)
}

/** Prova a collegarsi al server Postgres con le credenziali del progetto. */
export async function canConnect(database = "postgres") {
  const client = new pg.Client({ ...DB, database, connectionTimeoutMillis: 2000 })
  try {
    await client.connect()
    await client.end()
    return true
  } catch (e) {
    return e
  }
}

/**
 * Avvia PostgreSQL. Se sulla porta risponde già un server con le credenziali
 * giuste (Docker o Postgres di sistema) lo riusa; altrimenti avvia quello
 * portatile. Restituisce una funzione per fermarlo (no-op se riusato).
 */
export async function startPostgres({ quiet = false } = {}) {
  const existing = await canConnect()
  if (existing === true) {
    if (!quiet) ok(`Uso il PostgreSQL già attivo su localhost:${DB.port}`)
    return async () => {}
  }
  if (existing?.code && existing.code !== "ECONNREFUSED") {
    fail(
      `Sulla porta ${DB.port} risponde un server PostgreSQL, ma non accetta l'utente ` +
        `"postgres" con password "postgres" (${existing.message}).\n` +
        `  Fermalo (es. \`sudo systemctl stop postgresql\` o \`docker compose down\`) e riprova.`
    )
  }

  if (process.getuid?.() === 0) {
    fail("PostgreSQL non può essere avviato come root: lancia il comando dal tuo utente normale.")
  }

  // Log di PostgreSQL: li mostriamo solo se l'avvio fallisce
  const logs = []
  const keep = (m) => {
    logs.push(...String(m).trim().split("\n"))
    if (logs.length > 40) logs.splice(0, logs.length - 40)
  }


  const server = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: DB.user,
    password: DB.password,
    port: DB.port,
    persistent: true,
    initdbFlags: ["--locale=C", "--encoding=UTF8", "--lc-messages=C"],
    onLog: keep,
    onError: keep,
  })

  const explain = (phase, e) => {
    console.error(`\n${color.red("✖")} PostgreSQL non è riuscito a ${phase}.`)
    if (e?.message) console.error(`  ${e.message}`)
    if (logs.length) {
      console.error(color.dim("\n  Ultimi messaggi di PostgreSQL:"))
      for (const l of logs.slice(-20)) console.error(color.dim(`    ${l}`))
    }
    console.error(
      `\n  Se il database è danneggiato o creato su un altro sistema, ricrealo con:\n` +
        `    rm -rf .data/postgres && npm run setup\n`
    )
    process.exit(1)
  }

  if (!existsSync(join(DATA_DIR, "PG_VERSION"))) {
    if (!quiet) info("Prima esecuzione: inizializzo il database in .data/postgres ...")
    await server.initialise().catch((e) => explain("inizializzare la cartella dati", e))
  }
  forceCLocale()
  await server.start().catch((e) => explain("avviarsi", e))
  if (!quiet) ok(`PostgreSQL portatile avviato su localhost:${DB.port}`)

  let stopped = false
  return async () => {
    if (stopped) return
    stopped = true
    await server.stop().catch(() => {})
  }
}

/**
 * Locale "C" in postgresql.conf: esiste su qualunque sistema, a differenza di
 * en_US.UTF-8 o it_IT.UTF-8 che dipendono da /etc/locale.gen. Con un locale
 * mancante PostgreSQL si ferma subito ("invalid value for parameter lc_messages").
 */
function forceCLocale() {
  const conf = join(DATA_DIR, "postgresql.conf")
  if (!existsSync(conf)) return
  const before = readFileSync(conf, "utf8")
  const after = before.replace(
    /^(lc_messages|lc_monetary|lc_numeric|lc_time)\s*=\s*'[^']*'/gm,
    (_, key) => `${key} = 'C'`
  )
  if (after !== before) writeFileSync(conf, after)
}

/** Crea il database del negozio se non esiste. */
export async function ensureDatabase() {
  const client = new pg.Client({ ...DB, database: "postgres" })
  await client.connect()
  const { rowCount } = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [DB.name])
  if (!rowCount) {
    await client.query(`CREATE DATABASE "${DB.name}"`)
    ok(`Database "${DB.name}" creato`)
  } else {
    ok(`Database "${DB.name}" presente`)
  }
  await client.end()
}

/** true se il database del negozio esiste e contiene già i dati (seed fatto). */
export async function isSeeded() {
  try {
    const rows = await query("SELECT 1 FROM region WHERE name = 'Italia' AND deleted_at IS NULL")
    const users = await query('SELECT 1 FROM "user" WHERE deleted_at IS NULL LIMIT 1')
    return rows.length > 0 && users.length > 0
  } catch {
    return false // database o tabelle mancanti
  }
}

/** Esegue una query sul database del negozio. */
export async function query(sql, params = []) {
  const client = new pg.Client({ ...DB, database: DB.name })
  await client.connect()
  try {
    return (await client.query(sql, params)).rows
  } finally {
    await client.end()
  }
}

/** Esegue un comando mostrando l'output; rifiuta se l'exit code non è 0. */
export function run(cmd, args, { cwd = ROOT, capture = false, env = {} } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      env: { ...process.env, ...env },
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
    })
    let out = ""
    if (capture) {
      child.stdout.on("data", (d) => (out += d))
      child.stderr.on("data", (d) => (out += d))
    }
    child.on("error", reject)
    child.on("exit", (code) =>
      code === 0 ? resolve(out) : reject(Object.assign(new Error(`${cmd} ${args.join(" ")} → exit ${code}`), { out }))
    )
  })
}

/** Legge un file .env in un oggetto chiave → valore. */
export function readEnv(file) {
  if (!existsSync(file)) return {}
  return Object.fromEntries(
    readFileSync(file, "utf8")
      .split("\n")
      .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
      .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
  )
}

export async function waitForUrl(url, timeoutMs = 180_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      // redirect "manual": lo storefront risponde con un redirect finché non ha il cookie
      const res = await fetch(url, { redirect: "manual" })
      if (res.status < 500) return true
    } catch {}
    await new Promise((r) => setTimeout(r, 1000))
  }
  return false
}
