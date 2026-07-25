/**
 * The Long Sunrise — page script, v5 (clarity pass).
 * Single source of copy for /sunrise. Derived from docs/cinematic-vision-brief.html (v3).
 * Every figure here traces to the brief's §06 verified data inventory — do not
 * add numbers that aren't in the brief without re-verification.
 *
 * v5 rewrite rule: anyone can read it once and get the point. Short sentences.
 * No clever punchlines, no analyst slang, no AI-sounding turns of phrase.
 * Figures locked. Layout, film cels, charts, and act order unchanged.
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
    'From the first fire to cheap solar, home batteries, and the work still ahead. A clear, data-backed story of how humans get power. Every number sourced. Every prediction dated.',
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
  caption: 'a fire, anywhere on Earth · half a million years, one scene',
}
export const ACT_1_COPY = {
  open: 'It begins with a fire that dies if no one feeds it. For half a million years, that was all the power we had.',
  body: [
    'A human body uses about a hundred watts — roughly a bright light bulb. That was our limit: our own muscles, then animals, then wind and falling water. For hundreds of generations, that limit barely changed.',
    'How much energy you had shaped everything — how long you lived, what you could build, whether night belonged to you. Light was not a small comfort. Light was wealth.',
  ],
  numbers: [
    { value: '~100 W', label: 'power used by one human body', sub: 'about a bright light bulb', tone: 'gold' },
    { value: '~58 hours', label: 'of work to buy one hour of reading light', sub: 'at an early fire (Nordhaus)', tone: 'paper' },
    { value: '~350,000×', label: 'more light from one hour of work today', sub: 'than in ancient Babylon', tone: 'brand' },
  ] satisfies BigNumberItem[],
  sea: 'In Jakarta or Manila, grandparents still remember when light cost real money. An hour of light once took days of wages. Now it is so cheap it barely shows on the bill.',
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
  caption: 'the mill town — same scene, three continents, three centuries',
}
export const ACT_2_COPY = {
  open: 'Then we learned to burn old sunlight.',
  body: [
    'Coal, oil, and gas are sunlight that fell on plants long before people existed — buried underground, then burned a million times faster than it formed. In about two hundred years, energy use per person rose roughly ten times. The small fire became a furnace. The same picture appeared on three continents: smoke over the roofs, and under the smoke, people living better than anyone before them.',
    'The cost showed up in the air. Carbon dioxide is now 432 parts per million, and still rising. Even so, rich countries began to need less energy per person. In the United States the peak was 1979; use has fallen 15–20% since, while the economy doubled. What people wanted was never the fuel itself. It was cold food, a bright page, a heavy load moved. Getting more life from less fuel is progress too.',
  ],
  numbers: [
    { value: '~10×', label: 'more energy per person, in two centuries', tone: 'gold' },
    { value: '432 ppm', label: 'carbon dioxide in the air today', sub: 'still rising', tone: 'paper' },
    { value: '1979', label: 'US energy use per person peaked', sub: 'the economy has doubled since', tone: 'brand' },
  ] satisfies BigNumberItem[],
  sea: 'Southeast Asia is still on this climb. Coal makes 47% of its electricity, up from 37% in 2015. Here, this chapter is not the past. It is happening now.',
  servants:
    'Your body still uses about a hundred watts. Now add the power plants, cars, heaters, factories, and grids that work for the average person. All together, it is as if about 25 people were laboring full-time, day and night, just for you.',
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
  caption: 'Vietnam, 2020 · a solar boom that stopped overnight',
}
export const INTERLUDE_COPY = {
  open: '“Too cheap to meter,” they said of nuclear power in 1954.',
  body: [
    'It did not work out that way. The more nuclear plants the world built, the more each one cost — about three times higher as more were built (Grubler, 2010). The cost of sending a kilogram into space stayed flat for forty years. Concorde was sold as the future of flight. It ended in a museum.',
    'A closer heartbreak: Vietnam in 2020. In one year the country added about 9 GW of rooftop solar — among the fastest build-outs anywhere. Then the payment that rewarded solar power ended. The boom stopped almost overnight. Panels sat underused. Installers lost their work.',
    'Hold onto this when the next chapters feel certain. Fast growth is not a guarantee. Things we stamp out in factories, again and again, tend to get cheaper. Huge one-of-a-kind projects, built on site under thick rules, often do not. Nothing later in this story happens by itself.',
  ],
  curvesNote: 'Sources in the story above — Grubler 2010 on nuclear costs; launch flat 1970–2010; solar and battery learning rates as labeled.',
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
  caption: 'morning light on a solar field · change you can measure',
}
/** Mid-act, at the storage beat — grid-scale packs restoring the noon watt. */
export const ACT_3_STORAGE_CEL: FilmCelMeta = {
  asset: 'megablock',
  caption: 'grid batteries at sunset · storing cheap noon for the evening',
}
export const ACT_3_COPY = {
  open: 'First light. From here, we stop guessing. We measure.',
  body: [
    'A solar panel cost $76 per watt in 1977. In 2025 it costs about nine cents. A battery pack cost $7,500 per kilowatt-hour in 1991. By late 2025 the pack price was $108 (BNEF) — and the cheapest packs near $50. At those prices a roof is not only shelter. It can make electricity.',
    'In 2025 the world added 647 GW of solar. The new electricity that came with it was the largest one-year jump from any power source in history. For the first time, wind and solar together made more of the world’s electricity than coal.',
    'Here is the hard truth — and why batteries matter. When midday solar is very cheap and very common, the grid can have more power than it needs at noon. Prices fall. Sometimes power is almost worthless for an hour. Batteries solve that. They store the cheap midday power and use it after dark. That is why large grid batteries added about 300 GWh in 2025 — up 51% in one year — from home wall units to huge battery farms on every continent.',
    'China installed 93 GW of solar in a single month of 2025 — about a hundred panels every second. In Pakistan, families and shops imported more than 27 GW of panels on their own, about half the country’s peak demand, with no national plan. When power costs nine cents a watt, people do not wait for permission.',
  ],
  /** Pulled out of the body as the act’s giant-type moment. */
  pull: 'The first terawatt of solar took about 68 years. The third took about 1.3 years.',
  numbers: [
    { value: '$76 → $0.09', label: 'price per watt of solar panel, 1977 → 2025', tone: 'gold' },
    { value: '647 GW', label: 'solar added worldwide in 2025', sub: 'largest yearly jump in power ever recorded', tone: 'gold' },
    { value: '$108/kWh', label: 'battery pack price, Dec 2025', sub: 'down from $7,500 in 1991 (BNEF)', tone: 'brand' },
    { value: '+300 GWh', label: 'grid batteries added in 2025', sub: '+51% from the year before', tone: 'brand' },
  ] satisfies BigNumberItem[],
  sea: 'The stakes are highest here. Southeast Asia’s electricity use grows about 7% a year. Solar and wind still supply only about 4.5% of it — but that share is growing about 35% a year. Jakarta’s sun stays strong all year; Hamburg loses most of it in winter. About four billion people live under strong sun. They will need more power first. That is why battery.mom starts here.',
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
  caption: 'inside a battery factory · where cheaper power is made',
}
/** Mid-act, where the copy leaves the ground. */
export const ACT_4_ORBIT_CEL: FilmCelMeta = {
  asset: 'orbit',
  caption: 'the story leaves Earth · real hardware, not a movie still',
}
export const ACT_4_COPY = {
  open: 'Cheap energy runs more computers. More computers train smarter software. Smarter software helps design better machines — including machines that make energy cheaper. That loop is real. What follows marks fact and hope clearly.',
  body: [
    'What we can measure: data centers used about 485 TWh of electricity in 2025, and may reach about 950 TWh by 2030. Big technology companies spent more than $400 billion in 2025 — more than the world spent finding and drilling oil and gas. Building computers and AI now outspends the hunt for new fossil fuel. Power and chips pull each other: chips need power; power investment follows the chips.',
    'What is still hard: clever software is not the same as clever hands. Battery and car factory lines are highly automated. Most building sites still run on people with tools. Machines learned to write and calculate before they learned to work well in dust, rain, and half-finished rooms.',
    'The loop has already left the ground. In orbit, a solar panel can collect five to eight times more energy than a typical panel on Earth. Collect — not send home. A satellite can only get rid of heat by radiating it into space, which is slow. NASA’s 2024 study found that beaming space solar down to Earth would cost 12 to 80 times more than making power on the ground. So the near-term idea is simple: use that power in space.',
    'We will use far more energy than we do today. That is not an accident. That is the goal. When energy is abundant, it stops being the hard limit on what we can attempt. It does not mean energy is free.',
  ],
  numbers: [
    { value: '485 → ~950 TWh', label: 'electricity used by data centers, 2025 → 2030', tone: 'brand' },
    { value: '>$400B', label: 'Big Tech spending, 2025', sub: 'more than global oil & gas drilling', tone: 'paper' },
    { value: '$55,000 → $100–200', label: 'cost to launch 1 kg: Shuttle → Starship goal', sub: 'Falcon 9 today: about $2,700', tone: 'gold' },
  ] satisfies BigNumberItem[],
  receipts: [
    { date: 'Nov 2025', event: 'Starcloud-1 flies the first NVIDIA H100 computer chip to orbit.' },
    { date: 'Dec 2025', event: 'The first language model is trained in space.' },
    { date: 'Filed', event: 'SpaceX asks permission for a network of data-center satellites.' },
    { date: 'Early 2027', event: 'Google’s Project Suncatcher plans to launch test AI chips with Planet.' },
  ],
  receiptsNote: 'The future often starts as a short list of things that already happened.',
}

