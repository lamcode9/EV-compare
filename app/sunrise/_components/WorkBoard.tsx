'use client'

import type { WorkItem } from '@/content/sunrise/script'
import { ACT_5_COPY } from '@/content/sunrise/script'
import { Reveal } from './narrative'

/**
 * Act V constraints — plain ruled list. No status dots, no numbered framework.
 */

function WorkRow({ item }: { item: WorkItem }) {
  return (
    <Reveal>
      <div className="border-t border-ink-900/10 py-6 sm:py-7">
        <h3 className="font-display text-xl font-medium text-ink sm:text-2xl">{item.title}</h3>
        <p className="mt-2 text-base tabular-nums text-ink sm:text-lg">{item.stat}</p>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">{item.body}</p>
      </div>
    </Reveal>
  )
}

export default function WorkBoard({ className }: { className?: string }) {
  return (
    <div className={`max-w-2xl border-b border-ink-900/10 ${className ?? ''}`}>
      {ACT_5_COPY.work.map((item) => (
        <WorkRow key={item.title} item={item} />
      ))}
    </div>
  )
}
