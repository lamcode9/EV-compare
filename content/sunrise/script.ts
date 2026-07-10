/**
 * The Long Sunrise — page script, v3.
 * Single source of copy for /sunrise. Derived from docs/cinematic-vision-brief.html (v3).
 * Every figure here traces to the brief's §06 verified data inventory — do not
 * add numbers that aren't in the brief without re-verification.
 *
 * v3 rewrite rule: rhythm, verbs, and motif callbacks (hearth → furnace →
 * rooftop → swarm) may change; the figures may not. No new numbers.
 *
 * Anchoring rule (KM): humanity/global scale is the protagonist; the "hearth"
 * is one human-scale vignette per act, each on a different continent;
 * Southeast Asia appears only as recurring "closer to home" insets.
 */

export interface BigNumberItem {
  value: string
  label: string
  sub?: string
  tone?: 'gold' | 'brand' | 'paper'
}

export interface ActMeta {
  numeral: string
  title: string
  era: string
  hearth: string
}

/** A loop-video establishing shot. Renders only once the asset exists. */
export interface FilmCelMeta {
  /** Basename under /public/sunrise/ — e.g. 'fire' → fire.mp4 (+ fire.jpg poster). */
  asset: string
  caption: string
}

export const PAGE_META = {
  title: 'The Long Sunrise — half a million years of energy, and the century that changes it',
  description:
    'A cinematic, data-driven story of humanity and power: from the first tended fire to terawatt solar, grid batteries, orbital compute, and the work still between us and morning. Every number sourced, every prediction dated.',
}

// ── Act I ────────────────────────────────────────────────────────────
export const ACT_1: ActMeta = {
  numeral: 'I',
  title: 'Fire — Half a Million Years of Tending',
  era: '500,000 BCE → 1900 · K ≈ 0.4',
  hearth: 'a fire pit, anywhere on Earth',
}
export const ACT_1_CEL: FilmCelMeta = {
  asset: 'fire',
  caption: 'a hearth, anywhere on Earth · 500,000 years, one scene',
}
export const ACT_1_COPY = {
  open: 'It begins with a fire that dies if no one feeds it. For half a million years, that was the whole grid.',
  body: [
    'A human body runs at about a hundred watts. That was the budget — muscle, then animals, then wind and falling water — and a hundred generations could pass without the ceiling moving an inch.',
    'Energy was the ceiling on everything: how long you lived, what you could make, whether the night belonged to you at all. Light was not an amenity. Light was wealth.',
  ],
  numbers: [
    { value: '~100 W', label: 'the human body’s power', sub: 'the original hearth', tone: 'gold' },
    { value: '~58 hours', label: 'of labor for one hour of reading light', sub: 'at a Paleolithic fire (Nordhaus)', tone: 'paper' },
    { value: '~350,000×', label: 'more light per hour of labor today', sub: 'than in Babylon', tone: 'brand' },
  ] satisfies BigNumberItem[],
  sea: 'Price that same hour of light in a Jakarta or Manila minimum wage and the story repeats: within living memory, light fell from a luxury priced in workdays to a rounding error on the bill.',
  ember: 'Fire needed tending. That was the deal for half a million years.',
}

// ── Act II ───────────────────────────────────────────────────────────
export const ACT_2: ActMeta = {
  numeral: 'II',
  title: 'Combustion — Borrowed Sunlight',
  era: '1700 → 2010 · K 0.4 → 0.72',
  hearth: 'the mill towns — Manchester 1850, Pittsburgh 1920, Shenzhen 1995',
}
export const ACT_2_CEL: FilmCelMeta = {
  asset: 'combustion',
  caption: 'the mill town — the same scene, three continents, three centuries',
}
export const ACT_2_COPY = {
  open: 'Then the hockey stick.',
  body: [
    'Coal, oil, gas — sunlight that fell on ferns before there were flowers, fossilized, and burned a million times faster than it formed. Energy per person jumped roughly tenfold in two centuries. The hearth became a furnace, and the same scene was shot on three continents: smoke over the rooftops, and under the smoke, people growing richer than anyone had ever been.',
    'The bill arrived as carbon — 432 parts per million and climbing the same staircase. But the frontier told a stranger story: US energy use per person peaked in 1979 and has drifted down 15–20% since, while the economy doubled. Watts were never the point. The services are — the cold food, the lit page, the moved ton. Efficiency is abundance too.',
  ],
  numbers: [
    { value: '~10×', label: 'energy per person, in two centuries', tone: 'gold' },
    { value: '432 ppm', label: 'atmospheric CO₂ today', sub: 'climbing the same staircase', tone: 'paper' },
    { value: '1979', label: 'the year US per-capita energy peaked', sub: 'GDP has doubled since', tone: 'brand' },
  ] satisfies BigNumberItem[],
  sea: 'Southeast Asia is on this staircase right now: coal generates 47% of its electricity, up from 37% in 2015. Here, this act is not history. It is the present tense.',
  servants: 'Your body still runs at about a hundred watts. But count everything burning on your behalf right now — the average person commands roughly 25 invisible, full-time human-equivalents of power. You have a staff.',
}

