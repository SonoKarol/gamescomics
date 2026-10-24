import { Suspense } from "react"

import PageHeader from "@modules/common/components/page-header"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <>
      <PageHeader
        title={collection.title}
        color={collection.handle === "novita" ? "bg-gc-mint" : "bg-gc-orange"}
        crumbs={[{ label: "Catalogo", href: "/store" }, { label: collection.title }]}
      />
      <div className="content-container py-8">
        <div className="flex justify-end mb-8">
          <RefinementList sortBy={sort} />
        </div>
        <Suspense fallback={<SkeletonProductGrid numberOfProducts={collection.products?.length} />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </>
  )
}
