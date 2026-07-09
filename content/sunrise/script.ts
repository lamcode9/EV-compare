/**
 * The Long Sunrise — page script, v1.
 * Single source of copy for /sunrise. Derived from docs/cinematic-vision-brief.html (v3).
 * Every figure here traces to the brief's §06 verified data inventory — do not
 * add numbers that aren't in the brief without re-verification.
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
export const ACT_1_COPY = {
  open: 'A single hearth gutters in the dark — the one image every ancestor of every person reading this shares, on every continent.',
  body: [
    'For half a million years, energy was a body — about a hundred watts — plus a fire that died if you stopped feeding it. Muscle, then animals, then wind and falling water. The ladder barely moved.',
    'Energy was the ceiling on everything: how long you lived, what you could make, whether the night belonged to you at all.',
  ],
  numbers: [
    { value: '~100 W', label: 'the human body’s power', sub: 'the original hearth', tone: 'gold' },
    { value: '~58 hours', label: 'of labor for one hour of reading light', sub: 'at a Paleolithic fire (Nordhaus)', tone: 'paper' },
    { value: '~350,000×', label: 'more light per hour of labor today', sub: 'than in Babylon', tone: 'brand' },
  ] satisfies BigNumberItem[],
  sea: 'Price the same collapse in a Jakarta or Manila minimum wage and the story is identical — light went from a luxury measured in workdays to a rounding error on the bill.',
  ember: 'Fire needed tending. That was the deal for half a million years.',
}

// ── Act II ───────────────────────────────────────────────────────────
export const ACT_2: ActMeta = {
  numeral: 'II',
  title: 'Combustion — Borrowed Sunlight',
  era: '1700 → 2010 · K 0.4 → 0.72',
  hearth: 'the mill towns — Manchester 1850, Pittsburgh 1920, Shenzhen 1995',
}
export const ACT_2_COPY = {
  open: 'Then the hockey stick. Coal, oil, gas — ancient sunlight, fossilized, burned a million times faster than it formed.',
  body: [
    'Energy per person jumped roughly tenfold in two centuries. The hearth became a furnace, and the same mill-town scene repeated across three continents and three centuries. Smog was the price of the first ascent.',
    'Carbon dioxide climbed the same staircase — 432 parts per million and rising. And the frontier economies began to decouple: US energy use per person peaked in 1979 and has drifted down 15–20% since, while the economy doubled. Watts were never the whole story. Energy services are, and efficiency is abundance too.',
  ],
  numbers: [
    { value: '~10×', label: 'energy per person, in two centuries', tone: 'gold' },
    { value: '432 ppm', label: 'atmospheric CO₂ today', sub: 'climbing the same staircase', tone: 'paper' },
    { value: '1979', label: 'the year US per-capita energy peaked', sub: 'GDP has doubled since', tone: 'brand' },
  ] satisfies BigNumberItem[],
  sea: 'Southeast Asia is climbing this exact staircase right now: coal generates 47% of its electricity, up from 37% in 2015. This is not history here. It is the present tense.',
  servants: 'Your body runs at about 100 watts. Count the machines burning on your behalf right now and the average person commands roughly 25 invisible, full-time human-equivalents of power.',
}

// ── Interlude ────────────────────────────────────────────────────────
export const INTERLUDE: ActMeta = {
  numeral: '',
  title: 'The False Dawn',
  era: '1954 → 2021 · the doubt beat',
  hearth: 'three broken promises, then one close to home',
}
export const INTERLUDE_COPY = {
  open: '“Too cheap to meter,” they said in 1954.',
  body: [
    'Nuclear power then delivered the opposite of a learning curve — costs roughly tripled as it deployed (Grubler, 2010). The cost of reaching orbit stagnated for forty years. Concorde, the future of flight, went to zero.',
    'And closest to home: Vietnam, 2020 — around 9 GW of rooftop solar in a single year, one of the fastest booms anywhere, ever. Then the feed-in tariff expired, and installations collapsed. Panels curtailed. Installers stranded.',
    'Exponentials are not destiny. Modular, factory-made, fast-iterating things learn; site-built, regulated megaprojects mostly don’t. None of what follows happens by default.',
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
export const ACT_3_COPY = {
  open: 'First light. From here, the page only brightens — because from here, the record is measured, not promised.',
  body: [
    'Solar modules fell from $76 a watt in 1977 to about nine cents in 2025. Battery packs fell from $7,500 per kWh in 1991 to $108 (BNEF, Dec 2025) — cells at $74, the cheapest LFP near $50. In 2025 the world added 647 GW of solar; its extra 636 TWh was the largest one-year increase in generation by any power source in history, and renewables passed coal in the world mix for the first time.',
    'Then the home truth this site exists for: cheap midday solar cannibalizes its own price. Capture rates fall; negative-price hours multiply. Storage is what restores the value — which is why grid batteries added ~300 GWh in 2025, up 51% in a year, and why the deployment ladder is filling on every continent: cell, wall pack, tower block, factory, and the 19 GWh farms.',
    'China installed 93 GW of solar in a single month of 2025 — roughly a hundred panels a second. Pakistan showed what nine-cent watts do bottom-up: households imported 27+ GW of panels, about half the country’s peak demand, with no central plan at all.',
  ],
  /** Pulled out of the body as the act’s giant-type moment. */
  pull: 'The first terawatt of solar took about 68 years. The third took about 1.3.',
  numbers: [
    { value: '$76 → $0.09', label: 'per watt of solar module, 1977 → 2025', tone: 'gold' },
    { value: '647 GW', label: 'solar added worldwide in 2025', sub: 'largest generation jump ever recorded', tone: 'gold' },
    { value: '$108/kWh', label: 'battery pack price, Dec 2025', sub: 'from $7,500 in 1991 (BNEF)', tone: 'brand' },
    { value: '+300 GWh', label: 'grid batteries added in 2025', sub: '+51% year on year', tone: 'brand' },
  ] satisfies BigNumberItem[],
  sea: 'Closer to home the stakes run highest: Southeast Asian electricity demand grows ~7% a year while solar and wind supply only ~4.5% of it — but that share is climbing ~35% a year. And the sunbelt has the geometry: Jakarta’s solar output is nearly flat all year while Hamburg falls off a winter cliff. The 4 billion people of the sunbelt electrify first. That is why battery.mom starts here.',
}

