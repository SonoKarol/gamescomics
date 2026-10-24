/**
 * Catalogo DEMO di Games & Comics Shop.
 *
 * Titoli e immagini sono segnaposto originali, pensati solo per mostrare il
 * negozio in funzione. Il catalogo reale va caricato dal pannello admin
 * (http://localhost:9000/app) o tramite import CSV.
 *
 * Prezzi in EURO, IVA inclusa. Per "Editoria" (fumetti, manga, libri) si
 * applica l'IVA agevolata al 4%, per il resto il 22%.
 */

export type CatalogCategory = {
  handle: string
  name: string
  description: string
  parent?: string
}

export type CatalogVariant = {
  title: string
  sku: string
  options: Record<string, string>
  price: number
  stock?: number
}

export type CatalogProduct = {
  handle: string
  title: string
  subtitle?: string
  description: string
  category: string
  type: "Editoria" | "Prodotto"
  collections?: string[]
  tags?: string[]
  weight: number
  /** Stile dell'immagine segnaposto generata (vedi tools/generate-placeholders.mjs) */
  art: {
    kind: "comic" | "manga" | "tcg" | "box" | "merch"
    bg: string
    fg: string
    accent: string
    label: string
  }
  options: { title: string; values: string[] }[]
  variants: CatalogVariant[]
}

export const categories: CatalogCategory[] = [
  {
    handle: "fumetti",
    name: "Fumetti",
    description: "Supereroi, graphic novel e il meglio del fumetto italiano.",
  },
  {
    handle: "manga",
    name: "Manga",
    description: "Shōnen, seinen, shōjo: dal primo volume all'ultimo cofanetto.",
  },
  {
    handle: "carte-collezionabili",
    name: "Carte collezionabili",
    description: "Buste, box e accessori per i tuoi giochi di carte preferiti.",
  },
  {
    handle: "pokemon",
    name: "Pokémon",
    description: "Buste di espansione, box e mazzi del GCC Pokémon.",
    parent: "carte-collezionabili",
  },
  {
    handle: "yu-gi-oh",
    name: "Yu-Gi-Oh!",
    description: "Structure deck, buste e tutto per il tuo prossimo duello.",
    parent: "carte-collezionabili",
  },
  {
    handle: "magic",
    name: "Magic: The Gathering",
    description: "Play booster, commander deck e display.",
    parent: "carte-collezionabili",
  },
  {
    handle: "accessori-tcg",
    name: "Accessori",
    description: "Bustine protettive, deck box, playmat.",
    parent: "carte-collezionabili",
  },
  {
    handle: "giochi-da-tavolo",
    name: "Giochi da tavolo",
    description: "Party game, gdr e giochi per tutta la famiglia.",
  },
  {
    handle: "gadget",
    name: "Gadget & Action figure",
    description: "Merch del negozio, figure e idee regalo.",
  },
]

export const collections = [
  { handle: "novita", title: "Novità" },
  { handle: "bestseller", title: "Bestseller" },
]

const sizes = ["S", "M", "L", "XL"]

