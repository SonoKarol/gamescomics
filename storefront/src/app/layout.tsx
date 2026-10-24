import { getBaseURL } from "@lib/util/env"
import { shop } from "@lib/shop-config"
import SmoothScroll from "@modules/common/components/smooth-scroll"
import { Metadata, Viewport } from "next"
import "@fontsource/bangers/400.css"
import "@fontsource-variable/open-sans/index.css"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: `${shop.name} — Fumetti, manga e carte collezionabili`,
    template: `%s | ${shop.name}`,
  },
  description: shop.tagline,
  openGraph: {
    siteName: shop.name,
    locale: "it_IT",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#FBBA00",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="it" data-mode="light">
      <body>
        <SmoothScroll />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
