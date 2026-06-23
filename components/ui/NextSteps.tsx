import Link from 'next/link'
import { Section } from './Section'
import { Container } from './Container'
import { Eyebrow } from './Eyebrow'
import { cn } from './cn'
import { KIND_LABEL, nextStepsFor, type Destination, type Kind } from '@/lib/journey'

const kindColor: Record<Kind, string> = {
  track: 'text-brand-600',
  decide: 'text-amber-700',
  read: 'text-ink-500',
}

/**
 * The site's connective footer. Every page ends with this, pointing to the
 * logical next pages so moving through battery.mom feels like one journey.
 * Pass `route` to pull the curated next steps from the journey registry, or
 * pass `steps` directly. Renders nothing if there are no steps — safe to drop
 * on any page.
 */
export function NextSteps({
  route,
  steps,
  heading = 'Where to go next',
  eyebrow = 'Keep exploring',
  tone = 'warm',
  className,
}: {
  route?: string
  steps?: Destination[]
  heading?: string
  eyebrow?: string
  tone?: 'warm' | 'paper' | 'raised'
  className?: string
}) {
  const items = steps ?? (route ? nextStepsFor(route) : [])
  if (items.length === 0) return null

  return (
    <Section tone={tone} size="md" className={cn('border-t border-ink/5', className)}>
      <Container width="wide">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {heading}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="group flex flex-col rounded-card border border-ink/10 bg-paper-100 p-5 shadow-card transition-colors hover:border-brand-300"
            >
              <span
                className={cn(
                  'text-[11px] font-semibold uppercase tracking-[0.16em]',
                  kindColor[step.kind]
                )}
              >
                {KIND_LABEL[step.kind]}
              </span>
              <span className="mt-2 font-display text-xl font-medium tracking-tight text-ink">
                {step.label}
              </span>
              <span className="mt-2 text-sm leading-relaxed text-ink-600">{step.blurb}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                Open
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}
