"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_total?: number | null
    item_subtotal?: number | null
    shipping_total?: number | null
    shipping_subtotal?: number | null
    discount_total?: number | null
    discount_subtotal?: number | null
    shipping_methods?: unknown[] | null
  }
}

/**
 * Totali con prezzi IVA inclusa (come si aspetta un cliente italiano):
 * Articoli + Spedizione − Sconto = Totale, con l'IVA indicata "di cui".
 */
const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const { currency_code, total, tax_total } = totals
  const items = totals.item_total ?? totals.item_subtotal ?? 0
  const shipping = totals.shipping_total ?? totals.shipping_subtotal ?? 0
  const discount = totals.discount_total ?? totals.discount_subtotal ?? 0
  const hasShipping = !!totals.shipping_methods?.length
  const fmt = (amount: number) => convertToLocale({ amount, currency_code })

  return (
    <div>
      <dl className="flex flex-col gap-y-2 text-[15px]">
        <div className="flex items-center justify-between">
          <dt>Articoli</dt>
          <dd data-testid="cart-subtotal" data-value={items}>
            {fmt(items)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Spedizione</dt>
          <dd data-testid="cart-shipping" data-value={shipping}>
            {!hasShipping ? (
              <span className="text-gc-ink/60">Calcolata al checkout</span>
            ) : shipping === 0 ? (
              <span className="font-bold text-[#178CC6]">Gratis</span>
            ) : (
              fmt(shipping)
            )}
          </dd>
        </div>
        {!!discount && (
          <div className="flex items-center justify-between">
            <dt>Sconto</dt>
            <dd className="font-bold text-gc-red" data-testid="cart-discount" data-value={discount}>
              − {fmt(discount)}
            </dd>
          </div>
        )}
      </dl>
      <div className="h-[3px] w-full bg-gc-ink my-4" />
      <div className="flex items-end justify-between">
        <span className="font-bold text-lg">Totale</span>
        <span className="comic-title text-4xl" data-testid="cart-total" data-value={total || 0}>
          {fmt(total ?? 0)}
        </span>
      </div>
      <p className="mt-1 text-right text-xs text-gc-ink/60" data-testid="cart-taxes" data-value={tax_total || 0}>
        {tax_total ? `di cui IVA ${fmt(tax_total)}` : "IVA inclusa"}
      </p>
    </div>
  )
}

export default CartTotals
