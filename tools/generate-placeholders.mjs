/**
 * Genera le immagini SEGNAPOSTO dei prodotti demo (copertine originali in
 * stile fumetto, nessuna opera protetta) in backend/static/demo/.
 *
 * Uso (dalla root del progetto, serve Playwright con Chromium):
 *   npx playwright install chromium   # solo la prima volta
 *   node tools/generate-placeholders.mjs
 *
 * Il catalogo viene letto da backend/src/scripts/data/catalog.ts
 * (Node >= 22.18 esegue TypeScript "type-only" nativamente).
 */
import { chromium } from "playwright"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { products } from "../backend/src/scripts/data/catalog.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = join(root, "backend/static/demo")
mkdirSync(outDir, { recursive: true })

const font = (pkg, file) =>
  readFileSync(join(root, "storefront/node_modules", pkg, "files", file)).toString("base64")

const css = `
@font-face{font-family:Bangers;src:url(data:font/woff2;base64,${font("@fontsource/bangers", "bangers-latin-400-normal.woff2")}) format('woff2')}
@font-face{font-family:Oswald;font-weight:200 700;src:url(data:font/woff2;base64,${font("@fontsource-variable/oswald", "oswald-latin-wght-normal.woff2")}) format('woff2')}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:600px;height:800px;overflow:hidden;background:#FFF8E7}
.stage{position:relative;width:600px;height:800px;overflow:hidden;font-family:Oswald,sans-serif}
.dots{position:absolute;inset:0;background-image:radial-gradient(var(--dot) 22%,transparent 23%);background-size:18px 18px;opacity:.35}
.rays{position:absolute;inset:-50%;background:repeating-conic-gradient(from 0deg at 50% 50%,var(--ray) 0deg 6deg,transparent 6deg 14deg);opacity:.22}
.ink{border:6px solid #111318}
.title{font-family:Bangers,cursive;letter-spacing:2px;line-height:.92;color:var(--fg);-webkit-text-stroke:2px #111318;paint-order:stroke fill;text-shadow:5px 5px 0 #111318}
.burst{position:absolute;display:grid;place-items:center;background:var(--accent);color:#111318;font-family:Bangers;clip-path:polygon(50% 0,61% 18%,82% 7%,79% 30%,100% 34%,85% 50%,100% 66%,79% 70%,82% 93%,61% 82%,50% 100%,39% 82%,18% 93%,21% 70%,0 66%,15% 50%,0 34%,21% 30%,18% 7%,39% 18%)}
.badge{position:absolute;background:#FFF8E7;border:4px solid #111318;font-family:Bangers;padding:6px 12px;font-size:26px;color:#111318;box-shadow:4px 4px 0 #111318}
.demo{position:absolute;right:14px;bottom:12px;font:600 13px Oswald;letter-spacing:2px;color:#111318;background:#FFF8E7;border:3px solid #111318;padding:2px 8px}
`

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")

function comic(p, alt) {
  const a = p.art
  const bg = alt ? a.accent : a.bg
  return `
  <div class="stage ink" style="--fg:${a.fg};--accent:${alt ? a.bg : a.accent};--dot:#111318;--ray:${a.fg};background:${bg}">
    <div class="rays"></div><div class="dots"></div>
    <div style="position:absolute;left:0;right:0;top:0;height:150px;background:#111318;display:flex;align-items:center;padding:0 28px;gap:16px">
      <div style="font:700 22px Oswald;color:${a.accent};letter-spacing:3px;writing-mode:vertical-rl;transform:rotate(180deg)">G&amp;C</div>
      <div class="title" style="font-size:${p.title.length > 18 ? 56 : 72}px;color:${a.fg};text-shadow:4px 4px 0 ${a.accent}">${esc(p.title.split("—")[0].replace(/#\d+/, ""))}</div>
    </div>
    <svg viewBox="0 0 600 600" style="position:absolute;left:40px;top:${alt ? 220 : 190}px;width:520px;height:520px">
      <circle cx="300" cy="300" r="${alt ? 170 : 200}" fill="${a.fg}" stroke="#111318" stroke-width="8"/>
      <polygon points="330,60 200,330 290,330 240,560 420,250 320,250 390,60" fill="${a.accent}" stroke="#111318" stroke-width="10" stroke-linejoin="round" transform="${alt ? "rotate(-12 300 300)" : ""}"/>
    </svg>
    <div class="burst" style="right:24px;top:170px;width:150px;height:150px;font-size:40px">${esc(a.label)}</div>
    <div class="badge" style="left:24px;bottom:28px;transform:rotate(-4deg)">${alt ? "VARIANT" : "€ " + p.variants[0].price.toFixed(2).replace(".", ",")}</div>
    <div class="demo">DEMO</div>
  </div>`
}