// ── Act IV ───────────────────────────────────────────────────────────
export const ACT_4: ActMeta = {
  numeral: 'IV',
  title: 'The Compounding Century — Energy, Intelligence, Orbit',
  era: '2025 → 2050 · K 0.75 → 0.85',
  hearth: 'a gigafactory floor, then a satellite bus',
}
export const ACT_4_COPY = {
  open: 'Cheap energy buys compute. Compute buys intelligence. Intelligence, increasingly, builds the machines that make energy cheaper. The loop is real — but its edges deserve honest line-weights.',
  body: [
    'Solid where measured: datacenters used ~485 TWh in 2025, heading toward ~950 TWh by 2030, and Big Tech capital spending passed $400 billion in 2025 — more than the world invests in finding and drilling oil and gas. Energy now gates where and how fast compute grows; chips gate how much.',
    'Dashed where early: AI to robots to construction. Moravec’s paradox is undefeated — gigafactory lines are automated; building sites mostly aren’t yet.',
    'And the loop has already left the ground — not as a render, as a manifest. In orbit a panel collects 5–8× more energy than typical ground sites. Collected, not delivered: heat can only leave a satellite by radiation (~300 W/m² is realistic), and NASA’s own 2024 assessment put beam-to-ground space solar at 12–80× terrestrial cost. The near-term case is using the power up there.',
    'We will use vastly more energy than today — that is the point. Abundance means energy stops being the limiting input, not that it stops costing money.',
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
export const CODA_COPY = {
  open: 'One dark-sky moment after dawn begins — explicitly a dream.',
  body: [
    'If self-replicating manufacturing ever works — and no element of it exists yet — exponentials do the rest: collectors thickening around the sun over centuries. Kardashev II. Twenty trillion times today’s power.',
    'No date is attached to this, ever. The conclusion is driven entirely by its assumptions. But the ceiling physics offers is worth seeing once:',
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
export const ACT_5_COPY = {
  open: 'None of it is owed to us. Between here and that future stand six gates — and every one of them is a job, not a prophecy.',
  closing: 'The story ends where it started: a hearth, tended. Yours happens to be a rooftop.',
  tagline: 'The swarm starts on a rooftop. Start with yours.',
  cards: [
    { href: '/calculators', title: 'The home planner', sub: 'Size solar + storage for a real bill.' },
    { href: '/ev', title: 'The EV desk', sub: 'Compare every EV sold in Southeast Asia.' },
    { href: '/bess', title: 'The BESS desk', sub: 'Home batteries, specced and priced.' },
  ],
}