export const products: CatalogProduct[] = [
  // ─── FUMETTI ───────────────────────────────────────────────────────────────
  {
    handle: "capitan-vesuvio-1",
    title: "Capitan Vesuvio #1",
    subtitle: "Il primo numero della nuova serie",
    description:
      "Napoli, 2049. Quando il vulcano si risveglia, un ragazzo dei Quartieri scopre di poter controllare la lava. Il primo numero della serie supereroistica più esplosiva dell'anno, disponibile in cover regolare e in variant esclusiva del negozio.",
    category: "fumetti",
    type: "Editoria",
    collections: ["novita"],
    tags: ["supereroi", "serie regolare"],
    weight: 120,
    art: { kind: "comic", bg: "#E23B2E", fg: "#FFF8E7", accent: "#FBBA00", label: "#1" },
    options: [{ title: "Cover", values: ["Regular", "Variant G&C"] }],
    variants: [
      { title: "Regular", sku: "CV-001-REG", options: { Cover: "Regular" }, price: 4.9 },
      { title: "Variant G&C", sku: "CV-001-VAR", options: { Cover: "Variant G&C" }, price: 9.9, stock: 30 },
    ],
  },
  {
    handle: "neon-ronin-vol-1",
    title: "Neon Ronin — Volume 1",
    subtitle: "Graphic novel cyberpunk",
    description:
      "Un samurai senza padrone in una città che non dorme mai. Neon Ronin raccoglie i primi sei capitoli della saga cyberpunk acclamata dalla critica, in un volume brossurato con extra e sketchbook.",
    category: "fumetti",
    type: "Editoria",
    collections: ["bestseller"],
    tags: ["graphic novel", "cyberpunk"],
    weight: 450,
    art: { kind: "comic", bg: "#1B1F3B", fg: "#6ED8A5", accent: "#FF415C", label: "VOL.1" },
    options: [{ title: "Formato", values: ["Brossurato"] }],
    variants: [
      { title: "Brossurato", sku: "NR-V01", options: { Formato: "Brossurato" }, price: 19 },
    ],
  },
  {
    handle: "cronache-di-etna",
    title: "Le Cronache dell'Etna",
    subtitle: "Edizione cartonata da collezione",
    description:
      "Leggende siciliane, draghi di cenere e un'eroina che attraversa i secoli. Un fantasy disegnato a mano, stampato su carta pregiata, con copertina cartonata e segnalibro in tessuto.",
    category: "fumetti",
    type: "Editoria",
    collections: ["bestseller"],
    tags: ["fantasy", "autori italiani"],
    weight: 900,
    art: { kind: "comic", bg: "#FE8A02", fg: "#111318", accent: "#178CC6", label: "HC" },
    options: [{ title: "Formato", values: ["Cartonato"] }],
    variants: [
      { title: "Cartonato", sku: "CDE-HC", options: { Formato: "Cartonato" }, price: 24 },
    ],
  },
  {
    handle: "spectra-squad-12",
    title: "Spectra Squad #12",
    description:
      "La squadra più colorata dell'universo affronta il Re Grigio. Albo spillato da 32 pagine, a colori.",
    category: "fumetti",
    type: "Editoria",
    tags: ["supereroi"],
    weight: 90,
    art: { kind: "comic", bg: "#178CC6", fg: "#FFF8E7", accent: "#FBBA00", label: "#12" },
    options: [{ title: "Cover", values: ["Regular"] }],
    variants: [
      { title: "Regular", sku: "SS-012", options: { Cover: "Regular" }, price: 3.9 },
    ],
  },

  // ─── MANGA ─────────────────────────────────────────────────────────────────
  {
    handle: "kitsune-blade",
    title: "Kitsune Blade",
    subtitle: "Shōnen d'azione — in corso",
    description:
      "Rin ha nove code e una sola spada. La serie shōnen che sta conquistando il Giappone arriva in Italia: scegli il volume che ti manca!",
    category: "manga",
    type: "Editoria",
    collections: ["novita"],
    tags: ["shonen", "azione"],
    weight: 180,
    art: { kind: "manga", bg: "#FFF8E7", fg: "#111318", accent: "#FF415C", label: "狐" },
    options: [{ title: "Volume", values: ["1", "2", "3"] }],
    variants: [
      { title: "Vol. 1", sku: "KB-V01", options: { Volume: "1" }, price: 5.9 },
      { title: "Vol. 2", sku: "KB-V02", options: { Volume: "2" }, price: 5.9 },
      { title: "Vol. 3", sku: "KB-V03", options: { Volume: "3" }, price: 5.9 },
    ],
  },
  {
    handle: "mecha-academy-box",
    title: "Mecha Academy — Cofanetto 1-5",
    subtitle: "Cofanetto con i primi 5 volumi",
    description:
      "I primi cinque volumi della commedia scolastica a base di robottoni giganti, raccolti in un cofanetto da collezione con poster esclusivo.",
    category: "manga",
    type: "Editoria",
    collections: ["bestseller"],
    tags: ["mecha", "cofanetto"],
    weight: 1100,
    art: { kind: "manga", bg: "#6ED8A5", fg: "#111318", accent: "#178CC6", label: "BOX" },
    options: [{ title: "Formato", values: ["Cofanetto"] }],
    variants: [
      { title: "Cofanetto", sku: "MA-BOX15", options: { Formato: "Cofanetto" }, price: 32.5 },
    ],
  },
  {
    handle: "ramen-rhapsody-1",
    title: "Ramen Rhapsody Vol. 1",
    subtitle: "Slice of life gastronomico",
    description:
      "Una piccola bottega di ramen a Osaka e una cuoca che non sa cucinare. Uno slice of life tenero e affamato.",
    category: "manga",
    type: "Editoria",
    tags: ["slice of life"],
    weight: 180,
    art: { kind: "manga", bg: "#FBBA00", fg: "#111318", accent: "#E23B2E", label: "麺" },
    options: [{ title: "Volume", values: ["1"] }],
    variants: [
      { title: "Vol. 1", sku: "RR-V01", options: { Volume: "1" }, price: 6.5 },
    ],
  },

  // ─── CARTE COLLEZIONABILI ─────────────────────────────────────────────────
  {
    handle: "pokemon-busta-espansione",
    title: "Pokémon GCC — Busta di espansione",
    subtitle: "Ultima espansione disponibile",
    description:
      "Busta di espansione del Gioco di Carte Collezionabili Pokémon dell'ultima serie uscita. Disponibile anche il box da 36 buste. Prodotto in italiano.",
    category: "pokemon",
    type: "Prodotto",
    collections: ["novita"],
    tags: ["gcc", "buste"],
    weight: 25,
    art: { kind: "tcg", bg: "#FBBA00", fg: "#111318", accent: "#178CC6", label: "BOOSTER" },
    options: [{ title: "Formato", values: ["Busta singola", "Box 36 buste"] }],
    variants: [
      { title: "Busta singola", sku: "PKM-BST", options: { Formato: "Busta singola" }, price: 5.5, stock: 200 },
      { title: "Box 36 buste", sku: "PKM-BOX36", options: { Formato: "Box 36 buste" }, price: 179, stock: 6 },
    ],
  },
  {
    handle: "yugioh-structure-deck",
    title: "Yu-Gi-Oh! — Structure Deck",
    subtitle: "Mazzo pronto per giocare",
    description:
      "Mazzo precostruito pronto per il torneo del venerdì: 40+ carte, guida strategica e tappetino di gioco. Prodotto in italiano.",
    category: "yu-gi-oh",
    type: "Prodotto",
    tags: ["gcc", "mazzi"],
    weight: 150,
    art: { kind: "tcg", bg: "#4B2A84", fg: "#FFF8E7", accent: "#FBBA00", label: "DECK" },
    options: [{ title: "Formato", values: ["Mazzo"] }],
    variants: [
      { title: "Mazzo", sku: "YGO-SD", options: { Formato: "Mazzo" }, price: 12.9 },
    ],
  },
  {
    handle: "magic-play-booster",
    title: "Magic: The Gathering — Play Booster",
    subtitle: "Busta o display da 36",
    description:
      "Play Booster dell'ultima espansione di Magic: The Gathering, ideale per draft e sealed. Disponibile anche il display completo.",
    category: "magic",
    type: "Prodotto",
    collections: ["bestseller"],
    tags: ["gcc", "draft"],
    weight: 30,
    art: { kind: "tcg", bg: "#111318", fg: "#FE8A02", accent: "#6ED8A5", label: "PLAY" },
    options: [{ title: "Formato", values: ["Busta singola", "Display 36 buste"] }],
    variants: [
      { title: "Busta singola", sku: "MTG-PB", options: { Formato: "Busta singola" }, price: 6.5, stock: 150 },
      { title: "Display 36 buste", sku: "MTG-PB-D36", options: { Formato: "Display 36 buste" }, price: 169, stock: 4 },
    ],
  },
  {
    handle: "bustine-protettive-100",
    title: "Bustine protettive (100 pz)",
    subtitle: "Formato standard 66×91 mm",
    description:
      "100 bustine protettive opache, formato standard per Pokémon e Magic. Retro colorato, apertura rinforzata.",
    category: "accessori-tcg",
    type: "Prodotto",
    tags: ["accessori"],
    weight: 60,
    art: { kind: "box", bg: "#178CC6", fg: "#FFF8E7", accent: "#111318", label: "×100" },
    options: [{ title: "Colore", values: ["Nero", "Blu", "Giallo"] }],
    variants: [
      { title: "Nero", sku: "SLV-100-BK", options: { Colore: "Nero" }, price: 4.5 },
      { title: "Blu", sku: "SLV-100-BL", options: { Colore: "Blu" }, price: 4.5 },
      { title: "Giallo", sku: "SLV-100-YL", options: { Colore: "Giallo" }, price: 4.5 },
    ],
  },

  // ─── GIOCHI DA TAVOLO ─────────────────────────────────────────────────────
  {
    handle: "draghi-e-dadi-starter",
    title: "Draghi & Dadi — Starter Set",
    subtitle: "Il gioco di ruolo per iniziare",
    description:
      "Tutto ciò che serve per la tua prima avventura: manuale introduttivo, 5 personaggi pronti, set di dadi e mappa. Da 2 a 6 giocatori, dai 12 anni.",
    category: "giochi-da-tavolo",
    type: "Prodotto",
    collections: ["bestseller"],
    tags: ["gdr", "starter"],
    weight: 1200,
    art: { kind: "box", bg: "#E23B2E", fg: "#FBBA00", accent: "#111318", label: "D20" },
    options: [{ title: "Edizione", values: ["Italiana"] }],
    variants: [
      { title: "Italiana", sku: "DD-START-IT", options: { Edizione: "Italiana" }, price: 29.9 },
    ],
  },
  {
    handle: "castelli-di-sabbia",
    title: "Castelli di Sabbia",
    subtitle: "Party game per 3-8 giocatori",
    description:
      "Costruisci, bluffa, fai crollare i castelli degli altri. Un party game veloce e caotico da 20 minuti a partita.",
    category: "giochi-da-tavolo",
    type: "Prodotto",
    tags: ["party game", "famiglia"],
    weight: 700,
    art: { kind: "box", bg: "#6ED8A5", fg: "#111318", accent: "#FE8A02", label: "3-8" },
    options: [{ title: "Edizione", values: ["Italiana"] }],
    variants: [
      { title: "Italiana", sku: "CDS-IT", options: { Edizione: "Italiana" }, price: 19.9 },
    ],
  },

  // ─── GADGET ───────────────────────────────────────────────────────────────
  {
    handle: "t-shirt-games-comics",
    title: "T-shirt Games & Comics Shop",
    subtitle: "Merch ufficiale del negozio",
    description:
      "La maglietta ufficiale del negozio, 100% cotone organico, stampa serigrafica del logo sul petto. Porta il fumetto sempre con te!",
    category: "gadget",
    type: "Prodotto",
    collections: ["novita"],
    tags: ["merch", "abbigliamento"],
    weight: 200,
    art: { kind: "merch", bg: "#FBBA00", fg: "#111318", accent: "#178CC6", label: "TEE" },
    options: [{ title: "Taglia", values: sizes }],
    variants: sizes.map((s) => ({
      title: s,
      sku: `GC-TEE-${s}`,
      options: { Taglia: s },
      price: 19.9,
      stock: 25,
    })),
  },
  {
    handle: "tazza-pow",
    title: "Tazza \"POW!\"",
    subtitle: "Ceramica, 350 ml",
    description:
      "La tazza perfetta per la colazione del supereroe. Ceramica lucida, lavabile in lavastoviglie.",
    category: "gadget",
    type: "Prodotto",
    tags: ["merch", "idee regalo"],
    weight: 400,
    art: { kind: "merch", bg: "#FF415C", fg: "#FFF8E7", accent: "#FBBA00", label: "POW!" },
    options: [{ title: "Formato", values: ["350 ml"] }],
    variants: [
      { title: "350 ml", sku: "GC-MUG-POW", options: { Formato: "350 ml" }, price: 12 },
    ],
  },
  {
    handle: "robo-kaiju-figure",
    title: "Robo Kaiju — Action figure 18 cm",
    subtitle: "Snodata, con accessori",
    description:
      "Action figure snodata da 18 cm con 3 mani intercambiabili, effetto raggio e base espositiva.",
    category: "gadget",
    type: "Prodotto",
    tags: ["action figure", "idee regalo"],
    weight: 500,
    art: { kind: "box", bg: "#111318", fg: "#6ED8A5", accent: "#FBBA00", label: "18cm" },
    options: [{ title: "Versione", values: ["Standard"] }],
    variants: [
      { title: "Standard", sku: "FIG-RK18", options: { Versione: "Standard" }, price: 34.9, stock: 8 },
    ],
  },
]
