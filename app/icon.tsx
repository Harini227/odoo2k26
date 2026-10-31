import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 50%, #0f172a 100%)',
          borderRadius: 8,
          border: '1.5px solid rgba(16, 185, 129, 0.5)',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: 20,
          fontFamily: 'sans-serif',
          letterSpacing: '-0.05em',
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  )
}
