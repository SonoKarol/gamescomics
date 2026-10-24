import { Metadata } from "next"

import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { shop } from "@lib/shop-config"
import CategoryPanels from "@modules/home/components/category-panels"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Tournaments from "@modules/home/components/tournaments"
import VisitShop from "@modules/home/components/visit-shop"

export const metadata: Metadata = {
  title: { absolute: `${shop.name} — Fumetti, manga e carte collezionabili` },
  description: shop.tagline,
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const region = await getRegion(countryCode)
  if (!region) return null

  const [{ collections }, categories] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    listCategories().catch(() => []),
  ])

  const novita = collections.find((c) => c.handle === "novita")
  const bestseller = collections.find((c) => c.handle === "bestseller")

  // Copertine per il ventaglio dell'hero: le novità, altrimenti gli ultimi arrivi
  const {
    response: { products: heroProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 4,
      ...(novita ? { collection_id: [novita.id] } : {}),
      fields: "handle,title,thumbnail",
    },
  })

  return (
    <>
      <Hero
        covers={heroProducts.map((p) => ({
          handle: p.handle!,
          title: p.title!,
          thumbnail: p.thumbnail ?? null,
        }))}
      />
      <CategoryPanels categories={categories ?? []} />
      <FeaturedProducts collection={novita} region={region} />
      <Tournaments />
      <FeaturedProducts collection={bestseller} region={region} />
      <VisitShop />
    </>
  )
}
