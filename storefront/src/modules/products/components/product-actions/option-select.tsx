import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <fieldset className="flex flex-col gap-y-2">
      <legend className="text-sm font-bold mb-2">{title}</legend>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions.map((v) => (
          <button
            onClick={() => updateOption(option.id, v)}
            key={v}
            aria-pressed={v === current}
            className={clx(
              "min-w-[56px] h-11 px-4 font-semibold border-[3px] border-gc-ink transition-[background-color,transform,box-shadow]",
              v === current
                ? "bg-gc-yellow shadow-ink -translate-x-0.5 -translate-y-0.5"
                : "bg-white hover:bg-gc-sun"
            )}
            disabled={disabled}
            data-testid="option-button"
          >
            {v}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export default OptionSelect
