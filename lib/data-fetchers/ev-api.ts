/**
 * EV Data Fetcher using API Ninjas Electric Vehicle API
 * Free tier: 10 requests/day, 1000 requests/month
 * Get API key: https://api-ninjas.com/api/electricvehicle
 */

type MaybeString = string | undefined

interface APIVehicle {
  make: string
  model: string
  year_start?: string
  battery_useable_capacity?: MaybeString
  battery_capacity?: MaybeString
  energy_consumption_combined_mild_weather?: MaybeString
  energy_consumption_combined_cold_weather?: MaybeString
  vehicle_consumption?: MaybeString
  electric_range?: MaybeString
  charge_power_10p_80p?: MaybeString
  charge_power_max?: MaybeString
  total_power?: MaybeString
  acceleration_0_100_kmh?: MaybeString
  gross_vehicle_weight?: MaybeString
  car_body?: MaybeString
}

export interface TransformedVehicle {
  name: string
  modelTrim?: string
  rangeKm?: number // Legacy field
  rangeWltpKm?: number // WLTP range in km
  rangeEpaKm?: number // EPA range in km
  efficiencyKwhPer100km?: number
  powerRatingKw?: number
  batteryCapacityKwh?: number
  chargingTimeDc0To80Min?: number
  acceleration0To100Kmh?: number // 0-100 km/h in seconds (≈ 0-60 mph)
  grossVehicleWeightKg?: number // Gross vehicle weight from API (kg)
  imageUrl?: string
  rawData: APIVehicle
}

const DEFAULT_MODEL_QUERIES = [
  // Tesla
  'Model 3',
  'Model Y',
  'Model S',
  'Model X',
  // BYD
  'Atto 3',
  'Seal',
  // Hyundai/Kia
  'IONIQ 5',
  'IONIQ 6',
  'EV6',
  'Niro EV',
  'Soul EV',
  'Kona Electric',
  // Volvo
  'XC40',
  'C40',
  'EX90',
  'EX30',
  // BMW
  'iX',
  'iX3',
  'i4',
  'iX1',
  // Mercedes
  'EQS',
  'EQE',
  'EQC',
  // Audi
  'e-tron',
  'Q4 e-tron',
  'e-tron GT',
  // Volkswagen
  'ID.4',
  'ID.3',
  'ID.7',
  // Nissan
  'Leaf',
  'Ariya',
  // Ford
  'Mustang Mach-E',
  'F-150 Lightning',
  // Rivian
  'R1T',
  'R1S',
  // Other Premium
  'Lucid Air',
  'Porsche Taycan',
  'Polestar 2',
  // Chevrolet
  'Bolt EV',
  'Bolt EUV',
  // Genesis
  'GV60',
  'Electrified GV70',
  'Electrified G80',
  // MG
  'MG4',
  'ZS EV',
]

const REQUEST_INTERVAL_MS = Number(
  process.env.API_NINJAS_REQUEST_INTERVAL_MS ?? '1100'
)
const MAX_REQUESTS_PER_RUN = Number(
  process.env.API_NINJAS_MAX_REQUESTS ?? '50'
)

export async function fetchVehiclesFromAPI(
  apiKey?: string
): Promise<TransformedVehicle[]> {
  if (!apiKey) {
    console.warn('API_NINJAS_KEY not set, skipping API fetch')
    return []
  }

  const userQueries = process.env.API_NINJAS_MODELS
    ? process.env.API_NINJAS_MODELS.split(',').map((q) => q.trim()).filter(Boolean)
    : undefined

  const queries = (userQueries?.length ? userQueries : DEFAULT_MODEL_QUERIES).slice(
    0,
    MAX_REQUESTS_PER_RUN
  )

  const uniqueVehicles = new Map<string, TransformedVehicle>()

  for (const query of queries) {
    try {
      const fetched = await fetchVehiclesByModel(query, apiKey)
      for (const vehicle of fetched) {
        const key = `${vehicle.name}-${vehicle.modelTrim}`
        if (!uniqueVehicles.has(key)) {
          uniqueVehicles.set(key, vehicle)
        }
      }
    } catch (error) {
      console.error(`Error fetching vehicles for query "${query}":`, error)
    }

    if (REQUEST_INTERVAL_MS > 0) {
      await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL_MS))
    }
  }

  return Array.from(uniqueVehicles.values())
}

