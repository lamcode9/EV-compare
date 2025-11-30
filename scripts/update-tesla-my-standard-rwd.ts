// @ts-nocheck
/**
 * Script to update Tesla Model Y Standard RWD in Malaysia with actual official specifications
 */

import fs from 'fs'
import path from 'path'

const vehiclesDataPath = path.join(__dirname, '../data/vehicles-data.json')

// Official Tesla Model Y RWD specifications (from verify-tesla-specs.ts)
const officialModelYRwdSpecs = {
  batteryCapacityKwh: 60, // LFP battery for Standard Range
  rangeWltpKm: 466,
  rangeEpaKm: 455,
  rangeKm: 466,
  efficiencyKwhPer100km: 15.5, // Calculated from 60 kWh / 466 km * 100
  powerRatingKw: 220,
  torqueNm: 420,
  acceleration0To100Kmh: 6.9,
  topSpeedKmh: 217,
  curbWeightKg: 1974,
  batteryWeightKg: 450,
  batteryWeightPercentage: 22.8,
  batteryWarranty: '8 years / 160,000 km',
  chargingTimeDc0To80Min: 25,
  chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
  batteryTechnology: 'LFP', // Standard Range uses LFP battery
  hasBidirectional: false,
}

async function updateTeslaMYStandardRwd() {
  try {
    console.log('Reading vehicles-data.json...')
    const fileContent = fs.readFileSync(vehiclesDataPath, 'utf-8')
    const vehicles: any[] = JSON.parse(fileContent)

    // Find the Standard RWD entry
    const standardRwdIndex = vehicles.findIndex(
      v => v.name === 'Tesla Model Y' 
        && v.country === 'MY' 
        && v.modelTrim === 'Standard RWD'
    )

    if (standardRwdIndex === -1) {
      console.log('Standard RWD entry not found!')
      return
    }

    const standardRwd = vehicles[standardRwdIndex]
    console.log('Found Standard RWD entry, updating with official specs...')

    // Update all fields with official specifications
    Object.keys(officialModelYRwdSpecs).forEach(key => {
      const oldValue = standardRwd[key]
      const newValue = officialModelYRwdSpecs[key]
      if (oldValue !== newValue) {
        console.log(`  ${key}: ${oldValue} → ${newValue}`)
        standardRwd[key] = newValue
      }
    })

    // Create backup
    const backupPath = vehiclesDataPath.replace('.json', `.backup-${Date.now()}.json`)
    fs.writeFileSync(backupPath, fileContent)
    console.log(`\nBackup created: ${backupPath}`)

    // Write updated data
    fs.writeFileSync(vehiclesDataPath, JSON.stringify(vehicles, null, 2))

    console.log('\n✅ Updated Tesla Model Y Standard RWD with official specifications')
    console.log('\nFinal specifications:')
    console.log(`  - Battery Capacity: ${standardRwd.batteryCapacityKwh} kWh (${standardRwd.batteryTechnology})`)
    console.log(`  - Range (WLTP): ${standardRwd.rangeWltpKm} km`)
    console.log(`  - Range (EPA): ${standardRwd.rangeEpaKm} km`)
    console.log(`  - Efficiency: ${standardRwd.efficiencyKwhPer100km} kWh/100km`)
    console.log(`  - Power: ${standardRwd.powerRatingKw} kW`)
    console.log(`  - Torque: ${standardRwd.torqueNm} Nm`)
    console.log(`  - Acceleration: ${standardRwd.acceleration0To100Kmh} s (0-100 km/h)`)
    console.log(`  - Top Speed: ${standardRwd.topSpeedKmh} km/h`)
    console.log(`  - DC Charging: Up to 250kW`)

  } catch (error: any) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

updateTeslaMYStandardRwd()

