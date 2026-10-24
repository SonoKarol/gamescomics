"use client"

import { shop } from "@lib/shop-config"
import { HttpTypes } from "@medusajs/types"

import Accordion from "./accordion"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    { label: "Dettagli prodotto", component: <ProductInfoTab product={product} /> },
    { label: "Spedizione, ritiro e resi", component: <ShippingInfoTab /> },
  ]

  return (
    <div className="w-full border-t-[3px] border-gc-ink">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item key={i} title={tab.label} headingSize="medium" value={tab.label}>
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const Row = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <div className="contents">
      <dt className="font-semibold">{label}</dt>
      <dd>{value}</dd>
    </div>
  ) : null

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const dims =
    product.length && product.width && product.height
      ? `${product.length} × ${product.width} × ${product.height} mm`
      : null
  return (
    <dl className="py-6 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 text-sm">
      <Row label="Tipologia" value={product.type?.value} />
      <Row label="Categoria" value={product.categories?.map((c) => c.name).join(", ")} />
      <Row label="Materiale" value={product.material} />
      <Row label="Peso" value={product.weight ? `${product.weight} g` : null} />
      <Row label="Dimensioni" value={dims} />
      <Row label="Tag" value={product.tags?.map((t) => t.value).join(", ")} />
    </dl>
  )
}

const ShippingInfoTab = () => (
  <ul className="py-6 grid gap-5 text-sm">
    <li>
      <p className="font-semibold">Spedizione tracciata</p>
      <p className="max-w-sm text-gc-ink/80">
        Corriere in 2-4 giorni lavorativi, gratis sopra i {shop.freeShippingThreshold} €.
        Express in 24h disponibile al checkout.
      </p>
    </li>
    <li>
      <p className="font-semibold">Ritiro in negozio</p>
      <p className="max-w-sm text-gc-ink/80">
        Scegli “Ritiro in negozio” al checkout: ti scriviamo quando l'ordine è pronto
        a {shop.address.city}.
      </p>
    </li>
    <li>
      <p className="font-semibold">Resi entro 14 giorni</p>
      <p className="max-w-sm text-gc-ink/80">
        Hai cambiato idea? Puoi restituire i prodotti integri e sigillati entro 14
        giorni. Buste e box di carte collezionabili aperti non sono rimborsabili.
      </p>
    </li>
  </ul>
)

export default ProductTabs
