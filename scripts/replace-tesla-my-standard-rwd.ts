// @ts-nocheck
/**
 * Script to replace non-Juniper Tesla Model Y entries in Malaysia with Standard RWD trim
 */

import fs from 'fs'
import path from 'path'

const vehiclesDataPath = path.join(__dirname, '../data/vehicles-data.json')

// Official Tesla Model Y Standard RWD specifications (Malaysia)
const standardRwdSpecs = {
  modelTrim: 'Standard RWD',
  batteryCapacityKwh: 57.5, // Standard Range uses smaller battery
  rangeWltpKm: 455,
  rangeEpaKm: 430, // Estimated based on WLTP
  rangeKm: 455,
  efficiencyKwhPer100km: 12.6, // Calculated: 57.5 / 455 * 100 = 12.6
  powerRatingKw: 220, // ~295 hp
  torqueNm: 420,
  acceleration0To100Kmh: 6.9,
  topSpeedKmh: 217,
  curbWeightKg: 1974,
  batteryWeightKg: 430, // Estimated based on smaller battery
  batteryWeightPercentage: 21.8, // Calculated: 430 / 1974 * 100
  batteryWarranty: '8 years / 160,000 km',
  chargingTimeDc0To80Min: 30, // Slightly longer due to smaller battery and 170kW max
  chargingCapabilities: 'DC Fast Charge: Up to 170kW, AC: 11kW', // Standard RWD has lower max charging
  hasBidirectional: false,
}

async function replaceTeslaMYStandardRwd() {
  try {
    console.log('Reading vehicles-data.json...')
    const fileContent = fs.readFileSync(vehiclesDataPath, 'utf-8')
    const vehicles: any[] = JSON.parse(fileContent)

    // Find all Tesla Model Y entries in Malaysia that are NOT Juniper
    const teslaMYMalaysia = vehicles.filter(
      v => v.name === 'Tesla Model Y' 
        && v.country === 'MY' 
        && v.modelTrim 
        && !v.modelTrim.includes('Juniper')
    )

    console.log(`Found ${teslaMYMalaysia.length} non-Juniper Tesla Model Y entries in Malaysia:`)
    teslaMYMalaysia.forEach(v => console.log(`  - ${v.modelTrim}`))

    if (teslaMYMalaysia.length === 0) {
      console.log('No non-Juniper Tesla Model Y entries found in Malaysia.')
      return
    }

    // If there are multiple non-Juniper entries, we'll replace them all with a single Standard RWD
    // First, remove all non-Juniper entries
    const vehiclesToKeep = vehicles.filter(
      v => !(v.name === 'Tesla Model Y' 
        && v.country === 'MY' 
        && v.modelTrim 
        && !v.modelTrim.includes('Juniper'))
    )

    // Add the Standard RWD entry
    // Find a reference entry to copy other fields from
    const referenceEntry = teslaMYMalaysia[0]
    
    const standardRwdEntry = {
      ...referenceEntry,
      ...standardRwdSpecs,
      // Keep these fields from reference
      name: 'Tesla Model Y',
      country: 'MY',
      batteryManufacturer: referenceEntry.batteryManufacturer || 'Panasonic',
      batteryTechnology: referenceEntry.batteryTechnology || 'LFP', // Standard Range typically uses LFP
      technologyFeatures: referenceEntry.technologyFeatures || 'Autopilot, Full Self-Driving Capability, Sentry Mode, 15" Touchscreen, Premium Interior',
      optionPrices: referenceEntry.optionPrices || [],
      isAvailable: true,
      grossVehicleWeightKg: referenceEntry.grossVehicleWeightKg || 2174,
    }

    vehiclesToKeep.push(standardRwdEntry)

    // Create backup
    const backupPath = vehiclesDataPath.replace('.json', `.backup-${Date.now()}.json`)
    fs.writeFileSync(backupPath, fileContent)
    console.log(`\nBackup created: ${backupPath}`)

    // Write updated data
    fs.writeFileSync(vehiclesDataPath, JSON.stringify(vehiclesToKeep, null, 2))

    console.log(`\n✅ Replaced ${teslaMYMalaysia.length} non-Juniper Tesla Model Y entry/entries with Standard RWD trim`)
    console.log('\nStandard RWD specifications:')
    console.log(`  - Battery Capacity: ${standardRwdSpecs.batteryCapacityKwh} kWh`)
    console.log(`  - Range (WLTP): ${standardRwdSpecs.rangeWltpKm} km`)
    console.log(`  - Power: ${standardRwdSpecs.powerRatingKw} kW`)
    console.log(`  - Acceleration: ${standardRwdSpecs.acceleration0To100Kmh} s (0-100 km/h)`)
    console.log(`  - Top Speed: ${standardRwdSpecs.topSpeedKmh} km/h`)
    console.log(`  - DC Charging: Up to 170kW`)

  } catch (error: any) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

replaceTeslaMYStandardRwd()

