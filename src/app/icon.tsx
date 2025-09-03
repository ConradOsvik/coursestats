import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32
}
export const contentType = 'image/png'

async function loadGoogleFont(family: string, weight: number, text: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@${weight}&text=${encodeURIComponent(text)}`

  const cssResponse = await fetch(cssUrl)
  const css = await cssResponse.text()

  const srcRegex =
    /src:\s*url\((?<url>[^)]+)\)\s*format\('(woff2|opentype|truetype)'\)/
  const match = srcRegex.exec(css)
  const fontUrl = match?.groups?.url ?? null

  if (!fontUrl) {
    throw new Error('Failed to locate font URL in Google Fonts CSS')
  }

  const fontResponse = await fetch(fontUrl)
  if (!fontResponse.ok) {
    throw new Error(`Failed to fetch font data: ${fontResponse.status}`)
  }

  return fontResponse.arrayBuffer()
}

export default async function Icon() {
  const text = 'CS'
  const weight = 700

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: 'black',
          fontFamily: 'Inter',
          fontWeight: weight,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
      >
        {text}
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await loadGoogleFont('Inter', weight, text),
          weight,
          style: 'normal'
        }
      ]
    }
  )
}
