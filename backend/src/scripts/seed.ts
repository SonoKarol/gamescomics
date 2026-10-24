import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductTagsWorkflow,
  createProductTypesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRatesWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import { categories, collections, products } from "./data/catalog"

/**
 * Seed di Games & Comics Shop.
 *
 *   npm run seed
 *
 * Crea: valuta EUR, regioni Italia + Europa (prezzi IVA inclusa), aliquote IVA
 * (22% standard, 4% editoria), magazzino del negozio a Catania, spedizioni
 * (standard, express, ritiro in negozio, gratis sopra i 49 €), chiave API
 * pubblica per lo storefront, categorie, collezioni e prodotti demo.
 */

const FREE_SHIPPING_THRESHOLD = 49

const ITALY = ["it", "sm", "va"]
const EUROPE = ["at", "be", "de", "es", "fr", "ie", "lu", "nl", "pt"]

export default async function seedGamesComics({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const storeModuleService = container.resolve(Modules.STORE)
  const regionModuleService = container.resolve(Modules.REGION)
  const paymentModuleService = container.resolve(Modules.PAYMENT)

  const backendUrl = (
    process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  ).replace(/\/$/, "")

  // ── Protezione: il seed va eseguito una sola volta ────────────────────────
  const existing = await regionModuleService.listRegions({ name: "Italia" })
  if (existing.length) {
    logger.warn(
      "Seed già eseguito (la regione 'Italia' esiste). Per ripartire da zero: " +
        "elimina il database e rilancia `npx medusa db:migrate && npm run seed`."
    )
    return
  }

  // ── Store & canale di vendita ────────────────────────────────────────────
  logger.info("🏪 Configurazione negozio...")
  const [store] = await storeModuleService.listStores()

  let salesChannels = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  })
  if (!salesChannels.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    })
    salesChannels = result
  }
  const webshop = salesChannels[0]

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Games & Comics Shop",
        supported_currencies: [
          { currency_code: "eur", is_default: true, is_tax_inclusive: true },
        ],
        default_sales_channel_id: webshop.id,
      },
    },
  })

  // ── Regioni (Stripe se configurato, altrimenti pagamento manuale) ────────
  logger.info("🌍 Regioni e pagamenti...")
  const providers = await paymentModuleService.listPaymentProviders()
  const paymentProviders = ["pp_system_default"]
  if (providers.some((p) => p.id === "pp_stripe_stripe")) {
    paymentProviders.unshift("pp_stripe_stripe")
    logger.info("   Stripe rilevato: abilitato su tutte le regioni.")
  } else {
    logger.warn(
      "   STRIPE_API_KEY non impostata: verrà usato solo il pagamento manuale di test."
    )
  }

  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Italia",
          currency_code: "eur",
          countries: ITALY,
          payment_providers: paymentProviders,
          automatic_taxes: true,
          is_tax_inclusive: true,
        },
        {
          name: "Europa",
          currency_code: "eur",
          countries: EUROPE,
          payment_providers: paymentProviders,
          automatic_taxes: true,
          is_tax_inclusive: true,
        },
      ],
    },
  })
  const [italy, europe] = regions

  // ── Tipi di prodotto (servono per l'IVA agevolata) ───────────────────────
  const { result: productTypes } = await createProductTypesWorkflow(
    container
  ).run({
    input: { product_types: [{ value: "Editoria" }, { value: "Prodotto" }] },
  })
  const typeId = (value: string) =>
    productTypes.find((t) => t.value === value)!.id

  // ── IVA: 22% ordinaria, 4% su fumetti/manga/libri ────────────────────────
  logger.info("🧾 Aliquote IVA...")
  const { result: taxRegions } = await createTaxRegionsWorkflow(container).run({
    input: [...ITALY, ...EUROPE].map((country_code) => ({
      country_code,
      provider_id: "tp_system",
      default_tax_rate:
        country_code === "it"
          ? { rate: 22, code: "IVA22", name: "IVA ordinaria 22%" }
          : undefined,
    })),
  })
  const italyTaxRegion = taxRegions.find((t) => t.country_code === "it")!
  await createTaxRatesWorkflow(container).run({
    input: [
      {
        tax_region_id: italyTaxRegion.id,
        rate: 4,
        code: "IVA4",
        name: "IVA editoria 4%",
        rules: [{ reference: "product_type", reference_id: typeId("Editoria") }],
      },
    ],
  })

  // ── Magazzino / negozio fisico ───────────────────────────────────────────
  logger.info("📦 Magazzino e spedizioni...")
  const { result: stockLocations } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Games & Comics Shop — Negozio",
          address: { city: "Catania", country_code: "IT", address_1: "" },
        },
      ],
    },
  })
  const shop = stockLocations[0]

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_location_id: shop.id },
    },
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: shop.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  const profiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  })
  let shippingProfile = profiles[0]
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Standard", type: "default" }] },
    })
    shippingProfile = result[0]
  }

  // Spedizione a domicilio
  const delivery = await fulfillmentModuleService.createFulfillmentSets({
    name: "Spedizioni Games & Comics",
    type: "shipping",
    service_zones: [
      {
        name: "Italia",
        geo_zones: ITALY.map((c) => ({ country_code: c, type: "country" as const })),
      },
      {
        name: "Europa",
        geo_zones: EUROPE.map((c) => ({ country_code: c, type: "country" as const })),
      },
    ],
  })

  // Ritiro in negozio
  const pickup = await fulfillmentModuleService.createFulfillmentSets({
    name: "Ritiro in negozio",
    type: "pickup",
    service_zones: [
      {
        name: "Negozio di Catania",
        geo_zones: ITALY.map((c) => ({ country_code: c, type: "country" as const })),
      },
    ],
  })

  for (const set of [delivery, pickup]) {
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: shop.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: set.id },
    })
  }

  const storeRules = [
    { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
    { attribute: "is_return", value: "false", operator: "eq" as const },
  ]
  const zone = (set: typeof delivery, name: string) =>
    set.service_zones.find((z) => z.name === name)!.id

  /** Prezzo con soglia di spedizione gratuita */
  const withFreeShipping = (regionId: string, amount: number) => [
    { region_id: regionId, amount },
    {
      region_id: regionId,
      amount: 0,
      rules: [
        {
          attribute: "item_total",
          operator: "gte" as const,
          value: FREE_SHIPPING_THRESHOLD,
        },
      ],
    },
  ]

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Corriere standard (2-4 giorni)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: zone(delivery, "Italia"),
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: `Consegna in 2-4 giorni lavorativi. Gratis sopra i ${FREE_SHIPPING_THRESHOLD} €.`,
          code: "standard",
        },
        prices: withFreeShipping(italy.id, 5.9),
        rules: storeRules,
      },
      {
        name: "Corriere express (24h)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: zone(delivery, "Italia"),
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Consegna in 24 ore lavorative.",
          code: "express",
        },
        prices: [{ region_id: italy.id, amount: 9.9 }],
        rules: storeRules,
      },
      {
        name: "Spedizione Europa (4-7 giorni)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: zone(delivery, "Europa"),
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Europa",
          description: "Consegna in 4-7 giorni lavorativi.",
          code: "europe",
        },
        prices: [{ region_id: europe.id, amount: 14.9 }],
        rules: storeRules,
      },
      {
        name: "Ritiro in negozio (gratis)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: pickup.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Ritiro",
          description: "Pronto per il ritiro in negozio a Catania, ti avvisiamo noi.",
          code: "pickup",
        },
        prices: [{ region_id: italy.id, amount: 0 }],
        rules: storeRules,
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: shop.id, add: [webshop.id] },
  })

  // ── Chiave API pubblica per lo storefront ────────────────────────────────
  logger.info("🔑 Chiave API pubblica...")
  const { data: keys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token"],
    filters: { type: "publishable" },
  })
  let publishableKey = keys?.[0] as { id: string; token: string } | undefined
  if (!publishableKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{ title: "Storefront", type: "publishable", created_by: "" }],
      },
    })
    publishableKey = result[0] as unknown as { id: string; token: string }
  }
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableKey.id, add: [webshop.id] },
  })

  // ── Categorie (prima le radici, poi le sottocategorie) ───────────────────
  logger.info("🗂️  Categorie e collezioni...")
  const categoryIds: Record<string, string> = {}
  const roots = categories.filter((c) => !c.parent)
  const children = categories.filter((c) => c.parent)

  const { result: rootCats } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: roots.map((c, i) => ({
        name: c.name,
        handle: c.handle,
        description: c.description,
        is_active: true,
        rank: i,
      })),
    },
  })
  rootCats.forEach((c) => (categoryIds[c.handle] = c.id))

  const { result: childCats } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: children.map((c, i) => ({
        name: c.name,
        handle: c.handle,
        description: c.description,
        is_active: true,
        rank: i,
        parent_category_id: categoryIds[c.parent!],
      })),
    },
  })
  childCats.forEach((c) => (categoryIds[c.handle] = c.id))

  const { result: createdCollections } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections: collections.map((c) => ({ title: c.title, handle: c.handle })),
    },
  })
  const collectionId = (handle: string) =>
    createdCollections.find((c) => c.handle === handle)!.id

  // ── Tag ───────────────────────────────────────────────────────────────────
  const tagValues = [...new Set(products.flatMap((p) => p.tags ?? []))]
  const { result: tags } = await createProductTagsWorkflow(container).run({
    input: { product_tags: tagValues.map((value) => ({ value })) },
  })
  const tagId = (value: string) => tags.find((t) => t.value === value)!.id

  // ── Prodotti ──────────────────────────────────────────────────────────────
  logger.info(`📚 Prodotti demo (${products.length})...`)
  const image = (handle: string, n: number) =>
    `${backendUrl}/static/demo/${handle}-${n}.webp`

  await createProductsWorkflow(container).run({
    input: {
      products: products.map((p) => {
        // Le categorie figlie appartengono anche alla radice, così i filtri funzionano
        const parent = categories.find((c) => c.handle === p.category)?.parent
        return {
          title: p.title,
          subtitle: p.subtitle,
          handle: p.handle,
          description: p.description,
          status: ProductStatus.PUBLISHED,
          weight: p.weight,
          type_id: typeId(p.type),
          category_ids: [
            categoryIds[p.category],
            ...(parent ? [categoryIds[parent]] : []),
          ],
          collection_id: p.collections?.[0]
            ? collectionId(p.collections[0])
            : undefined,
          tag_ids: p.tags?.map(tagId),
          shipping_profile_id: shippingProfile.id,
          thumbnail: image(p.handle, 1),
          images: [{ url: image(p.handle, 1) }, { url: image(p.handle, 2) }],
          options: p.options,
          variants: p.variants.map((v) => ({
            title: v.title,
            sku: v.sku,
            options: v.options,
            manage_inventory: true,
            prices: [{ amount: v.price, currency_code: "eur" }],
          })),
          sales_channels: [{ id: webshop.id }],
          metadata: { demo: true },
        }
      }),
    },
  })

  // ── Giacenze ──────────────────────────────────────────────────────────────
  logger.info("📊 Giacenze di magazzino...")
  const stockBySku = new Map<string, number>()
  products.forEach((p) =>
    p.variants.forEach((v) => stockBySku.set(v.sku, v.stock ?? 50))
  )

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })

  const levels: CreateInventoryLevelInput[] = inventoryItems.map((item) => ({
    location_id: shop.id,
    inventory_item_id: item.id,
    stocked_quantity: stockBySku.get(item.sku ?? "") ?? 50,
  }))

  await createInventoryLevelsWorkflow(container).run({
    input: { inventory_levels: levels },
  })

  logger.info("✅ Seed completato!")
  logger.info("")
  logger.info("   Copia questa chiave nel file storefront/.env.local:")
  logger.info(`   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableKey.token}`)
  logger.info("")
  logger.info(
    "   Crea l'utente admin con: npx medusa user -e admin@gamescomics.it -p <password>"
  )
}
