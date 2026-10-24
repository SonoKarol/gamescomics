"use client"

import { motion, useReducedMotion } from "motion/react"
import { ReactNode } from "react"

/**
 * Entrata "a vignetta": l'elemento si posa con un leggero rimbalzo quando
 * entra nel viewport. Usato con parsimonia (titoli di sezione, griglie).
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay }}
    >
      {children}
    </motion.div>
  )
}
