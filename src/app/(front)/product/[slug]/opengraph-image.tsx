import { ImageResponse } from 'next/og'
import productServices from '@/lib/services/productService'
import { formatPriceAmount } from '@/lib/utils'
import { getSalePrice } from '@/lib/productPricing'

export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

export default async function Og({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await productServices.getBySlug(slug)
  if (!product) return new Response('Not found', { status: 404 })

  const imageUrl = product.images[0]
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_600,h_630,c_fill/${product.images[0]}`
    : null

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#131921',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Left: product image */}
        {imageUrl && (
          <div style={{ display: 'flex', width: 600, height: 630, backgroundColor: '#fff' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={product.name} width={600} height={630} style={{ objectFit: 'contain' }} />
          </div>
        )}

        {/* Right: product info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', flex: 1, gap: 16 }}>
          <p style={{ color: '#FF9900', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, margin: 0 }}>
            Agu Brothers Electronics
          </p>
          <h1 style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
            {product.name}
          </h1>
          {product.brand && (
            <p style={{ color: '#AAAAAA', fontSize: 18, margin: 0 }}>{product.brand}</p>
          )}
          <p style={{ color: '#FF9900', fontSize: 40, fontWeight: 700, margin: 0 }}>
            {formatPriceAmount(getSalePrice(product))}
          </p>
          {product.countInStock > 0 && (
            <p style={{ color: '#00A650', fontSize: 18, fontWeight: 600, margin: 0 }}>✓ In Stock</p>
          )}
          <p style={{ color: '#CCCCCC', fontSize: 16, margin: 0, marginTop: 8 }}>
            agubrothers.com
          </p>
        </div>
      </div>
    ),
    { ...size }
  )
}
