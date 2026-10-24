"use client"

import { clx } from "@medusajs/ui"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Ultimi arrivi" },
  { value: "price_asc", label: "Prezzo crescente" },
  { value: "price_desc", label: "Prezzo decrescente" },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  return (
    <div className="flex items-center gap-3" data-testid={dataTestId}>
      <span className="text-sm font-semibold shrink-0">Ordina per</span>
      <div role="radiogroup" aria-label="Ordina per" className="flex flex-wrap gap-2">
        {sortOptions.map((o) => (
          <button
            key={o.value}
            role="radio"
            aria-checked={o.value === sortBy}
            onClick={() => setQueryParams("sortBy", o.value)}
            className={clx(
              "px-3 h-9 text-sm font-semibold border-2 border-gc-ink transition-colors",
              o.value === sortBy ? "bg-gc-ink text-white" : "bg-white hover:bg-gc-sun"
            )}
            data-testid="radio-label"
            data-active={o.value === sortBy}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SortProducts
