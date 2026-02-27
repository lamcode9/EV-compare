/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CENTRALIZED RATE DATA — battery.mom
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  🔑  SINGLE SOURCE OF TRUTH for all country-level rates, tariffs, costs,
 *      and economic constants used across the entire application.
 *
 *  ⚠️  UPDATE SCHEDULE:
 *      - Electricity tariffs:  Every quarter (Jan, Apr, Jul, Oct)
 *      - Petrol prices:        Monthly
 *      - Solar costs:          Every 6 months
 *      - Carbon/USD rates:     Every quarter
 *      - EV incentives:        On policy change
 *
 *  📋  HOW TO UPDATE:
 *      1. Update values in this file
 *      2. Update the `lastVerified` date in the DATA_PROVENANCE object
 *      3. Run `npm run dev` and verify calculators show new values
 *      4. All 20+ consuming components auto-update from here
 *
 *  📖  See data/DATA-MAINTENANCE.md for the full maintenance guide.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { Country } from '@prisma/client'

// ─────────────────────────────────────────────────────────────────────────────
// TYPE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** String-indexable map that also auto-completes on Country keys */
type CountryMap<V> = Record<Country, V> & Record<string, V | undefined>

// ─────────────────────────────────────────────────────────────────────────────
// DATA PROVENANCE — Citations & Sources
// ─────────────────────────────────────────────────────────────────────────────

export interface DataSource {
  name: string
  url?: string
  retrievedDate: string        // ISO date when data was last pulled
  notes?: string
}

export interface ProvenanceEntry {
  description: string
  lastVerified: string         // ISO date of last human verification
  updateFrequency: string      // e.g. "quarterly", "monthly"
  sources: DataSource[]
}

/**
 * Complete provenance metadata for every rate category.
 * Displayed in component footers and the About page.
 */
