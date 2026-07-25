'use client'

import { useInView, usePrefersReducedMotion } from '../_lib/useScroll'
import type { WorkItem, WorkItemTone } from '@/content/sunrise/script'
import { ACT_5_COPY } from '@/content/sunrise/script'

/**
 * Act V — three real constraints, editorial list (not a six-gate product board).
 * Light-phase component: ink on paper.
 */

const TONE_DOT: Record<WorkItemTone, string> = {
  open: 'bg-brand-500',
  hard: 'bg-[#C0564A]',
  yours: 'bg-gold',
}

function WorkRow({ item, index }: { item: WorkItem; index: number }) {
  const { ref, inView } = useInView<HTMLLIElement>(0.2)
  const reduced = usePrefersReducedMotion()
  const isYours = item.tone === 'yours'

  return (
    <li
      ref={ref}
      className={`border-t border-ink-900/10 py-8 first:border-t-0 sm:py-10 ${
        reduced
          ? ''
          : `transition-all duration-700 ease-out ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`
      }`}
      style={reduced ? undefined : { transitionDelay: `${index * 70}ms` }}
    >
      <div
        className={
          isYours
            ? 'border-l-2 border-gold pl-5 sm:pl-6'
            : 'pl-0'
        }
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-sm tabular-nums italic text-ink-500">
            {item.numeral}
          </span>
          <span className="flex items-center gap-2 font-display text-sm italic text-ink-500">
            <span
              aria-hidden
              className={`inline-block h-1.5 w-1.5 rounded-full ${TONE_DOT[item.tone]}`}
            />
            {item.toneLabel}
          </span>
        </div>

        <h3 className="mt-2 font-display text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">
          {item.title}
        </h3>

        <p className="mt-3 font-display text-base tabular-nums text-ink sm:text-lg">
          {item.stat}
        </p>

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
          {item.body}
        </p>

        {item.sea && (
          <p className="mt-4 max-w-2xl border-l-2 border-brand-400/70 pl-4 text-sm leading-relaxed text-ink-600 sm:text-base">
            <span className="font-display italic text-brand-600">Closer to home — </span>
            {item.sea}
          </p>
        )}
      </div>
    </li>
  )
}

export default function WorkBoard({ className }: { className?: string }) {
  return (
    <div className={className ?? ''}>
      <p className="max-w-2xl font-display text-lg italic text-ink-600 sm:text-xl">
        {ACT_5_COPY.workIntro}
      </p>
      <ol className="mt-2 border-b border-ink-900/10">
        {ACT_5_COPY.work.map((item, i) => (
          <WorkRow key={item.numeral} item={item} index={i} />
        ))}
      </ol>
    </div>
  )
}
