import CldImage from '@/components/CldImage'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export default async function Image() {
  const logoSrc = await fetch(new URL('./shirt3.jpg', import.meta.url)).then(
    (res) => res.arrayBuffer()
  )

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CldImage
          src={`data:image/jpeg;base64,${Buffer.from(logoSrc).toString('base64')}`}
          height="100"
          width="100"
          alt="Vercel Logo"
          
        />
      </div>
    )
  )
}
