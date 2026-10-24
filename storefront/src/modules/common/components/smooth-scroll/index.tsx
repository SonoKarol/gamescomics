"use client"

import Lenis from "lenis"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

/**
 * Scroll fluido con Lenis. Disattivato se l'utente preferisce meno animazioni
 * e sui dispositivi touch (dove lo scroll nativo è già fluido).
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenisRef.current = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Torna in cima a ogni cambio pagina
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [pathname])

  return null
}
