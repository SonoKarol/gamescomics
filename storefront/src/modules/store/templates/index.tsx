import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import PageHeader from "@modules/common/components/page-header"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const categories = (await listCategories().catch(() => [])) ?? []
  const roots = categories
    .filter((c) => !c.parent_category)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))

  return (
    <>
      <PageHeader
        title="Il catalogo"
        description="Tutto quello che trovi sugli scaffali del negozio, pronto da spedire o da ritirare."
        testId="store-page-title"
      />
      <div className="content-container py-8" data-testid="category-container">
        <div className="flex flex-col gap-4 small:flex-row small:items-center small:justify-between mb-8">
          <ul className="flex flex-wrap gap-2">
            {roots.map((c) => (
              <li key={c.id}>
                <LocalizedClientLink
                  href={`/categories/${c.handle}`}
                  className="inline-flex px-3 h-9 items-center text-sm font-semibold border-2 border-gc-ink bg-white hover:bg-gc-yellow transition-colors"
                >
                  {c.name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
          <RefinementList sortBy={sort} />
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts sortBy={sort} page={pageNumber} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default StoreTemplate
