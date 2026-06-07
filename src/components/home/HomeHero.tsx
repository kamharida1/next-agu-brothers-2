import Image from 'next/image'
import Link from 'next/link'

const TRUST_POINTS = [
  '100% brand new',
  'Manufacturer warranty',
  'Nationwide delivery',
] as const

export default function HomeHero() {
  return (
    <section className="bg-[#EAEDED] px-3 sm:px-4 pt-3 pb-1" aria-label="Agu Brothers storefront">
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-sm border border-[#232F3E] bg-[#131921] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-stretch">
          {/* Copy + CTAs — real HTML text, never cropped */}
          <div className="flex flex-col justify-center gap-3 p-4 sm:p-5 md:w-[min(100%,520px)] md:shrink-0 md:p-6 lg:w-[min(100%,560px)]">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-sm border border-[#007600] bg-[#007600]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#9FE870] sm:text-xs">
                Enugu &amp; nationwide
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold leading-snug text-white sm:text-2xl lg:text-[1.65rem] lg:leading-tight">
                Agu Brothers
              </h1>
              <p className="mt-1 text-sm font-semibold text-[#FF9900] sm:text-base">
                Electronics &amp; Home Appliances Nigeria
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#CCCCCC]">
                TVs, fridges, ACs, generators &amp; more — factory-fresh stock with
                secure checkout and fast delivery.
              </p>
            </div>

            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#CCCCCC]">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-1">
                  <span className="text-[#FF9900]" aria-hidden>
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
              <Link
                href="/all-products"
                className="btn-amazon w-full py-2.5 text-center text-sm font-bold sm:w-auto sm:min-w-[118px] sm:px-5"
              >
                Shop Now
              </Link>
              <Link
                href="/search"
                className="btn-amazon-outline w-full py-2.5 text-center text-sm sm:w-auto sm:min-w-[118px] sm:px-5"
              >
                Browse All
              </Link>
              <Link
                href="/blog"
                className="w-full rounded-lg border border-white/20 py-2.5 text-center text-sm text-white transition-colors hover:bg-white/10 sm:w-auto sm:min-w-[118px] sm:px-5"
              >
                Buying Guides
              </Link>
            </div>
          </div>

          {/* Product visual — separate column, no text baked in */}
          <div className="relative h-[132px] w-full shrink-0 sm:h-[150px] md:h-auto md:min-h-[240px] md:flex-1">
            <Image
              src="/hero-banner.png"
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              aria-hidden
              className="object-cover object-[70%_center] md:object-right"
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-[#131921] to-transparent md:block"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  )
}