function manga(p, alt) {
  const a = p.art
  const bg = alt ? a.bg : "#FFF8E7"
  return `
  <div class="stage ink" style="--fg:${a.fg};--accent:${a.accent};--dot:${a.accent};--ray:${a.accent};background:${bg}">
    <div class="dots" style="opacity:.25"></div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:120px;background:${alt ? "#111318" : a.bg};border-right:6px solid #111318;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:26px 0">
      <div style="font:900 ${a.label.length > 1 ? 40 : 80}px 'Noto Sans CJK JP','Noto Sans CJK SC',Bangers,sans-serif;color:${alt ? a.bg : a.accent};-webkit-text-stroke:3px #111318">${esc(a.label)}</div>
      <div style="font-family:Bangers;font-size:64px;color:#FFF8E7;-webkit-text-stroke:2px #111318;writing-mode:vertical-rl">${esc(p.variants[0].options.Volume ? "VOL." + p.variants[0].options.Volume : a.label)}</div>
    </div>
    <svg viewBox="0 0 480 560" style="position:absolute;left:120px;top:140px;width:480px;height:560px">
      ${Array.from({ length: 22 }, (_, i) => `<line x1="240" y1="280" x2="${240 + Math.cos(i / 3.5) * 600}" y2="${280 + Math.sin(i / 3.5) * 600}" stroke="#111318" stroke-width="${i % 2 ? 2 : 5}"/>`).join("")}
      <circle cx="240" cy="280" r="${alt ? 120 : 150}" fill="${a.accent}" stroke="#111318" stroke-width="8"/>
      <circle cx="240" cy="280" r="${alt ? 60 : 80}" fill="${alt ? "#FFF8E7" : a.bg}" stroke="#111318" stroke-width="8"/>
    </svg>
    <div class="title" style="position:absolute;left:150px;right:24px;top:30px;font-size:${p.title.length > 20 ? 52 : 64}px;color:${a.accent}">${esc(p.title.replace(/Vol\. \d+/, "").split("—")[0])}</div>
    <div class="demo">DEMO</div>
  </div>`
}

function tcg(p, alt) {
  const a = p.art
  const zig = Array.from({ length: 31 }, (_, i) => `${(i * 100) / 30}% ${i % 2 ? 3 : 0}%`).join(",")
  const zigB = Array.from({ length: 31 }, (_, i) => `${100 - (i * 100) / 30}% ${i % 2 ? 97 : 100}%`).join(",")
  if (alt) {
    return `
    <div class="stage" style="--accent:${a.accent};--dot:#111318;--ray:${a.bg};background:#FFF8E7">
      <div class="rays" style="opacity:.25"></div>
      ${[-18, -6, 6, 18].map((r, i) => `<div class="ink" style="position:absolute;left:190px;top:170px;width:220px;height:310px;border-radius:16px;background:linear-gradient(135deg,${a.bg},${a.accent});transform:rotate(${r}deg) translateY(${i * 6}px);transform-origin:50% 120%;box-shadow:6px 6px 0 #111318;display:grid;place-items:center"><div style="width:150px;height:150px;border-radius:50%;border:6px solid #111318;background:${a.fg}"></div></div>`).join("")}
      <div class="title" style="position:absolute;left:0;right:0;bottom:90px;text-align:center;font-size:58px;--fg:${a.bg}">CARTE IN ITALIANO</div>
      <div class="demo">DEMO</div>
    </div>`
  }
  return `
  <div class="stage" style="--fg:${a.fg};--accent:${a.accent};--dot:#111318;--ray:${a.accent};background:#FFF8E7">
    <div style="position:absolute;left:90px;top:40px;width:420px;height:720px;clip-path:polygon(${zig},${zigB});background:linear-gradient(160deg,${a.bg} 0%,${a.accent} 45%,#FFF8E7 52%,${a.bg} 60%,${a.accent} 100%);">
      <div class="dots" style="opacity:.25"></div>
      <div style="position:absolute;inset:40px 24px;border:6px solid #111318;border-radius:18px;background:${a.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px">
        <div style="width:230px;height:230px;border-radius:50%;border:8px solid #111318;background:conic-gradient(${a.accent},${a.fg},${a.accent},${a.fg},${a.accent});box-shadow:6px 6px 0 #111318"></div>
        <div class="title" style="font-size:66px">${esc(a.label)}</div>
        <div style="font:700 22px Oswald;letter-spacing:4px;color:${a.fg};text-align:center;padding:0 20px">${esc(p.title.split("—")[0].trim().toUpperCase())}</div>
      </div>
    </div>
    <div class="demo">DEMO</div>
  </div>`
}

