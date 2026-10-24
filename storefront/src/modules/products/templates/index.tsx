import React, { Suspense } from "react"

import { shop } from "@lib/shop-config"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const category = product.categories?.find((c) => !c.parent_category_id) ?? product.categories?.[0]

  return (
    <>
      <div className="bg-gc-newsprint border-b-[3px] border-gc-ink">
        <nav aria-label="Percorso" className="content-container py-3 text-sm font-semibold">
          <ol className="flex flex-wrap gap-2">
            <li>
              <LocalizedClientLink href="/" className="hover:underline">Home</LocalizedClientLink>
            </li>
            <li aria-hidden>/</li>
            <li>
              <LocalizedClientLink href="/store" className="hover:underline">Catalogo</LocalizedClientLink>
            </li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <LocalizedClientLink href={`/categories/${category.handle}`} className="hover:underline">
                    {category.name}
                  </LocalizedClientLink>
                </li>
              </>
            )}
          </ol>
        </nav>
      </div>

      <div
        className="content-container grid gap-10 small:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] small:gap-14 py-10 small:py-14"
        data-testid="product-container"
      >
        <ImageGallery images={images} title={product.title ?? ""} />

        <div className="flex flex-col gap-8 small:sticky small:top-[140px] small:self-start">
          <ProductInfo product={product} />
          <div className="panel p-5 small:p-6">
            <Suspense
              fallback={<ProductActions disabled={true} product={product} region={region} />}
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
            <ul className="mt-5 pt-5 border-t-2 border-dashed border-gc-ink/30 grid gap-2 text-sm">
              <li className="flex gap-2">
                <span aria-hidden className="w-2 h-2 mt-1.5 bg-gc-mint border border-gc-ink shrink-0" />
                Ritiro gratuito nel negozio di {shop.address.city}
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="w-2 h-2 mt-1.5 bg-gc-yellow border border-gc-ink shrink-0" />
                Spedizione gratuita sopra i {shop.freeShippingThreshold} €
              </li>
            </ul>
          </div>
          <ProductTabs product={product} />
        </div>
      </div>

      <div className="content-container my-10" data-testid="related-products-container">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