export const DATA_PROVENANCE: Record<string, ProvenanceEntry> = {
  electricityResidential: {
    description: 'Residential electricity tariffs (local currency per kWh)',
    lastVerified: '2025-12-01',
    updateFrequency: 'Quarterly',
    sources: [
      { name: 'Suruhanjaya Tenaga (ST), Malaysia', url: 'https://www.st.gov.my', retrievedDate: '2025-12-01', notes: 'Tariff A (domestic) block 1-200 kWh' },
      { name: 'Energy Market Authority (EMA), Singapore', url: 'https://www.ema.gov.sg/electricity-tariffs', retrievedDate: '2025-12-01', notes: 'Q4 2025 regulated tariff' },
      { name: 'PLN, Indonesia', url: 'https://web.pln.co.id', retrievedDate: '2025-12-01', notes: 'R-1/TR 2200VA tariff' },
      { name: 'Metropolitan Electricity Authority (MEA), Thailand', url: 'https://www.mea.or.th', retrievedDate: '2025-12-01', notes: 'Normal residential rate' },
      { name: 'EVN, Vietnam', url: 'https://www.evn.com.vn', retrievedDate: '2025-12-01', notes: 'Tier 1 progressive tariff' },
      { name: 'Meralco, Philippines', url: 'https://www.meralco.com.ph', retrievedDate: '2025-12-01', notes: 'Residential rate (all-in)' },
    ],
  },
  electricityCommercial: {
    description: 'Commercial/industrial electricity tariffs',
    lastVerified: '2025-12-01',
    updateFrequency: 'Quarterly',
    sources: [
      { name: 'TNB (Tariff C1/C2), Malaysia', url: 'https://www.tnb.com.my', retrievedDate: '2025-12-01' },
      { name: 'EMA business tariff, Singapore', url: 'https://www.ema.gov.sg', retrievedDate: '2025-12-01' },
      { name: 'PLN B-2/B-3 tariff, Indonesia', url: 'https://web.pln.co.id', retrievedDate: '2025-12-01' },
      { name: 'MEA large general service, Thailand', url: 'https://www.mea.or.th', retrievedDate: '2025-12-01' },
      { name: 'EVN commercial, Vietnam', url: 'https://www.evn.com.vn', retrievedDate: '2025-12-01' },
      { name: 'Meralco commercial, Philippines', url: 'https://www.meralco.com.ph', retrievedDate: '2025-12-01' },
    ],
  },
  dcFastCharging: {
    description: 'Typical DC fast-charger rates (commercial EV charging)',
    lastVerified: '2025-12-01',
    updateFrequency: 'Quarterly',
    sources: [
      { name: 'ChargEV / TNB Electron, Malaysia', url: 'https://chargev.my', retrievedDate: '2025-12-01' },
      { name: 'SP Group / Shell Recharge, Singapore', url: 'https://www.spgroup.com.sg', retrievedDate: '2025-12-01' },
      { name: 'PLN / Hyundai charging, Indonesia', retrievedDate: '2025-12-01' },
      { name: 'EA Anywhere / PTT EV Station, Thailand', url: 'https://www.eaanywhere.com', retrievedDate: '2025-12-01' },
      { name: 'VinFast / EVES, Vietnam', retrievedDate: '2025-12-01' },
      { name: 'Meralco PowerGen, Philippines', retrievedDate: '2025-12-01' },
    ],
  },
  petrolPrice: {
    description: 'RON 95 petrol price per litre (local currency)',
    lastVerified: '2025-12-01',
    updateFrequency: 'Monthly',
    sources: [
      { name: 'Ministry of Domestic Trade (KPDNHEP), Malaysia', url: 'https://www.kpdnhep.gov.my', retrievedDate: '2025-12-01', notes: 'Subsidized RON 95 ceiling price' },
      { name: 'SPC / Caltex Singapore', retrievedDate: '2025-12-01' },
      { name: 'MyPertamina, Indonesia', retrievedDate: '2025-12-01', notes: 'Pertalite subsidised' },
      { name: 'Shell / PTT, Thailand', retrievedDate: '2025-12-01' },
      { name: 'Petrolimex, Vietnam', retrievedDate: '2025-12-01' },
      { name: 'DOE Philippines', retrievedDate: '2025-12-01' },
    ],
  },
  solarCost: {
    description: 'Rooftop solar PV installed cost per kWp (turnkey)',
    lastVerified: '2025-09-01',
    updateFrequency: 'Every 6 months',
    sources: [
      { name: 'SEDA Malaysia / installer quotes', url: 'https://www.seda.gov.my', retrievedDate: '2025-09-01' },
      { name: 'EMA Singapore / SolarQuote', retrievedDate: '2025-09-01' },
      { name: 'IRENA Renewable Cost Database, 2024', url: 'https://www.irena.org/costs', retrievedDate: '2025-09-01' },
      { name: 'BloombergNEF SEA Solar Tracker Q3 2025', retrievedDate: '2025-09-01' },
    ],
  },
  solarYield: {
    description: 'Expected solar energy yield per installed kWp (kWh/kWp/day)',
    lastVerified: '2025-09-01',
    updateFrequency: 'Annually',
    sources: [
      { name: 'Global Solar Atlas', url: 'https://globalsolaratlas.info', retrievedDate: '2025-09-01' },
      { name: 'PVsyst simulation averages for SEA capitals', retrievedDate: '2025-09-01' },
      { name: 'IRENA Statistics 2024', url: 'https://www.irena.org/Statistics', retrievedDate: '2025-09-01' },
    ],
  },
  co2Grid: {
    description: 'Grid electricity CO₂ emission factor (kg CO₂/kWh)',
    lastVerified: '2025-09-01',
    updateFrequency: 'Annually',
    sources: [
      { name: 'IEA Emission Factors 2024', url: 'https://www.iea.org/data-and-statistics', retrievedDate: '2025-09-01' },
      { name: 'ASEAN Centre for Energy (ACE) Outlook 2025', url: 'https://aseanenergy.org', retrievedDate: '2025-09-01' },
      { name: 'National grid operators annual reports (TNB, EMA, PLN, EGAT, EVN, NGCP)', retrievedDate: '2025-09-01' },
    ],
  },
  carbonCredit: {
    description: 'Voluntary carbon credit pricing (USD per tonne CO₂e)',
    lastVerified: '2025-10-01',
    updateFrequency: 'Quarterly',
    sources: [
      { name: 'Verra VCS Registry', url: 'https://verra.org', retrievedDate: '2025-10-01' },
      { name: 'Gold Standard Impact Registry', url: 'https://www.goldstandard.org', retrievedDate: '2025-10-01' },
      { name: 'AirCarbon Exchange (ACX) Singapore', url: 'https://www.aircarbon.co', retrievedDate: '2025-10-01' },
    ],
  },
  evIncentives: {
    description: 'Government EV purchase incentives and tax breaks',
    lastVerified: '2025-12-01',
    updateFrequency: 'On policy change',
    sources: [
      { name: 'MITI / MIDA Malaysia – i-MoVE programme', retrievedDate: '2025-12-01' },
      { name: 'LTA Singapore – VES/ARF rebates', url: 'https://www.lta.gov.sg', retrievedDate: '2025-12-01' },
      { name: 'Ministry of Industry Indonesia – LCEV policy', retrievedDate: '2025-12-01' },
      { name: 'Board of Investment Thailand – EV 3.5 package', retrievedDate: '2025-12-01' },
      { name: 'MOIT Vietnam – Special Consumption Tax exemption', retrievedDate: '2025-12-01' },
      { name: 'DTI Philippines – EVIDA IRR', retrievedDate: '2025-12-01' },
    ],
  },
  vehicleSpecs: {
    description: 'EV specifications (range, battery, efficiency, price, etc.)',
    lastVerified: '2025-12-01',
    updateFrequency: 'Monthly (as new models launch)',
    sources: [
      { name: 'Manufacturer websites (Tesla, BYD, Hyundai, Kia, MG, VinFast, etc.)', retrievedDate: '2025-12-01' },
      { name: 'Regional distributor price lists', retrievedDate: '2025-12-01' },
      { name: 'WLTP certification data (European type-approval database)', url: 'https://co2cars.apps.eea.europa.eu', retrievedDate: '2025-12-01' },
      { name: 'ev-database.org (cross-reference)', url: 'https://ev-database.org', retrievedDate: '2025-12-01' },
    ],
  },
  bessProducts: {
    description: 'Home battery energy storage system (BESS) specifications and pricing',
    lastVerified: '2025-09-01',
    updateFrequency: 'Every 6 months',
    sources: [
      { name: 'Tesla Powerwall website', url: 'https://www.tesla.com/powerwall', retrievedDate: '2025-09-01' },
      { name: 'BYD Battery-Box product page', url: 'https://www.bydbatterybox.com', retrievedDate: '2025-09-01' },
      { name: 'sonnen product page', url: 'https://sonnen.com', retrievedDate: '2025-09-01' },
      { name: 'Regional installer / distributor quotes', retrievedDate: '2025-09-01' },
    ],
  },
}