function box(p, alt) {
  const a = p.art
  return `
  <div class="stage" style="--fg:${a.fg};--accent:${a.accent};--dot:${a.accent};--ray:${a.bg};background:${alt ? a.bg : "#FFF8E7"}">
    <div class="rays"></div>
    <div style="position:absolute;left:70px;top:${alt ? 150 : 120}px;width:460px;height:520px;transform:perspective(900px) rotateY(${alt ? 16 : -14}deg) rotateX(6deg)">
      <div class="ink" style="position:absolute;inset:0;background:${a.bg};box-shadow:${alt ? "-" : ""}22px 22px 0 #111318;overflow:hidden">
        <div class="dots" style="--dot:${a.accent}"></div>
        <div style="position:absolute;left:0;right:0;top:0;padding:26px;background:#111318">
          <div class="title" style="font-size:${p.title.length > 22 ? 44 : 56}px;--fg:${a.fg};text-shadow:3px 3px 0 ${a.accent}">${esc(p.title.split("—")[0])}</div>
        </div>
        <div class="burst" style="left:130px;top:220px;width:200px;height:200px;font-size:54px;background:${a.accent === "#111318" ? a.fg : a.accent}">${esc(a.label)}</div>
      </div>
    </div>
    <div class="demo">DEMO</div>
  </div>`
}

function merch(p, alt) {
  const a = p.art
  const isTee = a.label === "TEE"
  const shape = isTee
    ? `<path d="M150 90 L230 60 Q300 110 370 60 L450 90 L540 190 L470 250 L440 220 L440 560 L160 560 L160 220 L130 250 L60 190 Z" fill="${alt ? "#111318" : a.bg}" stroke="#111318" stroke-width="10" stroke-linejoin="round"/>`
    : `<path d="M150 150 L420 150 L400 540 Q285 580 170 540 Z" fill="${a.bg}" stroke="#111318" stroke-width="10"/><path d="M420 230 Q520 240 500 340 Q485 420 405 420" fill="none" stroke="#111318" stroke-width="26"/><path d="M420 230 Q520 240 500 340 Q485 420 405 420" fill="none" stroke="${a.bg}" stroke-width="10"/>`
  return `
  <div class="stage" style="--fg:${a.fg};--accent:${a.accent};--dot:#111318;--ray:${a.accent};background:${alt ? a.accent : "#FFF8E7"}">
    <div class="dots" style="opacity:.18"></div>
    <svg viewBox="0 0 600 640" style="position:absolute;left:0;top:90px;width:600px;height:640px">${shape}</svg>
    <div class="burst" style="left:${isTee ? 200 : 185}px;top:${isTee ? 330 : 360}px;width:200px;height:200px;font-size:${isTee ? 34 : 56}px;--accent:${isTee ? a.accent : a.accent}">${isTee ? "G&amp;C<br>SHOP" : esc(a.label)}</div>
    <div class="title" style="position:absolute;left:30px;top:30px;font-size:54px;--fg:${a.bg}">${esc(p.title.split("—")[0].replace(/"/g, ""))}</div>
    <div class="demo">DEMO</div>
  </div>`
}

const renderers = { comic, manga, tcg, box, merch }

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 600, height: 800 } })
for (const p of products) {
  for (const n of [1, 2]) {
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${renderers[p.art.kind](p, n === 2)}</body></html>`
    await page.setContent(html, { waitUntil: "load" })
    await page.evaluate(() => document.fonts.ready)
    const png = (await page.screenshot({ type: "png" })).toString("base64")
    // Conversione PNG -> WebP direttamente nel browser (nessuna dipendenza extra)
    const webp = await page.evaluate(async (b64) => {
      const img = new Image()
      img.src = "data:image/png;base64," + b64
      await img.decode()
      const c = document.createElement("canvas")
      c.width = img.width
      c.height = img.height
      c.getContext("2d").drawImage(img, 0, 0)
      return c.toDataURL("image/webp", 0.86).split(",")[1]
    }, png)
    writeFileSync(join(outDir, `${p.handle}-${n}.webp`), Buffer.from(webp, "base64"))
    process.stdout.write(".")
  }
}
await browser.close()
console.log(`\n${products.length * 2} immagini in ${outDir}`)
