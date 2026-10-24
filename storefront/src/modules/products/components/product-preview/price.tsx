import { clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      <span
        className={clx("comic-title text-2xl", {
          "text-gc-red": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
      {price.price_type === "sale" && (
        <span className="line-through text-sm text-gc-ink/50" data-testid="original-price">
          {price.original_price}
        </span>
      )}
    </>
  )
}
