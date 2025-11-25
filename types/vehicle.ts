export type Country = 'SG' | 'MY'

export type BatteryTechnology = 'NMC' | 'LFP' | 'SolidState' | 'Other'

export interface OptionPrice {
  name: string
  price: number
}

export interface Rebate {
  name: string
  amount: number
  description: string
}

export interface Vehicle {
  id: string
  country: Country
  name: string
  modelTrim: string
  imageUrl: string
  batteryWeightKg: number
  curbWeightKg: number
  batteryWeightPercentage: number
  powerRatingKw: number
  powerRatingExplanation: string
  acceleration0To100Kmh?: number | null // 0-100 km/h in seconds (≈ 0-60 mph)
  efficiencyKwhPer100km: number
  rangeKm: number // Legacy field
  rangeWltpKm?: number | null // WLTP range in km
  rangeEpaKm?: number | null // EPA range in km
  manufacturerCostUsd: number
  batteryManufacturer: string
  batteryTechnology: BatteryTechnology
  chargingTimeDc0To80Min: number
  chargingCapabilities: string
  basePriceLocalCurrency: number
  optionPrices: OptionPrice[]
  onTheRoadPriceLocalCurrency: number
  rebates: Rebate[]
  isAvailable: boolean
  updatedAt: string
  createdAt: string
}

