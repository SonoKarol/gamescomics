import { listCategories } from "@lib/data/categories"
import { shop } from "@lib/shop-config"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const SocialIcon = ({ name }: { name: "facebook" | "instagram" | "twitter" }) => {
  const paths = {
    facebook:
      "M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v9h4v-9h3l1-4h-4V9c0-.6.4-1 1-1z",
    instagram:
      "M12 7.4A4.6 4.6 0 1 0 12 16.6 4.6 4.6 0 0 0 12 7.4zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.9-7.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 3c-2.4 0-2.7 0-3.7.1-3.3.1-5 1.9-5.2 5.2C3 9.3 3 9.6 3 12s0 2.7.1 3.7c.1 3.3 1.9 5 5.2 5.2 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c3.3-.1 5-1.9 5.2-5.2.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c-.1-3.3-1.9-5-5.2-5.2C14.7 3 14.4 3 12 3z",
    twitter:
      "M21 6.5c-.7.3-1.4.5-2.1.6.8-.5 1.3-1.2 1.6-2-.7.4-1.5.7-2.3.9a3.6 3.6 0 0 0-6.2 3.3C8.9 9.1 6.2 7.7 4.4 5.5c-1 1.7-.5 3.8 1.1 4.8-.6 0-1.1-.2-1.6-.4 0 1.7 1.2 3.2 2.9 3.6-.5.1-1.1.2-1.6.1.5 1.5 1.8 2.5 3.4 2.5A7.3 7.3 0 0 1 3 17.6 10.3 10.3 0 0 0 18.8 8.4v-.5c.8-.4 1.6-1.1 2.2-1.4z",
  }
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d={paths[name]} />
    </svg>
  )
}

export default async function Footer() {
  const categories = await listCategories().catch(() => [])
  const roots = (categories ?? [])
    .filter((c) => !c.parent_category)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))

  const year = new Date().getFullYear()

  return (
    <footer className="bg-gc-ink text-white mt-24 relative">
      {/* bordo dentellato superiore, come il taglio di una busta di carte */}
      <div
        aria-hidden
        className="absolute -top-[14px] inset-x-0 h-[15px] bg-gc-ink"
        style={{
          clipPath:
            "polygon(0 100%, 0 40%, 2% 0, 4% 40%, 6% 0, 8% 40%, 10% 0, 12% 40%, 14% 0, 16% 40%, 18% 0, 20% 40%, 22% 0, 24% 40%, 26% 0, 28% 40%, 30% 0, 32% 40%, 34% 0, 36% 40%, 38% 0, 40% 40%, 42% 0, 44% 40%, 46% 0, 48% 40%, 50% 0, 52% 40%, 54% 0, 56% 40%, 58% 0, 60% 40%, 62% 0, 64% 40%, 66% 0, 68% 40%, 70% 0, 72% 40%, 74% 0, 76% 40%, 78% 0, 80% 40%, 82% 0, 84% 40%, 86% 0, 88% 40%, 90% 0, 92% 40%, 94% 0, 96% 40%, 98% 0, 100% 40%, 100% 100%)",
        }}
      />
      <div className="content-container py-16 grid gap-12 small:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-5">
          <Image
            src="/brand/logo-wide.webp"
            alt={shop.name}
            width={280}
            height={63}
            className="w-[260px] h-auto"
          />
          <p className="text-white/80 max-w-xs">{shop.tagline}</p>
          <div className="flex gap-3">
            {(Object.keys(shop.social) as (keyof typeof shop.social)[]).map(
              (k) => (
                <a
                  key={k}
                  href={shop.social[k]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={k}
                  className="grid place-items-center w-11 h-11 border-[3px] border-white text-white hover:bg-gc-yellow hover:text-gc-ink hover:border-gc-yellow transition-colors"
                >
                  <SocialIcon name={k} />
                </a>
              )
            )}
          </div>
        </div>

        <div>
          <h3 className="comic-title text-2xl text-gc-yellow mb-4">Catalogo</h3>
          <ul className="flex flex-col gap-2 text-white/85">
            <li>
              <LocalizedClientLink href="/store" className="hover:text-gc-yellow">
                Tutti i prodotti
              </LocalizedClientLink>
            </li>
            {roots.map((c) => (
              <li key={c.id}>
                <LocalizedClientLink
                  href={`/categories/${c.handle}`}
                  className="hover:text-gc-yellow"
                  data-testid="category-link"
                >
                  {c.name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="comic-title text-2xl text-gc-yellow mb-4">Aiuto</h3>
          <ul className="flex flex-col gap-2 text-white/85">
            <li>
              <LocalizedClientLink href="/account" className="hover:text-gc-yellow">
                Il mio account
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/account/orders" className="hover:text-gc-yellow">
                I miei ordini
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/cart" className="hover:text-gc-yellow">
                Carrello
              </LocalizedClientLink>
            </li>
            <li>
              <a href={`mailto:${shop.email}`} className="hover:text-gc-yellow">
                Scrivici
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="comic-title text-2xl text-gc-yellow mb-4">Il negozio</h3>
          <address className="not-italic text-white/85 flex flex-col gap-1">
            <span>{shop.address.street}</span>
            <span>
              {shop.address.zip} {shop.address.city} ({shop.address.province})
            </span>
            {shop.phone && <a href={`tel:${shop.phone}`}>{shop.phone}</a>}
            <a href={`mailto:${shop.email}`} className="hover:text-gc-yellow">
              {shop.email}
            </a>
          </address>
          <dl className="mt-4 text-sm text-white/70 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            {shop.hours.map((h) => (
              <div key={h.days} className="contents">
                <dt className="font-semibold text-white/90">{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="content-container py-6 flex flex-col small:flex-row gap-2 justify-between text-sm text-white/60">
          <p>
            © {year} {shop.name}. Tutti i diritti riservati.
          </p>
          <p>Pagamenti sicuri con carta, Apple Pay e Google Pay</p>
        </div>
      </div>
    </footer>
  )
}
