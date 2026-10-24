import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

const copy: Record<string, { title: string; intro: string }> = {
  novita: {
    title: "Appena arrivati",
    intro: "Le uscite della settimana, fresche di scatolone.",
  },
  bestseller: {
    title: "I più richiesti",
    intro: "Quello che i nostri clienti non smettono di comprare.",
  },
}

export default async function FeaturedProducts({
  collection,
  region,
}: {
  collection?: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  if (!collection) return null
  const c = copy[collection.handle]
  return (
    <ProductRail
      collection={collection}
      region={region}
      title={c?.title}
      intro={c?.intro}
    />
  )
}
