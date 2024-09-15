import { ImageResponse } from 'next/og'
import CldImage from '@/components/CldImage'
import productServices from '@/lib/services/productService'
import { formatPrice } from '@/lib/utils'

export const contentType = 'image/jpg'

export default async function Og({ params }: { params: { slug: string } }) {
  const product = await productServices.getBySlug(params.slug)
  if (!product) {
    return <div>Product not found</div>
  }

  // Get product images
  const images = product.images
  const imageUrl = images[0] + '?w=1200&h=630&auto=format&q=75'
  console.log('Image URL:', imageUrl) // Log the image URL for debugging

  // Generate Open Graph image response
  return new ImageResponse(
    (
      <div tw="relative flex w-full h-full items-center justify-center">
        {/* Background */}
        <div tw="absolute inset-0 bg-gray-200"></div>
        {/* Product image */}
        <CldImage
          src={imageUrl}
          width={1200}
          height={630}
          alt={`${product?.name}`}
        />
        {/* Overlay */}
        <div tw="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 tw="text-white text-4xl font-bold">{product.name}</h1>
        <p tw="text-white text-2xl font-bold">{formatPrice(product.price)}</p>
        <p tw="text-white text-lg">{product.description}</p>
        <div tw="flex gap-2">
          {Array.from({ length: product.rating }).map((_, index) => (
            <span key={index} className="text-white text-2xl">
              ⭐
            </span>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
