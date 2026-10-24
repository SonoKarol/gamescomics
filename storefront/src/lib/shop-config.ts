/**
 * Informazioni del negozio mostrate nello storefront.
 * ⚠️  I campi segnati con TODO vanno confermati con il cliente.
 */
export const shop = {
  name: "Games & Comics Shop",
  shortName: "Games & Comics",
  tagline: "Fumetti, manga, carte collezionabili e giochi da tavolo a Catania.",
  // TODO: indirizzo esatto, telefono ed email del negozio
  address: {
    street: "Indirizzo del negozio",
    city: "Catania",
    zip: "95100",
    province: "CT",
  },
  phone: "",
  email: "info@gamescomics.it",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Games+%26+Comics+Shop+Catania",
  // TODO: orari reali di apertura
  hours: [
    { days: "Lunedì", time: "16:00 – 20:30" },
    { days: "Martedì – Sabato", time: "9:30 – 13:00 · 16:00 – 20:30" },
    { days: "Domenica", time: "Chiuso" },
  ],
  social: {
    facebook: "https://www.facebook.com/Games-Comics-Shop-1426655990976208",
    instagram: "https://www.instagram.com/gamesandcomicsshop/",
    twitter: "https://twitter.com/GamesandComicsS",
  },
  freeShippingThreshold: 49,
  // TODO: calendario tornei reale
  tournaments: [
    {
      game: "Yu-Gi-Oh!",
      day: "Martedì",
      time: "17:30",
      format: "Torneo locale OTS · formato Avanzato",
      fee: "5 €",
      color: "#4B2A84",
      text: "#FFFDF6",
    },
    {
      game: "Magic: The Gathering",
      day: "Venerdì",
      time: "18:00",
      format: "Friday Night Magic · Draft e Commander",
      fee: "da 15 €",
      color: "#15131A",
      text: "#FE8A02",
    },
    {
      game: "Pokémon GCC",
      day: "Sabato",
      time: "16:00",
      format: "League Challenge · formato Standard",
      fee: "8 €",
      color: "#FBBA00",
      text: "#15131A",
    },
  ],
}
