import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#131921',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <span style={{ color: '#FF9900', fontSize: 64, fontWeight: 800, fontFamily: 'Arial', lineHeight: 1 }}>
          AB
        </span>
        <span style={{ color: '#CCCCCC', fontSize: 18, fontFamily: 'Arial', letterSpacing: 4 }}>
          STORE
        </span>
      </div>
    ),
    { ...size }
  )
}
