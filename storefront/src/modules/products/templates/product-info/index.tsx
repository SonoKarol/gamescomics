import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-4">
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="self-start px-2 py-0.5 text-sm font-bold bg-gc-mint border-2 border-gc-ink -rotate-2"
        >
          {product.collection.title}
        </LocalizedClientLink>
      )}
      <h1
        className="comic-title text-5xl small:text-6xl text-gc-ink"
        data-testid="product-title"
      >
        {product.title}
      </h1>
      {product.subtitle && (
        <p className="text-lg font-semibold text-gc-ink/75">{product.subtitle}</p>
      )}
      {product.description && (
        <p
          className="text-base leading-relaxed text-gc-ink/85 whitespace-pre-line max-w-prose"
          data-testid="product-description"
        >
          {product.description}
        </p>
      )}
    </div>
  )
}

export default ProductInfo
