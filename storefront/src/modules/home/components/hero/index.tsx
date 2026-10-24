"use client"

import { shop } from "@lib/shop-config"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import Image from "next/image"
import { MouseEvent } from "react"

type Cover = { handle: string; title: string; thumbnail: string | null }

const fan = [
  { rotate: -16, x: -150, y: 30 },
  { rotate: -5, x: -50, y: -10 },
  { rotate: 6, x: 55, y: 0 },
  { rotate: 17, x: 150, y: 40 },
]

/**
 * Splash page: il logo "esplode" sulla pagina, il balloon entra subito dopo e
 * le copertine delle novità si aprono a ventaglio. Il ventaglio segue il mouse.
 */
export default function Hero({ covers }: { covers: Cover[] }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 18 })
  const sy = useSpring(my, { stiffness: 120, damping: 18 })
  const rotY = useTransform(sx, [-0.5, 0.5], [-10, 10])
  const rotX = useTransform(sy, [-0.5, 0.5], [8, -8])

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const t = (delay: number) =>
    reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 18, delay }

  return (
    <section
      onMouseMove={onMove}
      className="relative overflow-hidden bg-gc-yellow border-b-[3px] border-gc-ink"
    >
      {/* linee cinetiche + retino */}
      <div
        aria-hidden
        className="absolute inset-[-40%] opacity-[0.18]"
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 70% 50%, #fff 0deg 5deg, transparent 5deg 13deg)",
        }}
      />
      <div aria-hidden className="absolute inset-0 halftone opacity-60" />

      <div className="content-container relative grid small:grid-cols-[1.05fr_1fr] items-center gap-10 pt-10 pb-16 small:py-20 min-h-[calc(100svh-111px)] small:min-h-[640px]">
        <div className="flex flex-col items-start gap-8">
          <motion.h1
            initial={{ scale: 0.4, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: -2, opacity: 1 }}
            transition={t(0.05)}
            className="w-full max-w-[620px]"
          >
            <Image
              src="/brand/logo-wide.webp"
              alt={shop.name}
              width={1000}
              height={226}
              priority
              className="w-full h-auto drop-shadow-[5px_5px_0_rgba(21,19,26,0.9)]"
            />
          </motion.h1>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={t(0.35)}
            className="balloon px-6 py-5 small:px-8 small:py-6 max-w-[540px]"
          >
            <p className="comic-title text-[2rem] small:text-[2.6rem]">
              Il tuo prossimo albo preferito ti aspetta.
            </p>
            <p className="mt-2 text-base small:text-lg leading-relaxed">
              Fumetti, manga, carte collezionabili e giochi da tavolo. Spediamo in
              tutta Italia, oppure passi a ritirarlo in negozio a {shop.address.city}.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={t(0.5)}
            className="flex flex-wrap gap-4 pt-4"
          >
            <LocalizedClientLink href="/store" className="btn btn-ink">
              Sfoglia il catalogo
            </LocalizedClientLink>
            <a href="#tornei" className="btn btn-light">
              Tornei della settimana
            </a>
          </motion.div>
        </div>

        {/* Ventaglio di copertine */}
        <motion.div
          style={{ rotateY: rotY, rotateX: rotX, transformPerspective: 1200 }}
          className="relative h-[340px] small:h-[520px] hidden xsmall:block"
        >
          {covers.slice(0, 4).map((c, i) => (
            <motion.div
              key={c.handle}
              className="absolute left-1/2 top-1/2 w-[180px] small:w-[250px] -ml-[90px] small:-ml-[125px] -mt-[120px] small:-mt-[167px]"
              initial={{ x: 0, y: 80, rotate: 0, opacity: 0 }}
              animate={{ x: fan[i].x, y: fan[i].y, rotate: fan[i].rotate, opacity: 1 }}
              transition={t(0.55 + i * 0.08)}
              whileHover={reduce ? undefined : { y: fan[i].y - 24, rotate: 0, zIndex: 10 }}
            >
              <LocalizedClientLink
                href={`/products/${c.handle}`}
                className="block border-[3px] border-gc-ink shadow-ink-lg bg-white aspect-[3/4] relative overflow-hidden"
                aria-label={c.title}
              >
                {c.thumbnail && (
                  <Image
                    src={c.thumbnail}
                    alt=""
                    fill
                    sizes="250px"
                    className="object-cover"
                    priority={i < 2}
                  />
                )}
              </LocalizedClientLink>
            </motion.div>
          ))}
          <motion.div
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={t(1)}
            className="absolute right-2 top-2 small:right-6 small:top-4 burst bg-gc-red w-28 h-28 small:w-36 small:h-36 grid place-items-center"
          >
            <span className="comic-title text-white text-2xl small:text-3xl text-center leading-none">
              Nuovi
              <br />
              arrivi!
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
