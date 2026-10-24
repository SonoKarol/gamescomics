import { shop } from "@lib/shop-config"
import { BuildingStorefront, CreditCard, MapPin } from "@medusajs/icons"

const perks = [
  {
    icon: BuildingStorefront,
    title: "Ritiro gratis in negozio",
    text: "Ordina online e passa a prenderlo quando vuoi: ti avvisiamo noi.",
  },
  {
    icon: MapPin,
    title: `Spedizione gratis da ${shop.freeShippingThreshold} €`,
    text: "Corriere tracciato in tutta Italia, imballaggio a prova di angoli piegati.",
  },
  {
    icon: CreditCard,
    title: "Pagamenti sicuri",
    text: "Carta, Apple Pay e Google Pay tramite Stripe. Non salviamo i tuoi dati.",
  },
]

export default function VisitShop() {
  return (
    <section className="content-container py-14 grid gap-8 small:grid-cols-[1fr_1.1fr] items-stretch">
      <div className="panel bg-gc-blue text-white p-8 small:p-10 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 halftone-light" />
        <div className="relative">
          <h2 className="comic-title text-5xl small:text-6xl comic-outline">Vieni a trovarci</h2>
          <address className="not-italic mt-6 text-lg leading-relaxed">
            {shop.address.street}
            <br />
            {shop.address.zip} {shop.address.city} ({shop.address.province})
          </address>
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            {shop.hours.map((h) => (
              <div key={h.days} className="contents">
                <dt className="font-bold">{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
          <a
            href={shop.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary mt-8"
          >
            Apri in Google Maps
          </a>
        </div>
      </div>
      <ul className="grid gap-4">
        {perks.map(({ icon: Icon, title, text }) => (
          <li key={title} className="panel p-6 flex gap-5 items-start">
            <span className="shrink-0 grid place-items-center w-14 h-14 bg-gc-yellow border-[3px] border-gc-ink">
              <Icon />
            </span>
            <div>
              <h3 className="comic-title text-3xl">{title}</h3>
              <p className="mt-1 text-gc-ink/80">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
