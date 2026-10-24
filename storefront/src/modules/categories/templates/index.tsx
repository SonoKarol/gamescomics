import { notFound } from "next/navigation"
import { Suspense } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PageHeader from "@modules/common/components/page-header"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

const headerColor: Record<string, string> = {
  fumetti: "bg-gc-red",
  manga: "bg-gc-sun",
  "carte-collezionabili": "bg-gc-blue",
  pokemon: "bg-gc-yellow",
  "yu-gi-oh": "bg-[#7B4FC4]",
  magic: "bg-gc-orange",
  "accessori-tcg": "bg-gc-blue",
  "giochi-da-tavolo": "bg-gc-mint",
  gadget: "bg-gc-orange",
}

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]
  const getParents = (c: HttpTypes.StoreProductCategory) => {
    if (c.parent_category) {
      parents.unshift(c.parent_category)
      getParents(c.parent_category)
    }
  }
  getParents(category)

  return (
    <>
      <PageHeader
        title={category.name}
        description={category.description}
        color={headerColor[category.handle] ?? "bg-gc-yellow"}
        crumbs={[
          { label: "Catalogo", href: "/store" },
          ...parents.map((p) => ({ label: p.name, href: `/categories/${p.handle}` })),
          { label: category.name },
        ]}
        testId="category-page-title"
      />
      <div className="content-container py-8" data-testid="category-container">
        <div className="flex flex-col gap-4 small:flex-row small:items-center small:justify-between mb-8">
          {category.category_children?.length ? (
            <ul className="flex flex-wrap gap-2">
              {category.category_children.map((c) => (
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
          ) : (
            <span />
          )}
          <RefinementList sortBy={sort} data-testid="sort-by-container" />
        </div>
        <Suspense
          fallback={<SkeletonProductGrid numberOfProducts={category.products?.length ?? 8} />}
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </>
  )
}
