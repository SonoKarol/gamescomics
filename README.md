# Games & Comics Shop — E-commerce

Negozio online di **Games & Comics Shop** (fumetteria di Catania): fumetti, manga,
carte collezionabili, giochi da tavolo e gadget.

| Parte | Tecnologia | Cartella | URL locale |
|---|---|---|---|
| Backend + API + pannello admin | [Medusa v2](https://docs.medusajs.com) (2.22) | `backend/` | http://localhost:9000 · admin su `/app` |
| Negozio (storefront) | Next.js 15 + Tailwind + Motion + Lenis | `storefront/` | http://localhost:8000 |
| Database | PostgreSQL 16 (portatile, oppure Docker/sistema) | `scripts/`, `.data/` | `localhost:5432` |
| Cache / eventi (produzione) | Redis 7 | `docker-compose.yml` | `localhost:6379` |
| Pagamenti | Stripe (carte, Apple Pay, Google Pay…) | `backend/medusa-config.ts` | — |

---

## 1. Requisiti

Solo **Node.js ≥ 20** (consigliato 22 LTS). PostgreSQL non va installato: il progetto
usa una copia **portatile** (pacchetto npm `embedded-postgres`, dati in `.data/postgres`).

## 2. Avvio

```bash
npm run setup   # una volta: dipendenze, .env, database, tabelle, dati demo, chiave API, utente admin
npm run dev     # ogni volta: PostgreSQL + backend (:9000) + negozio (:8000). Ctrl+C ferma tutto
```

| Indirizzo | Cosa |
|---|---|
| http://localhost:8000 | Negozio |
| http://localhost:9000/app | Pannello admin — credenziali in `.data/admin.txt` |
| `postgres://postgres:postgres@localhost:5432/gamescomics` | Database (`npm run db` lo avvia da solo, per psql o un client grafico) |

`npm run setup` si può rilanciare senza danni: salta ciò che è già fatto.

> **Hai già un PostgreSQL** (Docker con `docker compose up -d`, oppure di sistema)?
> Se sulla porta 5432 risponde un server con utente `postgres` / password `postgres`,
> gli script lo usano al posto di quello portatile. Per resettare i dati del database
> portatile basta cancellare la cartella `.data/postgres` e rilanciare `npm run setup`.

## 3. Cosa c'è dentro

### Negozio (storefront)
- Home "splash page" animata con logo, ventaglio di copertine che segue il mouse,
  tavola di categorie a vignette, vetrine *Novità* e *Bestseller*, calendario tornei,
  info negozio
- Catalogo con categorie e sottocategorie (Pokémon, Yu-Gi-Oh!, Magic…), ordinamento,
  ricerca prodotti (`/it/search?q=...`)
- Scheda prodotto con galleria, varianti (cover, volume, taglia, formato), disponibilità
  di magazzino, feedback animato all'aggiunta al carrello
- Carrello, checkout in 4 passaggi, ritiro in negozio, area clienti con login/registrazione,
  storico ordini, indirizzi salvati
- Tutto in italiano, prezzi in formato `4,90 €`, IVA inclusa
- Scroll fluido (Lenis) e animazioni (Motion) che rispettano *prefers-reduced-motion*

### Backend / Admin (`http://localhost:9000/app`)
- Gestione prodotti, varianti, prezzi, immagini, giacenze, categorie, collezioni
- Ordini, clienti, promozioni e codici sconto, listini
- Il pannello è disponibile in italiano: *Settings → Profile → Language*

### Regole di negozio configurate dal seed
| Cosa | Valore |
|---|---|
| Regioni | **Italia** (IT, SM, VA) ed **Europa** (AT, BE, DE, ES, FR, IE, LU, NL, PT) — EUR, prezzi IVA inclusa |
| IVA | 22% ordinaria · **4% editoria** (fumetti, manga, libri: tipo prodotto *Editoria*) |
| Spedizioni Italia | Standard 5,90 € (**gratis da 49 €**) · Express 24h 9,90 € · **Ritiro in negozio gratis** |
| Spedizioni Europa | 14,90 € |
| Pagamenti | Stripe se configurato, altrimenti "Pagamento manuale (test)" |

## 4. Pagamenti con Stripe

1. Crea un account su <https://dashboard.stripe.com> e resta in **modalità test**
2. In `backend/.env`: `STRIPE_API_KEY=sk_test_...`
3. In `storefront/.env.local`: `NEXT_PUBLIC_STRIPE_KEY=pk_test_...`
4. Riavvia il backend, poi in Admin → *Settings → Regions* aggiungi il provider
   **Stripe** alle regioni Italia ed Europa (se il seed è stato eseguito senza chiave)
5. Carta di test: `4242 4242 4242 4242`, data futura qualsiasi, CVC qualsiasi
6. Webhook (necessario in produzione): endpoint `https://<backend>/hooks/payment/stripe_stripe`,
   segreto in `STRIPE_WEBHOOK_SECRET`. In locale: `stripe listen --forward-to localhost:9000/hooks/payment/stripe_stripe`

## 5. Personalizzare

| Cosa | Dove |
|---|---|
| Indirizzo, orari, email, social, **calendario tornei** | `storefront/src/lib/shop-config.ts` |
| Colori, ombre, font | `storefront/tailwind.config.js`, `storefront/src/styles/globals.css` |
| Logo | `storefront/public/brand/` |
| Catalogo demo | `backend/src/scripts/data/catalog.ts` (+ `npm run images` per rigenerare le copertine) |

> ⚠️ I prodotti demo e le loro copertine sono **segnaposto originali**: il catalogo reale
> si carica dall'admin o con l'import CSV (*Products → Import*).

## 6. Struttura

```
GamesAndComics/
├── backend/                 Medusa v2
│   ├── medusa-config.ts     moduli: Stripe, Redis (prod)
│   ├── src/scripts/seed.ts  dati iniziali del negozio
│   ├── src/scripts/data/    catalogo demo
│   └── static/demo/         copertine segnaposto
├── storefront/              Next.js (App Router)
│   └── src/
│       ├── app/[countryCode]/   pagine (home, store, categorie, prodotto, carrello, checkout, account, search)
│       ├── modules/             componenti per area (home, layout, products, cart, checkout, account…)
│       └── lib/                 data fetching, configurazione negozio, utility
├── scripts/                 setup.mjs, dev.mjs, db.mjs (PostgreSQL portatile)
├── tools/                   script di supporto (generazione immagini)
├── docs/ROADMAP.md          prossime fasi
└── docker-compose.yml       Postgres + Redis (alternativa a quello portatile)
```

## 7. Pubblicare su GitHub

```bash
gh repo create gamescomics --private --source=. --push
# oppure
git remote add origin git@github.com:<utente>/gamescomics.git
git push -u origin main
```