async function fetchVehiclesByModel(
  model: string,
  apiKey: string
): Promise<TransformedVehicle[]> {
  const url = `https://api.api-ninjas.com/v1/electricvehicle?model=${encodeURIComponent(
    model
  )}`

  const response = await fetch(url, {
    headers: {
      'X-Api-Key': apiKey,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid API key')
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded')
    }
    throw new Error(`API error: ${response.status}`)
  }

  const data: APIVehicle[] = await response.json()
  return data
    .map(transformVehicle)
    .filter((vehicle): vehicle is TransformedVehicle => vehicle !== null)
}

function transformVehicle(apiVehicle: APIVehicle): TransformedVehicle | null {
  const batteryCapacityKwh =
    parseNumber(apiVehicle.battery_useable_capacity) ??
    parseNumber(apiVehicle.battery_capacity)

  const efficiencyWhPerKm =
    parseNumber(apiVehicle.energy_consumption_combined_mild_weather) ??
    parseNumber(apiVehicle.energy_consumption_combined_cold_weather) ??
    parseNumber(apiVehicle.vehicle_consumption)

  const efficiencyKwhPer100km = efficiencyWhPerKm
    ? (efficiencyWhPerKm / 1000) * 100
    : batteryCapacityKwh
    ? (batteryCapacityKwh / (parseNumber(apiVehicle.electric_range) ?? 400)) * 100
    : undefined

  if (!efficiencyKwhPer100km && !batteryCapacityKwh) {
    return null
  }

  const rangeFromAPI = parseNumber(apiVehicle.electric_range)
  const computedRange =
    batteryCapacityKwh && efficiencyWhPerKm
      ? Math.round(
          batteryCapacityKwh / (efficiencyWhPerKm / 1000) // kWh / (kWh per km)
        )
      : undefined

  const rangeKm = rangeFromAPI || computedRange || undefined
  
  // API Ninjas typically provides WLTP range. EPA is typically ~25% lower
  // If we have a range, assume it's WLTP and calculate EPA
  const rangeWltpKm = rangeKm
  const rangeEpaKm = rangeKm ? Math.round(rangeKm * 0.75) : undefined // EPA is typically 75% of WLTP
  const powerRatingKw = parseNumber(apiVehicle.total_power, /([0-9.]+)\s?kW/)

  const chargingPowerKw =
    parseNumber(apiVehicle.charge_power_10p_80p, /([0-9.]+)\s?kW/) ??
    parseNumber(apiVehicle.charge_power_max, /([0-9.]+)\s?kW/)

  const chargingTimeDc0To80Min =
    batteryCapacityKwh && chargingPowerKw
      ? Math.round(((batteryCapacityKwh * 0.7) / chargingPowerKw) * 60)
      : undefined

  // Extract 0-100 km/h acceleration (≈ 0-60 mph, very close)
  // API provides in format like "5.3 s" or "5.3"
  const acceleration0To100Kmh = parseNumber(
    apiVehicle.acceleration_0_100_kmh,
    /([0-9.]+)\s*(?:s|sec|seconds)?/i
  )

  // Extract gross vehicle weight (kg)
  // API may provide in format like "1850 kg" or "1850"
  const grossVehicleWeightKg = parseNumber(
    apiVehicle.gross_vehicle_weight,
    /([0-9.]+)\s*(?:kg|kilograms?)?/i
  )

  const modelTrim =
    apiVehicle.year_start && apiVehicle.year_start !== 'No Data'
      ? apiVehicle.year_start
      : undefined

  return {
    name: `${apiVehicle.make} ${apiVehicle.model}`.trim(),
    modelTrim: modelTrim ?? undefined,
    rangeKm: rangeKm ?? undefined, // Legacy field for backward compatibility
    rangeWltpKm,
    rangeEpaKm,
    efficiencyKwhPer100km: efficiencyKwhPer100km ?? undefined,
    powerRatingKw: powerRatingKw ?? undefined,
    batteryCapacityKwh,
    chargingTimeDc0To80Min,
    acceleration0To100Kmh,
    grossVehicleWeightKg,
    imageUrl: undefined,
    rawData: apiVehicle,
  }
}

function parseNumber(value?: string, pattern?: RegExp): number | undefined {
  if (!value) return undefined
  const sanitized = value.replace(/,/g, '.')
  const regex = pattern ?? /([0-9.]+)/
  const match = sanitized.match(regex)
  if (!match) return undefined
  const parsed = parseFloat(match[1])
  return Number.isFinite(parsed) ? parsed : undefined
}


