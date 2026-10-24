import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const IS_PROD = process.env.NODE_ENV === "production"
const REDIS_URL = process.env.REDIS_URL
const STRIPE_API_KEY = process.env.STRIPE_API_KEY

/**
 * Moduli opzionali: vengono attivati solo se le relative variabili d'ambiente
 * sono presenti, così lo sviluppo locale funziona anche senza Stripe o Redis.
 */
const modules: Record<string, any>[] = []

// --- Pagamenti: Stripe (carte, Apple Pay, Google Pay, Klarna, ...) ---
if (STRIPE_API_KEY) {
  modules.push({
    resolve: "@medusajs/medusa/payment",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/payment-stripe",
          id: "stripe",
          options: {
            apiKey: STRIPE_API_KEY,
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            // Abilita i metodi di pagamento automatici configurati nella dashboard Stripe
            automaticPaymentMethods: true,
            // Cattura immediata: l'importo viene incassato alla conferma dell'ordine
            capture: true,
          },
        },
      ],
    },
  })
}

// --- Redis: obbligatorio in produzione (eventi, workflow, cache, lock) ---
if (REDIS_URL && IS_PROD) {
  modules.push(
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      key: Modules.EVENT_BUS,
      options: { redisUrl: REDIS_URL },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      key: Modules.WORKFLOW_ENGINE,
      options: { redis: { url: REDIS_URL } },
    },
    {
      resolve: "@medusajs/medusa/cache-redis",
      key: Modules.CACHE,
      options: { redisUrl: REDIS_URL },
    },
    {
      resolve: "@medusajs/medusa/locking",
      key: Modules.LOCKING,
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            is_default: true,
            options: { redisUrl: REDIS_URL },
          },
        ],
      },
    }
  )
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: IS_PROD ? REDIS_URL : undefined,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    // Pannello di amministrazione disponibile su http://localhost:9000/app
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },
  modules,
})
