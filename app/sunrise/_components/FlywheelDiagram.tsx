'use client'

import { useInView, usePrefersReducedMotion } from '../_lib/useScroll'

type StationColor = 'gold' | 'paper' | 'brand'

interface Station {
  lines: string[]
  color: StationColor
}

const STATIONS: Station[] = [
  { lines: ['Cheaper', 'energy'], color: 'gold' },
  { lines: ['Cheaper', 'compute'], color: 'paper' },
  { lines: ['More capable', 'AI'], color: 'paper' },
  { lines: ['Robots that', 'build'], color: 'paper' },
  { lines: ['Cheaper', 'factories'], color: 'brand' },
]

const CENTER = 320
const NODE_R = 210
const LABEL_R = 258
const LINE_HEIGHT = 22

const DOT_FILL_CLASS: Record<StationColor, string> = {
  gold: 'fill-gold',
  paper: 'fill-paper-200',
  brand: 'fill-brand-400',
}

const LABEL_FILL_CLASS: Record<StationColor, string> = {
  gold: 'fill-gold',
  paper: 'fill-paper-300',
  brand: 'fill-brand-400',
}

function angleForStation(i: number): number {
  // Station 0 sits at the top (-90deg); each subsequent station is 72deg
  // clockwise around the ring.
  return ((-90 + i * 72) * Math.PI) / 180
}

function point(radius: number, angle: number): { x: number; y: number } {
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  }
}

const ARROW_STROKE = 'rgba(233,225,207,0.4)' // paper-300 @ 40% alpha

/**
 * Circular flywheel diagram: five stations of the compounding-century loop,
 * connected by curved arrows that flow clockwise back into "Cheaper energy".
 */
export default function FlywheelDiagram({ className }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3)
  const reducedMotion = usePrefersReducedMotion()
  const animate = inView && !reducedMotion

  const nodes = STATIONS.map((station, i) => ({
    station,
    node: point(NODE_R, angleForStation(i)),
    label: point(LABEL_R, angleForStation(i)),
  }))

  const ariaLabel =
    'Flywheel: cheaper energy leads to cheaper compute, more capable AI, robots that build, cheaper factories, and back to cheaper energy.'

  return (
    <div ref={ref} className={`mx-auto w-full max-w-xl ${className ?? ''}`}>
      <svg
        viewBox="0 0 640 640"
        role="img"
        aria-label={ariaLabel}
        className="h-auto w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes flywheel-flow {
            to { stroke-dashoffset: -32; }
          }
          @keyframes flywheel-pulse {
            0% { transform: scale(1); }
            35% { transform: scale(1.7); }
            100% { transform: scale(1); }
          }
          .flywheel-arrow-animated {
            stroke-dasharray: 10 6;
            animation: flywheel-flow 6s linear infinite;
          }
          .flywheel-dot-animated {
            animation: flywheel-pulse 0.7s ease-out both;
          }
        `}</style>

        <defs>
          <marker
            id="flywheel-arrowhead"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill={ARROW_STROKE} />
          </marker>
        </defs>

        {/* Base ring, faint */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={NODE_R}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className="text-paper-300/10"
        />

        {/* Connecting arcs, clockwise, each pointing to the next station */}
        {nodes.map(({ node }, i) => {
          const next = nodes[(i + 1) % nodes.length].node
          const d = `M ${node.x} ${node.y} A ${NODE_R} ${NODE_R} 0 0 1 ${next.x} ${next.y}`
          return (
            <path
              key={`arc-${i}`}
              d={d}
              fill="none"
              stroke={ARROW_STROKE}
              strokeWidth={2}
              strokeLinecap="round"
              markerEnd="url(#flywheel-arrowhead)"
              className={animate ? 'flywheel-arrow-animated' : undefined}
            />
          )
        })}

        {/* Center mark */}
        <text
          x={CENTER}
          y={CENTER - 8}
          textAnchor="middle"
          className="fill-paper-300 font-display italic"
          style={{ fontSize: 30 }}
        >
          compounding
        </text>
        <text
          x={CENTER}
          y={CENTER + 20}
          textAnchor="middle"
          className="fill-paper-300/60 font-sans"
          style={{ fontSize: 13 }}
        >
          <tspan x={CENTER} dy={0}>
            each turn of the wheel
          </tspan>
          <tspan x={CENTER} dy={17}>
            makes the next turn cheaper
          </tspan>
        </text>

        {/* Stations: node dot + label */}
        {nodes.map(({ station, node, label }, i) => (
          <g key={`station-${i}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={7}
              className={`${DOT_FILL_CLASS[station.color]} ${
                animate ? 'flywheel-dot-animated' : ''
              }`}
              style={{
                transformOrigin: `${node.x}px ${node.y}px`,
                animationDelay: animate ? `${i * 150}ms` : undefined,
              }}
            />
            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              className={`font-sans ${LABEL_FILL_CLASS[station.color]}`}
              style={{ fontSize: 16 }}
            >
              {station.lines.map((line, li) => (
                <tspan key={li} x={label.x} dy={li === 0 ? 0 : LINE_HEIGHT}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
