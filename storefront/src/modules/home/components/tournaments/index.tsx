import { shop } from "@lib/shop-config"
import Reveal from "@modules/common/components/reveal"

/** Calendario settimanale dei tornei in negozio (dati in lib/shop-config.ts) */
export default function Tournaments() {
  return (
    <section id="tornei" className="relative bg-gc-ink text-white my-16 scroll-mt-28 overflow-hidden">
      <div aria-hidden className="absolute inset-0 halftone-light opacity-40" />
      <div className="content-container relative py-20 grid gap-12 small:grid-cols-[0.9fr_1.4fr] items-center">
        <div>
          <h2 className="comic-title text-6xl small:text-7xl text-gc-yellow">
            Si gioca in negozio
          </h2>
          <p className="mt-4 text-lg text-white/85 max-w-md leading-relaxed">
            Ogni settimana organizziamo tornei ufficiali per tutti i livelli. Porta
            il tuo mazzo, iscriviti in cassa fino a 15 minuti prima dell'inizio e
            preparati a sfidare la community di {shop.address.city}.
          </p>
        </div>
        <Reveal>
          <ul className="grid gap-5 small:grid-cols-3">
            {shop.tournaments.map((t, i) => (
              <li
                key={t.game}
                className="relative border-[3px] border-white p-5 flex flex-col gap-3 shadow-ink-yellow"
                style={{ background: t.color, color: t.text, transform: `rotate(${[-1.5, 1, -0.5][i % 3]}deg)` }}
              >
                <span className="comic-title text-5xl">{t.day}</span>
                <span className="text-xl font-bold">ore {t.time}</span>
                <span className="font-semibold text-lg leading-tight">{t.game}</span>
                <span className="text-sm opacity-85">{t.format}</span>
                <span className="mt-auto self-start px-2 py-0.5 text-sm font-bold bg-white text-gc-ink border-2 border-gc-ink">
                  Iscrizione {t.fee}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