// ─────────────────────────────────────────────────────────────────────────────
// 1. ELECTRICITY — RESIDENTIAL TARIFF (local currency per kWh)
// ─────────────────────────────────────────────────────────────────────────────

export const RESIDENTIAL_TARIFF: CountryMap<number> = {
  MY: 0.474,   // RM/kWh — TNB Tariff A (domestic), block 1-200 kWh
  SG: 0.315,   // SGD/kWh — EMA regulated Q4 2025
  ID: 1750,    // IDR/kWh — PLN R-1/TR 2200VA
  TH: 4.59,    // THB/kWh — MEA normal residential
  VN: 2135,    // VND/kWh — EVN tier 1 progressive
  PH: 12.30,   // PHP/kWh — Meralco residential all-in
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ELECTRICITY — COMMERCIAL TARIFF (local currency per kWh)
// ─────────────────────────────────────────────────────────────────────────────

export const COMMERCIAL_TARIFF: CountryMap<number> = {
  MY: 0.509,   // RM/kWh — TNB Tariff C1 (commercial, peak)
  SG: 0.245,   // SGD/kWh — EMA business contestable
  ID: 1445,    // IDR/kWh — PLN B-2 commercial
  TH: 5.33,    // THB/kWh — MEA large general service
  VN: 2870,    // VND/kWh — EVN business normal hours
  PH: 10.90,   // PHP/kWh — Meralco commercial
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ELECTRICITY — DC FAST CHARGING (local currency per kWh)
// ─────────────────────────────────────────────────────────────────────────────

export const DC_FAST_CHARGING_RATE: CountryMap<number> = {
  SG: 0.50,    // SGD/kWh — SP / Shell Recharge
  MY: 1.20,    // MYR/kWh — ChargEV / TNB Electron
  ID: 3500,    // IDR/kWh — PLN / Hyundai
  PH: 8.50,    // PHP/kWh — Meralco PowerGen
  TH: 6.50,    // THB/kWh — EA Anywhere / PTT
  VN: 3500,    // VND/kWh — VinFast / EVES
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ELECTRICITY — AC PUBLIC LEVEL 2 (local currency per kWh)
// ─────────────────────────────────────────────────────────────────────────────

export const AC_PUBLIC_RATE: CountryMap<number> = {
  SG: 0.40,    // SGD/kWh
  MY: 0.80,    // MYR/kWh
  ID: 2500,    // IDR/kWh
  PH: 6.00,    // PHP/kWh
  TH: 5.00,    // THB/kWh
  VN: 2800,    // VND/kWh
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ELECTRICITY — TIME-OF-USE RATES (commercial, local currency per kWh)
// ─────────────────────────────────────────────────────────────────────────────

export interface TOURate {
  offPeak: number
  mid: number
  peak: number
  peakHours: string   // e.g. "09:00-17:00"
}

export const TOU_RATES: CountryMap<TOURate> = {
  MY: { offPeak: 0.337, mid: 0.509,  peak: 0.612, peakHours: '08:00-22:00' },
  SG: { offPeak: 0.180, mid: 0.245,  peak: 0.320, peakHours: '08:00-23:00' },
  ID: { offPeak: 1200,  mid: 1445,   peak: 1800,  peakHours: '17:00-22:00' },
  TH: { offPeak: 2.63,  mid: 5.33,   peak: 6.20,  peakHours: '09:00-22:00' },
  VN: { offPeak: 1685,  mid: 2870,   peak: 3937,  peakHours: '09:30-11:30, 17:00-20:00' },
  PH: { offPeak: 8.50,  mid: 10.90,  peak: 13.20, peakHours: '08:00-21:00' },
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ELECTRICITY — DEMAND CHARGE (local currency per kW per month)
// ─────────────────────────────────────────────────────────────────────────────

export const DEMAND_CHARGE: CountryMap<number> = {
  MY: 45.10,   // RM/kW/month
  SG: 9.24,    // SGD/kW/month
  ID: 40000,   // IDR/kW/month
  TH: 220.00,  // THB/kW/month
  VN: 41900,   // VND/kW/month
  PH: 350.00,  // PHP/kW/month
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PETROL — RON 95 PRICE PER LITRE (local currency)
// ─────────────────────────────────────────────────────────────────────────────

export const PETROL_PRICE_PER_LITRE: CountryMap<number> = {
  MY: 2.05,    // RM — subsidized RON 95
  SG: 2.78,    // SGD
  ID: 10000,   // IDR — Pertalite
  TH: 36.50,   // THB
  VN: 22000,   // VND
  PH: 62.00,   // PHP
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. SOLAR — YIELD & COST
// ─────────────────────────────────────────────────────────────────────────────

/** kWh generated per installed kWp per day (annual average, Global Solar Atlas) */
export const SOLAR_YIELD_PER_KWP_DAY: CountryMap<number> = {
  MY: 4.6,     // Kuala Lumpur latitude
  SG: 4.2,     // Equatorial, high humidity
  ID: 4.8,     // Jakarta region
  TH: 4.5,     // Bangkok region
  VN: 4.0,     // Hanoi average (varies north-south)
  PH: 4.2,     // Metro Manila
}

/** Installed cost per kWp, turnkey, in local currency */
export const SOLAR_COST_PER_KWP: CountryMap<number> = {
  MY: 3200,    // RM/kWp — SEDA/installer quotes 2025
  SG: 1500,    // SGD/kWp
  ID: 14000000,// IDR/kWp
  TH: 35000,   // THB/kWp
  VN: 18000000,// VND/kWp
  PH: 55000,   // PHP/kWp
}

/** kWh from a 10 kW solar system per day (used in ComparisonTable for solar top-up calc) */
export const SOLAR_10KW_DAILY_YIELD: CountryMap<number> = {
  SG: 42,
  MY: 45,
  ID: 48,
  PH: 42,
  TH: 45,
  VN: 40,
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CO₂ — GRID EMISSION FACTOR (kg CO₂ per kWh)
// ─────────────────────────────────────────────────────────────────────────────
// Source: IEA 2024 + national grid operator reports
// Note: Some scoreboard/ESG components previously used 0.585 for MY based on an
// older ASEAN Centre for Energy (ACE) figure. IEA 2024 reports 0.65 for MY grid.
// We standardize on IEA 2024 figures here.

export const CO2_GRID_FACTOR: CountryMap<number> = {
  MY: 0.65,
  SG: 0.45,
  ID: 0.70,
  TH: 0.55,
  VN: 0.60,
  PH: 0.68,
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CARBON CREDIT PRICES (USD per tonne CO₂e)
// ─────────────────────────────────────────────────────────────────────────────

export const CARBON_CREDIT_PRICE_USD: Record<string, number> = {
  VCS: 12,             // Verra VCS average
  GoldStandard: 28,    // Gold Standard certified
  Article6_4: 45,      // Paris Article 6.4
  ACX: 8,              // AirCarbon Exchange spot
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. USD EXCHANGE RATES (local currency per 1 USD)
// ─────────────────────────────────────────────────────────────────────────────

export const USD_EXCHANGE_RATE: CountryMap<number> = {
  MY: 4.70,
  SG: 1.35,
  ID: 16200,
  TH: 35.50,
  VN: 25400,
  PH: 58.00,
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. EV GOVERNMENT INCENTIVES (one-time, local currency)
// ─────────────────────────────────────────────────────────────────────────────

export const EV_INCENTIVE: CountryMap<number> = {
  MY: 0,           // Full import duty + excise tax exemption (already reflected in price)
  SG: 5000,        // ARF rebate under VES A1 band
  ID: 80000000,    // IDR — subsidy for qualifying LCEV CKD
  TH: 100000,      // THB — EV 3.5 purchase subsidy
  VN: 0,           // SCT exemption reflected in price
  PH: 0,           // No direct purchase subsidy (duty exemption only)
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. BESS — COMMERCIAL BATTERY COSTS
// ─────────────────────────────────────────────────────────────────────────────

/** Commercial-grade LFP BESS installed cost per kWh (local currency) */
export const BESS_COST_PER_KWH: CountryMap<number> = {
  MY: 2200,    // RM/kWh
  SG: 800,     // SGD/kWh
  ID: 6500000, // IDR/kWh
  TH: 18000,   // THB/kWh
  VN: 12000000,// VND/kWh
  PH: 35000,   // PHP/kWh
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. VEHICLE ECONOMICS — DEFAULT ASSUMPTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** These are labelled clearly as assumptions in component footers */
export const EV_ECONOMICS = {
  maintenanceRatePerYear: 0.005,    // 0.5% of purchase price per year
  insuranceRatePerYear: 0.025,      // 2.5% of purchase price per year
  resaleValueAfter5Years: 0.50,     // 50% of purchase price retained
  depreciationRatePerYear: 0.12,    // 12% annual depreciation
  avgPetrolConsumption: 7.5,        // L/100km for ICE baseline
  batteryDegradationRate: 0.015,    // 1.5% per year
  tariffInflationRate: 0.03,        // 3% annual electricity inflation
} as const

/** ICE vehicle comparison defaults */
export const ICE_ECONOMICS = {
  depreciationRatePerYear: 0.10,
  maintenanceCostMultiplier: 2.0,   // ICE = 2x EV maintenance
  insurancePremiumMultiplier: 1.15, // ICE = 15% higher insurance
} as const


// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Generate a citation string for a given data category
// ─────────────────────────────────────────────────────────────────────────────

export function getCitationText(category: keyof typeof DATA_PROVENANCE): string {
  const entry = DATA_PROVENANCE[category]
  if (!entry) return ''
  const sourceNames = entry.sources.map(s => s.name).join('; ')
  return `${entry.description}. Sources: ${sourceNames}. Last verified: ${entry.lastVerified}. Updated ${entry.updateFrequency.toLowerCase()}.`
}

/**
 * Get a compact footer string for component citations.
 * Example: "Residential tariffs | Sources: TNB, EMA, PLN... | Verified Dec 2025"
 */
export function getCitationFooter(category: keyof typeof DATA_PROVENANCE): string {
  const entry = DATA_PROVENANCE[category]
  if (!entry) return ''
  const names = entry.sources.map(s => s.name.split(',')[0].split('(')[0].trim())
  const short = names.length > 3 ? names.slice(0, 3).join(', ') + ' et al.' : names.join(', ')
  const date = new Date(entry.lastVerified)
  const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return `Sources: ${short} | Verified ${monthStr} | Updated ${entry.updateFrequency.toLowerCase()}`
}