// ── Interlude ────────────────────────────────────────────────────────
export const INTERLUDE: ActMeta = {
  numeral: '',
  title: 'The False Dawn',
  era: '1954 → 2021 · the doubt beat',
  hearth: 'three broken promises, then one close to home',
}
export const INTERLUDE_CEL: FilmCelMeta = {
  asset: 'false-dawn',
  caption: 'Vietnam, 2020 · the boom that stopped like a switch',
}
export const INTERLUDE_COPY = {
  open: '“Too cheap to meter,” they said in 1954.',
  body: [
    'Nuclear then delivered the opposite of a learning curve: the more the world built, the more it cost — roughly tripling as it deployed (Grubler, 2010). The price of reaching orbit froze for forty years. And Concorde — the future of flight, the actual future — flew backwards into a museum.',
    'The nearest heartbreak is ours. Vietnam, 2020: around 9 GW of rooftop solar in a single year, one of the fastest booms recorded anywhere. Then the feed-in tariff lapsed — and the boom stopped as if a switch had been thrown. Panels curtailed. Installers stranded.',
    'Hold this act in mind when the next ones feel inevitable. Exponentials are not destiny. Modular, factory-made, fast-iterating things learn their way down the cost curve; site-built, regulated megaprojects mostly don’t. None of what follows happens by default.',
  ],
  curvesNote: 'Curves that held: solar PV (−20.2% per doubling), lithium-ion (−18–19%), LEDs. Curves that broke: nuclear (costs ~3× up with deployment), launch (flat 1970–2010), Concorde (to zero).',
}

// ── Act III ──────────────────────────────────────────────────────────
export const ACT_3: ActMeta = {
  numeral: 'III',
  title: 'The Sun, Direct — The Measured Revolution',
  era: '2010 → 2035 · K 0.72 → 0.75',
  hearth: 'rooftops, everywhere at once',
}
export const ACT_3_CEL: FilmCelMeta = {
  asset: 'first-light',
  caption: 'first light on the panel field · the revolution you can audit',
}
/** Mid-act, at the storage beat — grid-scale packs restoring the noon watt. */
export const ACT_3_STORAGE_CEL: FilmCelMeta = {
  asset: 'megablock',
  caption: 'grid storage at golden hour · what restores the noon watt',
}
export const ACT_3_COPY = {
  open: 'First light — and a change in the rules of evidence. From here on, nothing in this story is promised. It is measured.',
  body: [
    'A solar module cost $76 a watt in 1977. It costs about nine cents in 2025. A battery pack cost $7,500 per kWh in 1991; BNEF’s December 2025 read is $108, with cells at $74 and the cheapest LFP near $50. Prices like that stop being economics and start changing what a roof is for.',
    'In 2025 the world added 647 GW of solar, and the 636 TWh of new generation that came with it was the largest one-year increase by any power source in history. Renewables passed coal in the world’s electricity mix for the first time.',
    'Then the home truth this site exists for: cheap midday solar eats its own lunch. The more of it on a grid, the less each noon watt earns — capture rates fall, negative-price hours multiply. Storage is what restores the value. That is why grid batteries added ~300 GWh in 2025, up 51% in a year, and why the ladder is filling on every continent: cell, wall pack, tower block, factory floor, and the 19 GWh farms.',
    'China installed 93 GW of solar in a single month of 2025 — roughly a hundred panels a second. Pakistan ran the bottom-up experiment: households imported 27+ GW of panels, about half the country’s peak demand, with no central plan at all. Nine-cent watts don’t wait for permission.',
  ],
  /** Pulled out of the body as the act’s giant-type moment. */
  pull: 'The first terawatt of solar took about 68 years. The third took about 1.3.',
  numbers: [
    { value: '$76 → $0.09', label: 'per watt of solar module, 1977 → 2025', tone: 'gold' },
    { value: '647 GW', label: 'solar added worldwide in 2025', sub: 'largest generation jump ever recorded', tone: 'gold' },
    { value: '$108/kWh', label: 'battery pack price, Dec 2025', sub: 'from $7,500 in 1991 (BNEF)', tone: 'brand' },
    { value: '+300 GWh', label: 'grid batteries added in 2025', sub: '+51% year on year', tone: 'brand' },
  ] satisfies BigNumberItem[],
  sea: 'the stakes run highest. Southeast Asian electricity demand grows ~7% a year, and solar and wind supply only ~4.5% of it — but that share is compounding ~35% a year. The sunbelt has the geometry: Jakarta’s solar output holds nearly flat all year while Hamburg falls off a winter cliff. Four billion people live under the good sun. They electrify first — and that is why battery.mom starts here.',
}

