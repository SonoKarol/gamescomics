import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import PageHeader from "@modules/common/components/page-header"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Cerca",
  robots: { index: false },
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage(props: Props) {
  const { countryCode } = await props.params
  const { q = "" } = await props.searchParams
  const query = q.trim().slice(0, 100)

  const region = await getRegion(countryCode)
  if (!region) notFound()

  const products = query
    ? (
        await listProducts({
          countryCode,
          queryParams: { q: query, limit: 48 },
        })
      ).response.products
    : []

  return (
    <>
      <PageHeader
        title={query ? `“${query}”` : "Cerca"}
        description={
          query
            ? `${products.length} ${products.length === 1 ? "risultato" : "risultati"} nel catalogo`
            : "Scrivi il titolo, l'autore o il gioco che stai cercando."
        }
        color="bg-gc-sun"
        crumbs={[{ label: "Ricerca" }]}
      >
        <form action={`/${countryCode}/search`} className="mt-6 flex gap-3 max-w-xl" role="search">
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Es. Kitsune Blade, Pokémon, Magic..."
            aria-label="Cerca nel catalogo"
            className="flex-1 h-12 px-4 border-[3px] border-gc-ink bg-white text-lg outline-none focus:shadow-ink"
          />
          <button className="btn btn-ink" type="submit">
            Cerca
          </button>
        </form>
      </PageHeader>
      <div className="content-container py-10">
        {query && !products.length ? (
          <div className="panel p-10 text-center flex flex-col items-center gap-4">
            <p className="comic-title text-4xl">Niente da fare, nessun risultato</p>
            <p>Prova con un'altra parola, oppure sfoglia il catalogo per categoria.</p>
            <LocalizedClientLink href="/store" className="btn btn-primary">
              Sfoglia il catalogo
            </LocalizedClientLink>
          </div>
        ) : (
          <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-3 xsmall:gap-5 small:gap-6">
            {products.map((p) => (
              <li key={p.id}>
                <ProductPreview product={p} region={region} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
