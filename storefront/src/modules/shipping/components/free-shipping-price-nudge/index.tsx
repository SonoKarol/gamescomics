"use client"

import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, XMark } from "@medusajs/icons"
import {
  HttpTypes,
  StoreCart,
  StoreCartShippingOption,
  StorePrice,
} from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState } from "react"
import { StoreFreeShippingPrice } from "types/global"

const computeTarget = (
  cart: HttpTypes.StoreCart,
  price: HttpTypes.StorePrice
) => {
  const priceRule = (price.price_rules || []).find(
    (pr) => pr.attribute === "item_total"
  )!

  const currentAmount = cart.item_total
  const targetAmount = parseFloat(priceRule.value)

  if (priceRule.operator === "gt") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount > targetAmount,
      target_remaining:
        currentAmount > targetAmount ? 0 : targetAmount + 1 - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "gte") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount > targetAmount,
      target_remaining:
        currentAmount > targetAmount ? 0 : targetAmount - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "lt") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: targetAmount > currentAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : currentAmount + 1 - targetAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "lte") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: targetAmount > currentAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : currentAmount - targetAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount === targetAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : targetAmount - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  }
}

export default function ShippingPriceNudge({
  variant = "inline",
  cart,
  shippingOptions,
}: {
  variant?: "popup" | "inline"
  cart: StoreCart
  shippingOptions: StoreCartShippingOption[]
}) {
  if (!cart || !shippingOptions?.length) {
    return
  }

  // Check if any shipping options have a conditional price based on item_total
  const freeShippingPrice = shippingOptions
    .map((shippingOption) => {
      const calculatedPrice = shippingOption.calculated_price

      if (!calculatedPrice) {
        return
      }

      // Get all prices that are:
      // 1. Currency code is same as the cart's
      // 2. Have a rule that is set on item_total
      const validCurrencyPrices = shippingOption.prices.filter(
        (price) =>
          price.currency_code === cart.currency_code &&
          (price.price_rules || []).some(
            (priceRule) => priceRule.attribute === "item_total"
          )
      )

      return validCurrencyPrices.map((price) => {
        return {
          ...price,
          shipping_option_id: shippingOption.id,
          ...computeTarget(cart, price),
        }
      })
    })
    .flat(1)
    .filter(Boolean)
    // We focus here entirely on free shipping, but this can be edited to handle multiple layers
    // of reduced shipping prices.
    .find((price) => price?.amount === 0)

  if (!freeShippingPrice) {
    return
  }

  if (variant === "popup") {
    return <FreeShippingPopup cart={cart} price={freeShippingPrice} />
  } else {
    return <FreeShippingInline cart={cart} price={freeShippingPrice} />
  }
}

function FreeShippingInline({
  cart,
  price,
}: {
  cart: StoreCart
  price: StorePrice & {
    target_reached: boolean
    target_remaining: number
    remaining_percentage: number
  }
}) {
  return (
    <div className="bg-neutral-100 p-2 rounded-lg border">
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-neutral-600">
          <div>
            {price.target_reached ? (
              <div className="flex items-center gap-1.5">
                <CheckCircleSolid className="text-green-500 inline-block" />{" "}
                Spedizione gratuita sbloccata!
              </div>
            ) : (
              `Spedizione gratuita`
            )}
          </div>

          <div
            className={clx("visible", {
              "opacity-0 invisible": price.target_reached,
            })}
          >
            Mancano{" "}
            <span className="text-neutral-950">
              {convertToLocale({
                amount: price.target_remaining,
                currency_code: cart.currency_code,
              })}
            </span>{" "}

          </div>
        </div>
        <div className="flex justify-between gap-1">
          <div
            className={clx(
              "bg-gradient-to-r from-zinc-400 to-zinc-500 h-1 rounded-full max-w-full duration-500 ease-in-out",
              {
                "from-green-400 to-green-500": price.target_reached,
              }
            )}
            style={{ width: `${price.remaining_percentage}%` }}
          ></div>
          <div className="bg-neutral-300 h-1 rounded-full w-fit flex-grow"></div>
        </div>
      </div>
    </div>
  )
}

function FreeShippingPopup({
  cart,
  price,
}: {
  cart: StoreCart
  price: StoreFreeShippingPrice
}) {
  const [isClosed, setIsClosed] = useState(false)
  const remaining = convertToLocale({
    amount: price.target_remaining,
    currency_code: cart.currency_code,
  })

  return (
    <div
      role="status"
      className={clx(
        "fixed bottom-4 right-4 left-4 xsmall:left-auto z-40 xsmall:w-[340px] transition-all duration-500 ease-in-out",
        {
          "opacity-0 invisible translate-y-4 delay-1000": price.target_reached,
          "opacity-0 invisible translate-y-4": isClosed,
          "opacity-100 visible": !price.target_reached && !isClosed,
        }
      )}
    >
      <div className="relative bg-white border-[3px] border-gc-ink shadow-ink p-4 pr-10">
        <button
          onClick={() => setIsClosed(true)}
          className="absolute top-2 right-2 grid place-items-center w-7 h-7 hover:bg-gc-sun"
          aria-label="Chiudi"
        >
          <XMark />
        </button>
        <p className="text-sm">
          {price.target_reached ? (
            <strong>Spedizione gratuita sbloccata!</strong>
          ) : (
            <>
              Ti mancano <strong>{remaining}</strong> per la spedizione gratuita
            </>
          )}
        </p>
        <div className="mt-2 h-2.5 border-2 border-gc-ink bg-gc-paper">
          <div
            className="h-full bg-gc-yellow transition-[width] duration-500"
            style={{ width: `${price.remaining_percentage}%` }}
          />
        </div>
        <LocalizedClientLink href="/store" className="mt-3 inline-block text-sm font-bold underline decoration-2 decoration-gc-yellow underline-offset-2">
          Aggiungi qualcos&apos;altro
        </LocalizedClientLink>
      </div>
    </div>
  )
}
