import { ImageResponse } from 'next/og'
import { person } from '@/lib/site'

// Generated at build time — no external asset to host, and it can never 404.
export const alt = 'Ayushi Sharma — Full-Stack Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #16161c 0%, #09090b 60%)',
          padding: '72px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#71717A',
          }}
        >
          {person.role}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#FAFAFA',
              lineHeight: 1,
            }}
          >
            {person.name}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 36,
              color: '#A1A1AA',
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            React · Next.js · Node.js · AWS
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', height: 6, width: 84, background: '#2563EB' }} />
          <div style={{ display: 'flex', fontSize: 26, color: '#71717A' }}>{person.location}</div>
        </div>
      </div>
    ),
    size,
  )
}