// ── Coda ─────────────────────────────────────────────────────────────
export const CODA: ActMeta = {
  numeral: '',
  title: 'The Swarm — A Dream at the Edge of Dawn',
  era: 'undated, by design',
  hearth: 'a dream — clearly labeled as one',
}
export const CODA_CEL: FilmCelMeta = {
  asset: 'swarm',
  caption: 'collectors gathering around a star · a dream, labeled as one',
}
export const CODA_COPY = {
  open: 'Before morning, one last look up. What follows is a dream — and we label it as one.',
  body: [
    'If machines ever build more machines in space — and none of that exists yet — solar collectors could slowly gather around the sun over centuries. Daylight becomes something people build, not only something they wait for. A full ring of collectors around the star. About twenty trillion times the power we use today.',
    'We put no year on this. It depends on ideas we have not proven. Physics still draws a ceiling, and it is worth seeing once:',
  ],
  line: 'One hour of sunlight on Earth ≈ one year of civilization’s energy use.',
}

// ── Act V ────────────────────────────────────────────────────────────
export const ACT_5: ActMeta = {
  numeral: 'V',
  title: 'Morning',
  era: '2026 → 2040 · full daylight',
  hearth: 'your own roof, the meter running backwards',
}
export const ACT_5_CEL: FilmCelMeta = {
  asset: 'morning',
  caption: 'morning, everywhere · the meter running backwards',
}

