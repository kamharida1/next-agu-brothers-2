'use client'

import { useState } from 'react'
import CldImage from '../../../../components/CldImage'

export default function ProductImages({ images }: { images: string[] }) {
  const [active, setActive] = useState(0)
  const safeImages = images.length > 0 ? images : ['']

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      {/* Desktop: vertical thumbnails */}
      {safeImages.length > 1 && (
        <div
          className="hidden lg:flex flex-col gap-2 w-[72px] shrink-0 max-h-[520px] overflow-y-auto pr-0.5"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {safeImages.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Image ${i + 1} of ${safeImages.length}`}
              onClick={() => setActive(i)}
              className={`relative aspect-square w-full rounded-sm overflow-hidden border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] ${
                i === active
                  ? 'border-[#FF9900] shadow-sm ring-1 ring-[#FF9900]/30'
                  : 'border-[#D5D9D9] hover:border-[#AAAAAA]'
              }`}
            >
              <CldImage
                src={img}
                fill
                sizes="72px"
                className="object-contain p-1 bg-white"
                alt=""
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 min-w-0">
        <div className="relative aspect-square w-full max-h-[min(90vw,520px)] lg:max-h-[520px] bg-white border border-[#D5D9D9] rounded-sm overflow-hidden">
          {safeImages.map((img, i) => (
            <div
              key={`${img}-main-${i}`}
              className={`absolute inset-0 transition-opacity duration-150 ${
                i === active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <CldImage
                src={img}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                priority={i === 0}
                className="object-contain p-4 md:p-6"
                alt={`Product image ${i + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Mobile & tablet: horizontal thumbnails */}
        {safeImages.length > 1 && (
          <div
            className="lg:hidden flex gap-2 mt-3 overflow-x-auto pb-1 snap-x snap-mandatory"
            role="tablist"
            aria-label="Product image thumbnails"
          >
            {safeImages.map((img, i) => (
              <button
                key={`${img}-mob-${i}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Image ${i + 1}`}
                onClick={() => setActive(i)}
                className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-sm overflow-hidden border snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] ${
                  i === active
                    ? 'border-[#FF9900] ring-1 ring-[#FF9900]/30'
                    : 'border-[#D5D9D9]'
                }`}
              >
                <CldImage
                  src={img}
                  fill
                  sizes="64px"
                  className="object-contain p-0.5 bg-white"
                  alt=""
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
