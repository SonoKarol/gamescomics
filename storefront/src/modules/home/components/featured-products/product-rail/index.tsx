import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
  title,
  intro,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
  title?: string
  intro?: string
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: { collection_id: [collection.id], limit: 8 },
  })

  if (!products?.length) return null

  return (
    <section className="content-container py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="section-title">{title ?? collection.title}</h2>
          {intro && <p className="mt-2 text-lg text-gc-ink/75 max-w-xl">{intro}</p>}
        </div>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="btn btn-light h-11 text-lg"
        >
          Vedi tutti
        </LocalizedClientLink>
      </div>
      {/* scorrimento orizzontale su mobile, griglia da desktop */}
      <ul
        className="-mx-4 px-4 pb-4 flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar
          small:mx-0 small:px-0 small:grid small:grid-cols-4 small:gap-6 small:overflow-visible"
      >
        {products.slice(0, 4).map((product) => (
          <li key={product.id} className="snap-start shrink-0 w-[62%] xsmall:w-[40%] small:w-auto">
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </section>
  )
}
