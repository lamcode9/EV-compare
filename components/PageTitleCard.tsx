interface PageTitleCardProps {
  /** Italic serif era line, e.g. "Calculators · your number" */
  eyebrow: string
  title: string
  sub?: string
  className?: string
}

/**
 * "Title-card lite" page header for major data pages — the /sunrise ActHeader
 * typography (hairline gold rule, italic serif era line, Newsreader title)
 * without its scroll choreography. Left-aligned; no boxes, no pills.
 */
export default function PageTitleCard({ eyebrow, title, sub, className = '' }: PageTitleCardProps) {
  return (
    <header className={className}>
      <div className="flex items-center gap-4">
        <span aria-hidden className="h-px w-12 bg-gold/60" />
        <span className="font-display text-sm italic text-ink-500">{eyebrow}</span>
      </div>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        {title}
      </h1>
      {sub && <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-500">{sub}</p>}
    </header>
  )
}
