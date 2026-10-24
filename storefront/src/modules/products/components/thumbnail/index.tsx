import { clx } from "@medusajs/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clx(
        "relative w-full overflow-hidden bg-gc-newsprint",
        className,
        {
          "aspect-[3/4]": size !== "square",
          "aspect-[1/1] border-2 border-gc-ink": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt=""
      className="absolute inset-0 object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
      draggable={false}
      quality={70}
      sizes="(max-width: 576px) 50vw, (max-width: 1024px) 33vw, 320px"
      fill
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center halftone">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
