import { ImageResponse } from 'next/og'
import productServices from '@/lib/services/productService'

export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

export default async function Og({
  params,
}: {
  params: Promise<{ brand: string }>
}) {
  const { brand: brandParam } = await params
  const brand = decodeURIComponent(brandParam)
  const items = await productServices.getByBrand(brandParam)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#131921',
          padding: 64,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <p
          style={{
            color: '#FF9900',
            fontSize: 20,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 2,
            margin: 0,
          }}
        >
          Agu Brothers Electronics
        </p>
        <h1
          style={{
            color: '#FFFFFF',
            fontSize: 56,
            fontWeight: 700,
            margin: '16px 0',
            lineHeight: 1.2,
          }}
        >
          {brand}
        </h1>
        <p style={{ color: '#CCCCCC', fontSize: 24, margin: 0 }}>
          {items.length} brand-new product{items.length !== 1 ? 's' : ''} · Fast delivery across Nigeria
        </p>
        <p style={{ color: '#AAAAAA', fontSize: 18, margin: '24px 0 0' }}>
          agubrothers.com
        </p>
      </div>
    ),
    { ...size }
  )
}
