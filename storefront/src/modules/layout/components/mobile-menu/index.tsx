"use client"

import { BarsThree, XMark } from "@medusajs/icons"
import { shop } from "@lib/shop-config"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type Props = { categories: { name: string; handle: string }[] }

/** Menu mobile a tutto schermo, giallo come la copertina di un albo. */
export default function MobileMenu({ categories }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
  }, [open])

  const links = [
    { label: "Tutto il catalogo", href: "/store" },
    ...categories.map((c) => ({ label: c.name, href: `/categories/${c.handle}` })),
    { label: "Il mio account", href: "/account" },
    { label: "Carrello", href: "/cart" },
  ]

  return (
    <div className="small:hidden">
      <button
        onClick={() => setOpen(true)}
        className="grid place-items-center w-11 h-11 border-[3px] border-gc-ink bg-gc-yellow shadow-ink-sm"
        aria-label="Apri menu"
        data-testid="nav-menu-button"
      >
        <BarsThree />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-gc-yellow halftone flex flex-col"
            initial={{ clipPath: "circle(0% at 32px 32px)" }}
            animate={{ clipPath: "circle(150% at 32px 32px)" }}
            exit={{ clipPath: "circle(0% at 32px 32px)" }}
            transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
            data-testid="nav-menu-popup"
          >
            <div className="flex items-center justify-between p-4">
              <span className="comic-title text-3xl">{shop.shortName}</span>
              <button
                onClick={() => setOpen(false)}
                className="grid place-items-center w-11 h-11 border-[3px] border-gc-ink bg-white shadow-ink-sm"
                aria-label="Chiudi menu"
                data-testid="close-menu-button"
              >
                <XMark />
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 300, damping: 24 }}
                >
                  <LocalizedClientLink
                    href={l.href}
                    className="comic-title text-[2.6rem] text-white comic-outline block py-1"
                  >
                    {l.label}
                  </LocalizedClientLink>
                </motion.li>
              ))}
            </ul>
            <p className="p-6 text-sm font-semibold">{shop.tagline}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
