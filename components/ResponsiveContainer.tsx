'use client'

import { useEffect, useState, type ComponentProps } from 'react'
import { ResponsiveContainer as RechartsResponsiveContainer } from 'recharts'

/**
 * SSR-safe drop-in replacement for recharts' ResponsiveContainer.
 * Defers chart rendering until after hydration to prevent SVG mismatches
 * (recharts generates different SVG on server vs client).
 */
export default function ResponsiveContainer(
  props: ComponentProps<typeof RechartsResponsiveContainer>
) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Render a placeholder with the same dimensions to avoid layout shift
    return (
      <div
        style={{
          width: typeof props.width === 'number' ? props.width : '100%',
          height: typeof props.height === 'number' ? props.height : 200,
        }}
      />
    )
  }

  return <RechartsResponsiveContainer {...props} />
}
