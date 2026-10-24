import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { shop } from "@lib/shop-config"
import { ShoppingBag, User } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileMenu from "@modules/layout/components/mobile-menu"
import NavSearch from "@modules/layout/components/nav-search"
import Image from "next/image"

export default async function Nav() {
  const categories = await listCategories().catch(() => [])
  const roots = (categories ?? [])
    .filter((c) => !c.parent_category)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .map((c) => ({ name: c.name, handle: c.handle }))

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      {/* Striscia informativa */}
      <div className="bg-gc-ink text-white text-xs small:text-sm">
        <div className="content-container h-9 flex items-center justify-center small:justify-between">
          <p>
            Spedizione gratuita da {shop.freeShippingThreshold} € in tutta Italia
          </p>
          <p className="hidden small:block text-gc-sun">
            Ritiro gratis in negozio a {shop.address.city}
          </p>
        </div>
      </div>

      <header className="bg-white border-b-[3px] border-gc-ink">
        <nav className="content-container h-[72px] flex items-center gap-4">
          <MobileMenu categories={roots} />

          <LocalizedClientLink
            href="/"
            className="shrink-0 flex items-center transition-transform hover:-rotate-3 hover:scale-105"
            aria-label={`${shop.name} — home`}
            data-testid="nav-store-link"
          >
            <Image
              src="/brand/logo-round.webp"
              alt={shop.name}
              width={96}
              height={66}
              priority
              className="h-[60px] w-auto"
            />
          </LocalizedClientLink>

          <ul className="hidden small:flex items-center gap-1 ml-4">
            {roots.map((c) => (
              <li key={c.handle}>
                <LocalizedClientLink
                  href={`/categories/${c.handle}`}
                  className="relative px-3 py-2 font-semibold text-[15px] text-gc-ink
                    before:absolute before:inset-x-2 before:bottom-1 before:h-3 before:-z-10
                    before:bg-gc-yellow before:origin-left before:scale-x-0 before:transition-transform
                    hover:before:scale-x-100 isolate"
                >
                  {c.name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2">
            <NavSearch />
            <LocalizedClientLink
              href="/account"
              className="hidden small:grid place-items-center w-11 h-11 border-[3px] border-transparent hover:border-gc-ink hover:bg-gc-sun transition-colors"
              aria-label="Il mio account"
              data-testid="nav-account-link"
            >
              <User />
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  className="grid place-items-center w-11 h-11"
                  aria-label="Carrello"
                  data-testid="nav-cart-link"
                >
                  <ShoppingBag />
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
