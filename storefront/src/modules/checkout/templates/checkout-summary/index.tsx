import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-6 flex flex-col-reverse small:flex-col gap-y-8 small:self-start">
      <div className="w-full panel bg-gc-sun p-6 flex flex-col">
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
          className="comic-title text-4xl"
        >
          Nel carrello
        </Heading>
        <Divider className="my-6" />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