export type WorkItemTone = 'open' | 'hard' | 'yours'

export interface WorkItem {
  numeral: string
  title: string
  tone: WorkItemTone
  toneLabel: string
  stat: string
  body: string
  sea?: string
}

export const ACT_5_COPY = {
  /** After “Then, morning.” — ordinary light before any homework. */
  morning: [
    'The light outside is ordinary. Coffee. A bill on the table. A room that stayed bright all night without anyone feeding a fire.',
    'Nothing in the story you just read is owed to us. Cheap solar and batteries are real. Whether they reach your street is still work — mostly human, mostly local.',
  ],
  workIntro: 'Three things still matter more than the next invention.',
  work: [
    {
      numeral: '01',
      title: 'Factories can already build',
      tone: 'open',
      toneLabel: 'Moving',
      stat: '1.59 TWh of batteries made · factories built for more than 4 TWh',
      body: 'The world can produce more cells than it currently buys. The open question is not “can we make them?” It is getting them into cars, homes, and power systems.',
    },
    {
      numeral: '02',
      title: 'Wires and paperwork lag behind',
      tone: 'hard',
      toneLabel: 'Stuck',
      stat: 'About 2.3 TW of projects waiting · often more than four years in line',
      body: 'A finished solar farm still needs a free wire and a signature. Queues and permits now slow more projects than the cost of the panels themselves.',
      sea: 'Southeast Asia is only starting to link national grids. In Vietnam, some built solar still cannot run full when the network is full.',
    },
    {
      numeral: '03',
      title: 'The hard part is on the roof',
      tone: 'yours',
      toneLabel: 'Yours',
      stat: 'Same panels: about $2.80 per watt in the US · about $1 in Australia',
      body: 'Loans, installers, local rules, and sudden policy changes decide the real price. Same hardware, very different bills. This is the work a household can touch — and why this site exists.',
      sea: 'Vietnam’s 2020 boom stopped when the solar subsidy ended overnight. Policy, not panels.',
    },
  ] satisfies WorkItem[],
  toolsIntro: 'Start with a real bill, a real car, or a real battery.',
  cards: [
    { href: '/calculators', title: 'Home planner', sub: 'Size solar and storage for your bill.' },
    { href: '/ev', title: 'EV desk', sub: 'Every electric car sold in Southeast Asia.' },
    { href: '/bess', title: 'Battery desk', sub: 'Home batteries, with specs and prices.' },
  ],
  trustIntro:
    'We also put dates on our bets — nine of them, including some that bet against our own coolest ideas. If we are wrong, the wrong call stays on the page.',
  closing: 'The story ends where it started: a fire someone tends. Yours happens to be a rooftop.',
}
