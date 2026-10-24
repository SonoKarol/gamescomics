/**
 * Avvia solo PostgreSQL (utile per collegarsi con psql o un client grafico):
 *   npm run db
 */
import { DB, color, startPostgres } from "./lib.mjs"

const stop = await startPostgres()
console.log(`\n  postgres://${DB.user}:${DB.password}@localhost:${DB.port}/${DB.name}\n  ${color.dim("Ctrl+C per fermare")}`)
const bye = async () => {
  await stop()
  process.exit(0)
}
process.on("SIGINT", bye)
process.on("SIGTERM", bye)
setInterval(() => {}, 1 << 30)
