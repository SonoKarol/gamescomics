/**
 * Avvia tutto per lo sviluppo:  npm run dev
 *   PostgreSQL → backend Medusa (:9000) → storefront Next.js (:8000)
 * Ctrl+C chiude tutto in ordine.
 */
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { BACKEND, STOREFRONT, color, fail, ok, readEnv, startPostgres, step, waitForUrl } from "./lib.mjs"

const npm = process.platform === "win32" ? "npm.cmd" : "npm"

const env = readEnv(join(STOREFRONT, ".env.local"))
if (!existsSync(join(BACKEND, "node_modules")) || !env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY?.startsWith("pk_") || env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY === "pk_...") {
  fail("Il progetto non è ancora configurato: lancia prima `npm run setup`.")
}

const children = []
let shuttingDown = false

function launch(name, tint, cwd) {
  const child = spawn(npm, ["run", "dev"], { cwd, detached: true, env: { ...process.env, FORCE_COLOR: "1" } })
  const prefix = tint(`[${name}]`.padEnd(13))
  const pipe = (stream, out) => {
    let buf = ""
    stream.on("data", (d) => {
      buf += d
      const lines = buf.split("\n")
      buf = lines.pop()
      for (const l of lines) out.write(`${prefix} ${l}\n`)
    })
  }
  pipe(child.stdout, process.stdout)
  pipe(child.stderr, process.stderr)
  child.on("exit", (code) => {
    if (!shuttingDown) {
      console.error(`${prefix} terminato (codice ${code}), chiudo tutto.`)
      shutdown(1)
    }
  })
  children.push(child)
  return child
}

let stopPostgres = async () => {}

async function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`\n${color.yellow("■")} Chiusura in corso...`)
  for (const child of children.reverse()) {
    try {
      process.kill(-child.pid, "SIGTERM")
    } catch {}
  }
  await new Promise((r) => setTimeout(r, 1500))
  await stopPostgres()
  console.log(`${color.green("✔")} Chiuso.`)
  process.exit(code)
}
process.on("SIGINT", () => shutdown(0))
process.on("SIGTERM", () => shutdown(0))

step("Database")
stopPostgres = await startPostgres()

step("Backend Medusa")
launch("backend", color.cyan, BACKEND)
if (!(await waitForUrl("http://localhost:9000/health", 240_000))) {
  console.error("Il backend non risponde su http://localhost:9000/health")
  await shutdown(1)
}
ok("Backend pronto")

step("Storefront Next.js")
launch("storefront", color.yellow, STOREFRONT)
await waitForUrl("http://localhost:8000/it", 240_000)

console.log(`
${color.green(color.bold("Games & Comics Shop è attivo"))}
  Negozio → ${color.cyan("http://localhost:8000")}
  Admin   → ${color.cyan("http://localhost:9000/app")}   (credenziali in .data/admin.txt)
  Ctrl+C per fermare tutto
`)
