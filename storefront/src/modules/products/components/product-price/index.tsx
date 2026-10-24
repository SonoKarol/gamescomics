import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-12 bg-gc-newsprint animate-pulse" />
  }

  return (
    <div className="flex items-end gap-3 flex-wrap">
      <span
        className={clx("comic-title text-5xl", {
          "text-gc-red": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && <span className="text-2xl mr-1">da</span>}
        <span data-testid="product-price" data-value={selectedPrice.calculated_price_number}>
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <span className="flex items-center gap-2 pb-1.5">
          <span
            className="line-through text-gc-ink/60"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
          <span className="px-1.5 bg-gc-red text-white font-bold text-sm border-2 border-gc-ink">
            -{selectedPrice.percentage_diff}%
          </span>
        </span>
      )}
      <span className="text-xs text-gc-ink/60 pb-2 w-full">IVA inclusa</span>
    </div>
  )
}
