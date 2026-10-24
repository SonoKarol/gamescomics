"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title?: string
}

const ImageGallery = ({ images, title = "" }: ImageGalleryProps) => {
  const [active, setActive] = useState(0)
  const current = images[active] ?? images[0]

  return (
    <div className="flex flex-col gap-4 small:sticky small:top-[140px] small:self-start">
      <div className="relative aspect-[3/4] w-full max-w-[560px] mx-auto border-[3px] border-gc-ink shadow-ink-lg bg-gc-newsprint overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {current?.url && (
            <motion.div
              key={current.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Image
                src={current.url}
                priority
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <ul className="flex gap-3 justify-center" aria-label="Altre immagini">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                onClick={() => setActive(i)}
                aria-label={`Immagine ${i + 1}`}
                aria-current={i === active}
                className={clx(
                  "relative block w-20 aspect-[3/4] border-[3px] border-gc-ink overflow-hidden transition-transform",
                  i === active ? "shadow-ink -translate-y-1" : "opacity-70 hover:opacity-100"
                )}
              >
                {img.url && (
                  <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ImageGallery
