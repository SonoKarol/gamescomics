import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

/** Etichetta mostrata sull'angolo della copertina */
function getBadge(product: HttpTypes.StoreProduct) {
  const variants = product.variants ?? []
  const managed = variants.filter((v) => v.manage_inventory)
  const stock = managed.reduce((s, v) => s + (v.inventory_quantity ?? 0), 0)

  if (managed.length && managed.length === variants.length && stock <= 0)
    return { label: "Esaurito", className: "bg-gc-ink text-white" }
  if (managed.length && stock > 0 && stock <= 10)
    return { label: "Ultimi pezzi", className: "bg-gc-red text-white" }
  if (product.collection?.handle === "novita")
    return { label: "Novità", className: "bg-gc-mint text-gc-ink" }
  return null
}

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })
  const badge = getBadge(product)
  const hasManyPrices =
    new Set(product.variants?.map((v) => v.calculated_price?.calculated_amount)).size > 1

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full"
      data-testid="product-wrapper"
    >
      <article
        className="h-full flex flex-col panel transition-[transform,box-shadow] duration-200
          group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-ink-lg"
      >
        <div className="relative border-b-[3px] border-gc-ink">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          {badge && (
            <span
              className={clx(
                "absolute top-3 left-3 px-2.5 py-1 text-sm font-bold border-2 border-gc-ink shadow-ink-sm -rotate-3",
                badge.className
              )}
            >
              {badge.label}
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 gap-1 p-3 small:p-4">
          <h3
            className="font-bold leading-snug text-[15px] small:text-base line-clamp-2"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          {product.subtitle && (
            <p className="text-sm text-gc-ink/65 line-clamp-1">{product.subtitle}</p>
          )}
          <div className="mt-auto pt-2 flex items-baseline gap-2">
            {hasManyPrices && <span className="text-xs text-gc-ink/65">da</span>}
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
