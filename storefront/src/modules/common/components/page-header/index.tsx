import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"
import { ReactNode } from "react"

type Crumb = { label: string; href?: string }

/** Testata delle pagine di elenco: fascia colorata con titolo in lettering. */
export default function PageHeader({
  title,
  description,
  crumbs = [],
  color = "bg-gc-yellow",
  children,
  testId,
}: {
  title: string
  description?: string | null
  crumbs?: Crumb[]
  color?: string
  children?: ReactNode
  testId?: string
}) {
  return (
    <header className={clx("relative border-b-[3px] border-gc-ink overflow-hidden", color)}>
      <div aria-hidden className="absolute inset-0 halftone opacity-60" />
      <div className="content-container relative py-10 small:py-14">
        {crumbs.length > 0 && (
          <nav aria-label="Percorso" className="mb-3 text-sm font-semibold">
            <ol className="flex flex-wrap gap-2">
              <li>
                <LocalizedClientLink href="/" className="hover:underline">
                  Home
                </LocalizedClientLink>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex gap-2">
                  <span aria-hidden>/</span>
                  {c.href ? (
                    <LocalizedClientLink href={c.href} className="hover:underline">
                      {c.label}
                    </LocalizedClientLink>
                  ) : (
                    <span>{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="comic-title text-6xl small:text-8xl text-white comic-outline" data-testid={testId}>
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg font-medium">{description}</p>
        )}
        {children}
      </div>
    </header>
  )
}
