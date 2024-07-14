'use client'
import Image from 'next/image'
import { useState } from 'react'
import CldImage from '../CldImage'

interface ProductImagesProps {
  images: string[]
}

export default function ProductImages({ images }: ProductImagesProps) {
  const [activeImage, setActiveImage] = useState<string>(images?.[0] || '')

  return (
    <>
      <div className="text-center justify-center">
        <CldImage
          src={activeImage}
          width={300}
          height={300}
          className="object-cover w-[500px] h-[520px] rounded-lg"
          //className="max-w-full max-h-100"
          alt="Product"
        />
      </div>
      <div className="flex gap-2 mt-4">
        {images.map((image) => (
          <div
            key={image}
            className={`border-2 p-1 cursor-pointer rounded-lg ${
              image === activeImage
                ? 'border-gray-300 rounded-lg'
                : 'border-transparent'
            }`}
            onClick={() => setActiveImage(image)}
          >
            <CldImage
              src={image}
              width={50}
              height={50}
              className="object-cover w-full h-full rounded-lg"
              alt="Product Thumbnail"
            />
          </div>
        ))}
      </div>
    </>
  )
}
