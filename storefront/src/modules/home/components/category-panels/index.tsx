import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"
import Image from "next/image"

/** Colori e forma di ogni vignetta, per handle di categoria */
const look: Record<string, { bg: string; fg: string; span: string }> = {
  fumetti: { bg: "bg-gc-red", fg: "text-white", span: "small:col-span-2 small:row-span-2" },
  manga: { bg: "bg-white", fg: "text-gc-ink", span: "" },
  "carte-collezionabili": { bg: "bg-gc-blue", fg: "text-white", span: "small:row-span-2" },
  "giochi-da-tavolo": { bg: "bg-gc-mint", fg: "text-gc-ink", span: "" },
  gadget: { bg: "bg-gc-orange", fg: "text-gc-ink", span: "col-span-2 small:col-span-4" },
}
const fallback = { bg: "bg-gc-sun", fg: "text-gc-ink", span: "" }

/**
 * Le categorie impaginate come una tavola a fumetti: vignette di misure
 * diverse, separate dal "bianco" della gabbia.
 */
export default function CategoryPanels({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) {
  const roots = categories
    .filter((c) => !c.parent_category)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))

  return (
    <section className="content-container py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <h2 className="section-title">Cosa stai cercando?</h2>
        <LocalizedClientLink href="/store" className="font-semibold underline decoration-[3px] decoration-gc-yellow underline-offset-4 hover:decoration-gc-ink">
          Vedi tutto il catalogo
        </LocalizedClientLink>
      </div>
      <Reveal>
        <ul className="grid grid-cols-2 small:grid-cols-4 small:auto-rows-[220px] gap-3 small:gap-4">
          {roots.map((c) => {
            const l = look[c.handle] ?? fallback
            const covers = (c.products ?? [])
              .map((p) => p.thumbnail)
              .filter(Boolean)
              .slice(0, 2) as string[]
            // i prodotti delle sottocategorie sono già collegati anche alla radice
            const count = new Set((c.products ?? []).map((p) => p.id)).size
            const big = c.handle === "fumetti"
            return (
              <li key={c.id} className={clx("col-span-1 min-h-[180px]", l.span, big && "col-span-2")}>
                <LocalizedClientLink
                  href={`/categories/${c.handle}`}
                  className={clx(
                    "group relative flex h-full flex-col justify-between overflow-hidden border-[3px] border-gc-ink shadow-ink p-4 small:p-6 transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-ink-lg",
                    l.bg,
                    l.fg
                  )}
                >
                  <div aria-hidden className="absolute inset-0 halftone opacity-50" />
                  <div className={clx("relative z-10", big ? "max-w-[70%]" : "max-w-[65%] small:max-w-none")}>
                    <h3
                      className={clx(
                        "comic-title",
                        big ? "text-5xl small:text-7xl" : "text-[1.7rem] small:text-[2.1rem] break-words hyphens-auto small:hyphens-none"
                      )}
                    >
                      {c.name}
                    </h3>
                    {c.description && (
                      <p className={clx("mt-2 text-sm small:text-base opacity-90", !big && "hidden small:block small:max-w-[70%]")}>
                        {c.description}
                      </p>
                    )}
                  </div>
                  <span className="relative z-10 self-start text-sm font-bold px-2 py-0.5 bg-white text-gc-ink border-2 border-gc-ink">
                    {count} {count === 1 ? "prodotto" : "prodotti"}
                  </span>
                  {covers.map((src, i) => (
                    <div
                      key={src}
                      aria-hidden
                      className={clx(
                        "absolute border-[3px] border-gc-ink shadow-ink bg-white transition-transform duration-300",
                        big ? "w-[38%] max-w-[220px]" : "w-[30%] max-w-[96px]",
                        i === 0
                          ? "right-[6%] bottom-[-8%] rotate-[8deg] group-hover:rotate-[2deg] group-hover:-translate-y-3"
                          : clx(
                              "bottom-[-14%] -rotate-[10deg] group-hover:-rotate-[4deg] group-hover:-translate-y-2",
                              big || c.handle === "gadget" ? "right-[22%] hidden small:block" : "hidden"
                            )
                      )}
                    >
                      <div className="relative aspect-[3/4]">
                        <Image src={src} alt="" fill sizes="220px" className="object-cover" />
                      </div>
                    </div>
                  ))}
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      </Reveal>
    </section>
  )
}
