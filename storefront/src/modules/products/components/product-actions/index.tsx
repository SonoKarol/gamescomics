"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { AnimatePresence, motion } from "motion/react"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const countryCode = useParams().countryCode as string

  // Preseleziona la variante indicata nell'URL, altrimenti la prima disponibile
  useEffect(() => {
    if (!product.variants?.length) return
    const fromUrl = product.variants.find((v) => v.id === searchParams.get("v_id"))
    const firstAvailable = product.variants.find(
      (v) => !v.manage_inventory || v.allow_backorder || (v.inventory_quantity ?? 0) > 0
    )
    const initial = fromUrl ?? firstAvailable ?? product.variants[0]
    setOptions(optionsAsKeymap(initial.options) ?? {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2200)
  }

  const stockLeft =
    selectedVariant?.manage_inventory && !selectedVariant.allow_backorder
      ? selectedVariant.inventory_quantity ?? 0
      : null

  return (
    <>
      <div className="flex flex-col gap-y-5" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-5">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        {stockLeft !== null && isValidVariant && (
          <p className="text-sm font-semibold flex items-center gap-2">
            <span
              aria-hidden
              className={
                "w-2.5 h-2.5 rounded-full border border-gc-ink " +
                (stockLeft <= 0 ? "bg-gc-red" : stockLeft <= 10 ? "bg-gc-orange" : "bg-gc-mint")
              }
            />
            {stockLeft <= 0
              ? "Esaurito"
              : stockLeft <= 10
              ? `Solo ${stockLeft} disponibili`
              : "Disponibile, spedito in 24/48h"}
          </p>
        )}

        <button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          className="btn btn-primary w-full h-14 text-2xl relative overflow-hidden"
          data-testid="add-product-button"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={justAdded ? "added" : isAdding ? "adding" : "idle"}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, scale: justAdded ? [1, 1.15, 1] : 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {justAdded
                ? "Aggiunto al carrello!"
                : isAdding
                ? "Aggiungo..."
                : !selectedVariant
                ? "Scegli un'opzione"
                : !inStock || !isValidVariant
                ? "Esaurito"
                : "Aggiungi al carrello"}
            </motion.span>
          </AnimatePresence>
        </button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
