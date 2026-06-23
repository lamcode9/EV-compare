import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

// Node runtime: next/og bundles Satori + resvg WASM (~1 MB), which exceeds
// Vercel's 1 MB Edge function limit. Node functions have a far larger cap.
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') || 'battery.mom'
  const subtitle = searchParams.get('subtitle') || 'Clear data for the energy transition.'
  const type = searchParams.get('type') || 'default' // default, ev, bess, calculator, insight
  const stat1Label = searchParams.get('stat1Label') || ''
  const stat1Value = searchParams.get('stat1Value') || ''
  const stat2Label = searchParams.get('stat2Label') || ''
  const stat2Value = searchParams.get('stat2Value') || ''

  const typeColors: Record<string, { bg: string; accent: string; badge: string }> = {
    default: { bg: '#0f0f0f', accent: '#10b981', badge: '' },
    ev: { bg: '#0f0f0f', accent: '#10b981', badge: 'EV Comparison' },
    bess: { bg: '#0f0f0f', accent: '#06b6d4', badge: 'Battery Storage' },
    calculator: { bg: '#0f0f0f', accent: '#3b82f6', badge: 'Calculator' },
    insight: { bg: '#0f0f0f', accent: '#8b5cf6', badge: 'Insights' },
  }

  const colors = typeColors[type] || typeColors.default

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          backgroundColor: colors.bg,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Top: Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {colors.badge && (
            <div
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: colors.accent,
                backgroundColor: `${colors.accent}20`,
                padding: '6px 16px',
                borderRadius: '100px',
                border: `1px solid ${colors.accent}40`,
              }}
            >
              {colors.badge}
            </div>
          )}
        </div>

        {/* Middle: Title + Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: title.length > 40 ? '48px' : '56px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              maxWidth: '900px',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#9ca3af',
              maxWidth: '700px',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>

          {/* Stats row */}
          {stat1Label && stat1Value && (
            <div style={{ display: 'flex', gap: '40px', marginTop: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '36px', fontWeight: 700, color: colors.accent }}>
                  {stat1Value}
                </div>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>{stat1Label}</div>
              </div>
              {stat2Label && stat2Value && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: colors.accent }}>
                    {stat2Value}
                  </div>
                  <div style={{ fontSize: '16px', color: '#6b7280' }}>{stat2Label}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: colors.accent,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            B
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>battery.mom</div>
          <div style={{ fontSize: '16px', color: '#6b7280', marginLeft: '8px' }}>
            Independent energy data
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
