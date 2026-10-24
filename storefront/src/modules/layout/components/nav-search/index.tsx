"use client"

import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { AnimatePresence, motion } from "motion/react"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"

/** Ricerca prodotti: si apre come una barra sotto la navbar. */
export default function NavSearch() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { countryCode } = useParams()

  useEffect(() => {
    if (open) inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!q.trim()) return
    setOpen(false)
    router.push(`/${countryCode}/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid place-items-center w-11 h-11 border-[3px] border-transparent hover:border-gc-ink hover:bg-gc-sun transition-colors"
        aria-label={open ? "Chiudi ricerca" : "Cerca nel catalogo"}
        aria-expanded={open}
      >
        {open ? <XMark /> : <MagnifyingGlass />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.form
            onSubmit={submit}
            role="search"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute left-0 right-0 top-full bg-gc-yellow border-b-[3px] border-gc-ink"
          >
            <div className="content-container py-4 flex gap-3">
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                name="q"
                placeholder="Cerca un fumetto, un manga, una busta..."
                aria-label="Cerca nel catalogo"
                className="flex-1 h-12 px-4 border-[3px] border-gc-ink bg-white text-lg outline-none focus:shadow-ink"
              />
              <button type="submit" className="btn btn-ink">
                Cerca
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  )
}
