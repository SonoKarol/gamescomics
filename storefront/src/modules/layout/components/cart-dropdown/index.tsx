"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { ShoppingBag } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const subtotal = cartState?.item_total ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) clearTimeout(activeTimer)
    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) clearTimeout(activeTimer)
    }
  }, [activeTimer])

  const pathname = usePathname()

  // Apre il riepilogo quando cambia il numero di articoli (tranne nella pagina carrello)
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    itemRef.current = totalItems
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton as="div" className="h-full">
          <LocalizedClientLink
            className="relative grid place-items-center w-11 h-11 border-[3px] border-gc-ink bg-gc-yellow shadow-ink-sm hover:bg-gc-sun transition-colors"
            href="/cart"
            aria-label={`Carrello, ${totalItems} articoli`}
            data-testid="nav-cart-link"
          >
            <ShoppingBag />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-3 -right-3 min-w-[24px] h-6 px-1 grid place-items-center rounded-full bg-gc-red text-white text-xs font-bold border-2 border-gc-ink"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+14px)] right-0 panel shadow-ink-lg w-[420px] text-gc-ink"
            data-testid="nav-cart-dropdown"
          >
            <div className="px-5 py-3 border-b-[3px] border-gc-ink bg-gc-yellow">
              <h3 className="comic-title text-2xl">Il tuo carrello</h3>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div
                  className="overflow-y-auto max-h-[380px] p-5 grid grid-cols-1 gap-y-6 no-scrollbar"
                  data-lenis-prevent
                >
                  {cartState.items
                    .sort((a, b) =>
                      (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                    )
                    .map((item) => (
                      <div
                        className="grid grid-cols-[80px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-20"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col min-w-0">
                              <h4 className="font-semibold truncate">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                  data-testid="product-link"
                                >
                                  {item.title}
                                </LocalizedClientLink>
                              </h4>
                              <LineItemOptions
                                variant={item.variant}
                                data-testid="cart-item-variant"
                                data-value={item.variant}
                              />
                              <span
                                className="text-sm text-gc-ink/70"
                                data-testid="cart-item-quantity"
                                data-value={item.quantity}
                              >
                                Quantità: {item.quantity}
                              </span>
                            </div>
                            <LineItemPrice
                              item={item}
                              style="tight"
                              currencyCode={cartState.currency_code}
                            />
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-1"
                            data-testid="cart-item-remove-button"
                          >
                            Rimuovi
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-5 border-t-[3px] border-gc-ink flex flex-col gap-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      Subtotale <span className="font-normal text-sm">(IVA inclusa)</span>
                    </span>
                    <span
                      className="comic-title text-2xl"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink
                    href="/cart"
                    className="btn btn-primary w-full"
                    data-testid="go-to-cart-button"
                  >
                    Vai al carrello
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex py-12 px-6 flex-col gap-y-4 items-center text-center">
                <p className="comic-title text-3xl">Ancora niente qui!</p>
                <p className="text-sm">
                  Il carrello è vuoto: dai un'occhiata alle novità della settimana.
                </p>
                <LocalizedClientLink
                  href="/store"
                  className="btn btn-primary"
                  onClick={close}
                >
                  Sfoglia il catalogo
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
