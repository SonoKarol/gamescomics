import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import Image from "next/image"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-gc-paper relative small:min-h-screen">
      <div className="h-[72px] bg-white border-b-[3px] border-gc-ink">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="font-semibold flex items-center gap-x-2 flex-1 basis-0 hover:underline"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden small:block">Torna al carrello</span>
            <span className="block small:hidden">Indietro</span>
          </LocalizedClientLink>
          <LocalizedClientLink href="/" data-testid="store-link" aria-label="Games & Comics Shop — home">
            <Image src="/brand/logo-round.webp" alt="Games & Comics Shop" width={96} height={66} className="h-[56px] w-auto" />
          </LocalizedClientLink>
          <div className="flex-1 basis-0 flex justify-end">
            <span className="hidden small:inline text-sm font-semibold">Pagamento sicuro</span>
          </div>
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}
