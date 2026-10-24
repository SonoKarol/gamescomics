# Roadmap — Games & Comics Shop

## ✅ Fase 1 — Fondamenta (completata)

- Monorepo `backend/` (Medusa 2.22) + `storefront/` (Next.js 15), repository git
- Identità visiva dal sito storico: logo, giallo `#FBBA00`, blu `#178CC6`, menta `#6ED8A5`,
  arancio `#FE8A02`; lettering Bangers + Open Sans; stile "vignetta" (bordi d'inchiostro,
  ombre piene, retini)
- Home animata, catalogo, categorie, ricerca, scheda prodotto, carrello, checkout, account,
  conferma ordine — tutto in italiano
- Regioni Italia/Europa, IVA 22% e 4% editoria, spedizioni con soglia gratuita e ritiro
  in negozio, Stripe predisposto
- Catalogo demo con copertine segnaposto originali
- Verificati: migrazioni, seed, calcolo IVA, soglia spedizione, ordine completo end-to-end,
  build di produzione, pannello admin

## 🔜 Fase 2 — Pronto per i clienti

- [ ] **Dati reali del negozio** in `storefront/src/lib/shop-config.ts`: indirizzo, telefono,
      orari, calendario tornei *(da chiedere al cliente)*
- [ ] **Logo in alta risoluzione** (SVG o PNG ≥ 2000 px) dal cliente
- [ ] **Stripe live**: account del cliente, webhook, test di Apple Pay / Google Pay
- [ ] **Email transazionali** (conferma ordine, spedizione, reset password) con un modulo
      di notifica Medusa (Resend o SendGrid) e template brandizzati
- [ ] **Reset password** cliente (pagina "password dimenticata")
- [ ] **Revalidation automatica**: subscriber nel backend che invalida la cache dello
      storefront quando un prodotto viene modificato dall'admin
- [ ] Pagine legali: Termini di vendita, Privacy, Cookie (banner di consenso), Resi —
      con dati aziendali (P.IVA, ragione sociale)
- [ ] Import del catalogo reale via CSV (con ISBN/EAN come SKU)

## 🧩 Fase 3 — Funzioni da fumetteria

- [ ] **Preordini** e "avvisami quando torna disponibile"
- [ ] **Abbonamenti alle serie** (casella/"pull list"): il cliente segue una serie e riceve
      ogni nuovo numero
- [ ] **Iscrizione ai tornei online** con posti limitati e pagamento della quota
- [ ] Filtri avanzati: editore, autore, prezzo, disponibilità
- [ ] Ricerca istantanea con suggerimenti (Meilisearch o Algolia)
- [ ] Wishlist, recensioni, prodotti visti di recente
- [ ] Carte singole TCG (condizione, lingua, rarità) come prodotti a variante

## 🚀 Fase 4 — Messa online

- [ ] Hosting backend (Railway, Render o VPS con Docker) + PostgreSQL gestito + Redis
- [ ] Storage immagini su S3/R2 (`@medusajs/medusa/file-s3`)
- [ ] Storefront su Vercel, dominio `gamescomics.it`, redirect dal vecchio sito
- [ ] SEO: sitemap, dati strutturati Product, Google Merchant Center
- [ ] Analytics rispettosi del GDPR, monitoraggio errori
- [ ] CI su GitHub Actions (typecheck, build, test)