// ── Act IV ───────────────────────────────────────────────────────────
export const ACT_4: ActMeta = {
  numeral: 'IV',
  title: 'The Compounding Century — Energy, Intelligence, Orbit',
  era: '2025 → 2050 · K 0.75 → 0.85',
  hearth: 'a gigafactory floor, then a satellite bus',
}
/** Leads the act — the hearth is "a gigafactory floor, then a satellite bus". */
export const ACT_4_CEL: FilmCelMeta = {
  asset: 'gigafactory',
  caption: 'the gigafactory floor · where the curve is manufactured',
}
/** Mid-act, where the copy leaves the ground. */
export const ACT_4_ORBIT_CEL: FilmCelMeta = {
  asset: 'orbit',
  caption: 'the loop leaves the ground · not a render — a manifest',
}
export const ACT_4_COPY = {
  open: 'Cheap energy buys compute. Compute buys intelligence. Intelligence designs the machines that make energy cheaper. The loop is real — drawn here with honest line-weights: solid where measured, dashed where hoped.',
  body: [
    'Solid: datacenters drew ~485 TWh in 2025, heading toward ~950 TWh by 2030, and Big Tech capital spending passed $400 billion in 2025 — more than the world invests in finding and drilling oil and gas. The intelligence buildout now outspends the fossil frontier. Energy gates where compute grows; chips gate how much.',
    'Dashed: intelligence walks into the physical world slowly. Moravec’s paradox is undefeated — the gigafactory line is automated; the building site, mostly, still isn’t.',
    'And the loop has already left the ground — not as a render, as a manifest. In orbit a panel collects 5–8× more energy than typical ground sites. Collects, not delivers: heat can only leave a satellite by radiation (~300 W/m² is realistic), and NASA’s own 2024 assessment put beam-to-ground space solar at 12–80× terrestrial cost. So the near-term case is blunt — use the power up there.',
    'Say the quiet part plainly: we will use vastly more energy than today. That is the point. Abundance means energy stops being the limiting input on what we can attempt — not that it stops costing money.',
  ],
  numbers: [
    { value: '485 → ~950 TWh', label: 'datacenter electricity, 2025 → 2030', tone: 'brand' },
    { value: '>$400B', label: 'Big Tech capex, 2025', sub: 'now above global oil & gas upstream', tone: 'paper' },
    { value: '$55,000 → $100–200', label: 'launch cost per kg: Shuttle → Starship target', sub: 'Falcon 9 today: ~$2,700', tone: 'gold' },
  ] satisfies BigNumberItem[],
  receipts: [
    { date: 'Nov 2025', event: 'Starcloud-1 puts the first NVIDIA H100 in orbit.' },
    { date: 'Dec 2025', event: 'The first language model is trained in space.' },
    { date: 'Filed', event: 'SpaceX seeks approval for an orbital-datacenter constellation.' },
    { date: 'Early 2027', event: 'Google’s Project Suncatcher launches prototype TPU satellites with Planet.' },
  ],
  receiptsNote: 'The future begins as a list of things that already happened.',
}

// ── Coda ─────────────────────────────────────────────────────────────
export const CODA: ActMeta = {
  numeral: '',
  title: 'The Swarm — A Dream at the Edge of Dawn',
  era: 'undated, by design',
  hearth: 'informed speculation — clearly watermarked',
}
export const CODA_CEL: FilmCelMeta = {
  asset: 'swarm',
  caption: 'collectors thickening around a star · a dream, watermarked as one',
}
export const CODA_COPY = {
  open: 'Before morning, one last look up. What follows is a dream — and it is watermarked as one.',
  body: [
    'If self-replicating manufacturing ever works — and no element of it exists yet — the exponential does the rest: collectors thickening around the sun over centuries, until noon is something you build. Kardashev II. Twenty trillion times the power we command today.',
    'No date will ever be attached to this. The conclusion is contained entirely in its assumptions, and the assumptions are unproven. But physics keeps a ceiling, and it is worth seeing once:',
  ],
  line: 'One hour of sunlight on Earth ≈ one year of civilization’s energy use.',
}

// ── Act V ────────────────────────────────────────────────────────────
export const ACT_5: ActMeta = {
  numeral: 'V',
  title: 'The Work — Morning, Everywhere',
  era: '2026 → 2040 · full daylight',
  hearth: 'the visitor’s own rooftop, the meter running backwards',
}
export const ACT_5_CEL: FilmCelMeta = {
  asset: 'morning',
  caption: 'morning, everywhere · the meter running backwards',
}
export const ACT_5_COPY = {
  open: 'None of it is owed to us. Between here and that morning stand six gates — permits, interconnects, factory lines — and every one of them is a job, not a prophecy.',
  closing: 'The story ends where it started: a hearth, tended. Yours happens to be a rooftop.',
  tagline: 'The swarm starts on a rooftop. Start with yours.',
  cards: [
    { href: '/calculators', title: 'The home planner', sub: 'Size solar + storage for a real bill.' },
    { href: '/ev', title: 'The EV desk', sub: 'Compare every EV sold in Southeast Asia.' },
    { href: '/bess', title: 'The BESS desk', sub: 'Home batteries, specced and priced.' },
  ],
}
