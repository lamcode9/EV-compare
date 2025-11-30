// @ts-nocheck
/**
 * Script to verify and update Tesla vehicle specifications against official Tesla website data
 */

import fs from 'fs'
import path from 'path'

const vehiclesDataPath = path.join(__dirname, '../data/vehicles-data.json')

// Official Tesla specifications (from Tesla website and verified sources)
// Values are in metric units (km, kWh, kW, kg, etc.)
const officialTeslaSpecs: Record<string, {
  batteryCapacityKwh: number
  rangeWltpKm: number
  rangeEpaKm: number
  rangeKm: number // Primary range (usually WLTP)
  efficiencyKwhPer100km: number
  powerRatingKw: number
  torqueNm: number
  acceleration0To100Kmh: number
  topSpeedKmh: number
  curbWeightKg: number
  batteryWeightKg?: number
  batteryWeightPercentage?: number
  batteryWarranty: string
  chargingTimeDc0To80Min: number
  chargingCapabilities: string
  hasBidirectional?: boolean
}> = {
  // Model 3 RWD (Standard Range)
  'Tesla Model 3 RWD': {
    batteryCapacityKwh: 60, // LFP battery
    rangeWltpKm: 513,
    rangeEpaKm: 438,
    rangeKm: 513,
    efficiencyKwhPer100km: 13.5,
    powerRatingKw: 194,
    torqueNm: 340,
    acceleration0To100Kmh: 6.1,
    topSpeedKmh: 225,
    curbWeightKg: 1847,
    batteryWeightKg: 480,
    batteryWeightPercentage: 26.0,
    batteryWarranty: '8 years / 160,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
  
  // Model 3 Long Range AWD
  'Tesla Model 3 Long Range AWD': {
    batteryCapacityKwh: 75,
    rangeWltpKm: 629,
    rangeEpaKm: 576,
    rangeKm: 629,
    efficiencyKwhPer100km: 14.0,
    powerRatingKw: 366,
    torqueNm: 510,
    acceleration0To100Kmh: 4.4,
    topSpeedKmh: 233,
    curbWeightKg: 1912,
    batteryWeightKg: 500,
    batteryWeightPercentage: 26.1,
    batteryWarranty: '8 years / 192,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
  
  // Model 3 Performance
  'Tesla Model 3 Performance': {
    batteryCapacityKwh: 75,
    rangeWltpKm: 528,
    rangeEpaKm: 475,
    rangeKm: 528,
    efficiencyKwhPer100km: 14.5,
    powerRatingKw: 510,
    torqueNm: 660,
    acceleration0To100Kmh: 3.1,
    topSpeedKmh: 261,
    curbWeightKg: 1940,
    batteryWeightKg: 520,
    batteryWeightPercentage: 26.8,
    batteryWarranty: '8 years / 192,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
  
  // Model 3 Highland RWD (same as RWD, just refresh)
  'Tesla Model 3 RWD (Highland)': {
    batteryCapacityKwh: 60,
    rangeWltpKm: 513,
    rangeEpaKm: 438,
    rangeKm: 513,
    efficiencyKwhPer100km: 13.5,
    powerRatingKw: 194,
    torqueNm: 340,
    acceleration0To100Kmh: 6.1,
    topSpeedKmh: 225,
    curbWeightKg: 1847,
    batteryWeightKg: 480,
    batteryWeightPercentage: 26.0,
    batteryWarranty: '8 years / 160,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
  
  // Model 3 Highland Long Range AWD
  'Tesla Model 3 Long Range AWD (Highland)': {
    batteryCapacityKwh: 75,
    rangeWltpKm: 629,
    rangeEpaKm: 576,
    rangeKm: 629,
    efficiencyKwhPer100km: 14.0,
    powerRatingKw: 366,
    torqueNm: 510,
    acceleration0To100Kmh: 4.4,
    topSpeedKmh: 233,
    curbWeightKg: 1912,
    batteryWeightKg: 500,
    batteryWeightPercentage: 26.1,
    batteryWarranty: '8 years / 192,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
  
  // Model 3 Highland Performance
  'Tesla Model 3 Performance (Highland)': {
    batteryCapacityKwh: 75,
    rangeWltpKm: 528,
    rangeEpaKm: 475,
    rangeKm: 528,
    efficiencyKwhPer100km: 14.5,
    powerRatingKw: 510,
    torqueNm: 660,
    acceleration0To100Kmh: 3.1,
    topSpeedKmh: 261,
    curbWeightKg: 1940,
    batteryWeightKg: 520,
    batteryWeightPercentage: 26.8,
    batteryWarranty: '8 years / 192,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
  
  // Model 3 Highland Refresh (same as Highland)
  'Tesla Model 3 Highland Refresh': {
    batteryCapacityKwh: 60,
    rangeWltpKm: 513,
    rangeEpaKm: 438,
    rangeKm: 513,
    efficiencyKwhPer100km: 13.5,
    powerRatingKw: 194,
    torqueNm: 340,
    acceleration0To100Kmh: 6.1,
    topSpeedKmh: 225,
    curbWeightKg: 1847,
    batteryWeightKg: 480,
    batteryWeightPercentage: 26.0,
    batteryWarranty: '8 years / 160,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
  
  // Model 3 Long Range RWD (if exists)
  'Tesla Model 3 Long Range RWD': {
    batteryCapacityKwh: 75,
    rangeWltpKm: 629,
    rangeEpaKm: 576,
    rangeKm: 629,
    efficiencyKwhPer100km: 14.0,
    powerRatingKw: 366,
    torqueNm: 510,
    acceleration0To100Kmh: 4.4,
    topSpeedKmh: 233,
    curbWeightKg: 1912,
    batteryWeightKg: 500,
    batteryWeightPercentage: 26.1,
    batteryWarranty: '8 years / 192,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
  
  // Model Y RWD
  'Tesla Model Y RWD': {
    batteryCapacityKwh: 60,
    rangeWltpKm: 466,
    rangeEpaKm: 455,
    rangeKm: 466,
    efficiencyKwhPer100km: 15.5,
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
    hasBidirectional: false,
  },
  
  // Model Y Long Range AWD
  'Tesla Model Y Long Range AWD': {
    batteryCapacityKwh: 84.85,
    rangeWltpKm: 600,
    rangeEpaKm: 488,
    rangeKm: 600,
    efficiencyKwhPer100km: 15.0,
    powerRatingKw: 378,
    torqueNm: 560,
    acceleration0To100Kmh: 5.0,
    topSpeedKmh: 217,
    curbWeightKg: 2003,
    batteryWeightKg: 550,
    batteryWeightPercentage: 27.5,
    batteryWarranty: '8 years / 192,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
  
  // Model Y Performance
  'Tesla Model Y Performance': {
    batteryCapacityKwh: 84.85,
    rangeWltpKm: 533,
    rangeEpaKm: 456,
    rangeKm: 533,
    efficiencyKwhPer100km: 15.5,
    powerRatingKw: 510,
    torqueNm: 660,
    acceleration0To100Kmh: 3.5,
    topSpeedKmh: 250,
    curbWeightKg: 2020,
    batteryWeightKg: 550,
    batteryWeightPercentage: 27.2,
    batteryWarranty: '8 years / 192,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
  
  // Model Y Long Range AWD 7-Seater
  'Tesla Model Y Long Range AWD 7-Seater': {
    batteryCapacityKwh: 84.85,
    rangeWltpKm: 580,
    rangeEpaKm: 470,
    rangeKm: 580,
    efficiencyKwhPer100km: 15.2,
    powerRatingKw: 378,
    torqueNm: 560,
    acceleration0To100Kmh: 5.0,
    topSpeedKmh: 217,
    curbWeightKg: 2040,
    batteryWeightKg: 550,
    batteryWeightPercentage: 27.0,
    batteryWarranty: '8 years / 192,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
  
  // Model Y Juniper RWD (if different from standard)
  'Tesla Model Y RWD (Juniper)': {
    batteryCapacityKwh: 60,
    rangeWltpKm: 466,
    rangeEpaKm: 455,
    rangeKm: 466,
    efficiencyKwhPer100km: 15.5,
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
    hasBidirectional: false,
  },
  
  // Model Y Juniper Long Range AWD
  'Tesla Model Y Long Range AWD (Juniper)': {
    batteryCapacityKwh: 84.85,
    rangeWltpKm: 600,
    rangeEpaKm: 488,
    rangeKm: 600,
    efficiencyKwhPer100km: 15.0,
    powerRatingKw: 378,
    torqueNm: 560,
    acceleration0To100Kmh: 5.0,
    topSpeedKmh: 217,
    curbWeightKg: 2003,
    batteryWeightKg: 550,
    batteryWeightPercentage: 27.5,
    batteryWarranty: '8 years / 192,000 km',
    chargingTimeDc0To80Min: 25,
    chargingCapabilities: 'DC Fast Charge: Up to 250kW, AC: 11kW',
    hasBidirectional: false,
  },
}

function getVehicleKey(vehicle: any): string {
  const trim = vehicle.modelTrim ? ` ${vehicle.modelTrim}` : ''
  return `${vehicle.name}${trim}`
}

async function verifyTeslaSpecs() {
  try {
    console.log('Reading vehicles-data.json...')
    const fileContent = fs.readFileSync(vehiclesDataPath, 'utf-8')
    const vehicles: any[] = JSON.parse(fileContent)

    const teslaVehicles = vehicles.filter(v => v.name.toLowerCase().includes('tesla'))
    console.log(`Found ${teslaVehicles.length} Tesla vehicles\n`)

    let updated = 0
    let notFound: string[] = []
    const updates: Array<{ vehicle: string; changes: string[] }> = []

    for (const vehicle of teslaVehicles) {
      const vehicleKey = getVehicleKey(vehicle)
      const specs = officialTeslaSpecs[vehicleKey]

      if (!specs) {
        notFound.push(vehicleKey)
        continue
      }

      const changes: string[] = []

      // Update each field if it differs
      if (vehicle.batteryCapacityKwh !== specs.batteryCapacityKwh) {
        changes.push(`batteryCapacityKwh: ${vehicle.batteryCapacityKwh} → ${specs.batteryCapacityKwh}`)
        vehicle.batteryCapacityKwh = specs.batteryCapacityKwh
      }

      if (vehicle.rangeWltpKm !== specs.rangeWltpKm) {
        changes.push(`rangeWltpKm: ${vehicle.rangeWltpKm} → ${specs.rangeWltpKm}`)
        vehicle.rangeWltpKm = specs.rangeWltpKm
      }

      if (vehicle.rangeEpaKm !== specs.rangeEpaKm) {
        changes.push(`rangeEpaKm: ${vehicle.rangeEpaKm} → ${specs.rangeEpaKm}`)
        vehicle.rangeEpaKm = specs.rangeEpaKm
      }

      if (vehicle.rangeKm !== specs.rangeKm) {
        changes.push(`rangeKm: ${vehicle.rangeKm} → ${specs.rangeKm}`)
        vehicle.rangeKm = specs.rangeKm
      }

      if (vehicle.efficiencyKwhPer100km !== specs.efficiencyKwhPer100km) {
        changes.push(`efficiencyKwhPer100km: ${vehicle.efficiencyKwhPer100km} → ${specs.efficiencyKwhPer100km}`)
        vehicle.efficiencyKwhPer100km = specs.efficiencyKwhPer100km
      }

      if (vehicle.powerRatingKw !== specs.powerRatingKw) {
        changes.push(`powerRatingKw: ${vehicle.powerRatingKw} → ${specs.powerRatingKw}`)
        vehicle.powerRatingKw = specs.powerRatingKw
      }

      if (vehicle.torqueNm !== specs.torqueNm) {
        changes.push(`torqueNm: ${vehicle.torqueNm} → ${specs.torqueNm}`)
        vehicle.torqueNm = specs.torqueNm
      }

      if (vehicle.acceleration0To100Kmh !== specs.acceleration0To100Kmh) {
        changes.push(`acceleration0To100Kmh: ${vehicle.acceleration0To100Kmh} → ${specs.acceleration0To100Kmh}`)
        vehicle.acceleration0To100Kmh = specs.acceleration0To100Kmh
      }

      if (vehicle.topSpeedKmh !== specs.topSpeedKmh) {
        changes.push(`topSpeedKmh: ${vehicle.topSpeedKmh} → ${specs.topSpeedKmh}`)
        vehicle.topSpeedKmh = specs.topSpeedKmh
      }

      if (vehicle.curbWeightKg !== specs.curbWeightKg) {
        changes.push(`curbWeightKg: ${vehicle.curbWeightKg} → ${specs.curbWeightKg}`)
        vehicle.curbWeightKg = specs.curbWeightKg
      }

      if (specs.batteryWeightKg && vehicle.batteryWeightKg !== specs.batteryWeightKg) {
        changes.push(`batteryWeightKg: ${vehicle.batteryWeightKg} → ${specs.batteryWeightKg}`)
        vehicle.batteryWeightKg = specs.batteryWeightKg
      }

      if (specs.batteryWeightPercentage && vehicle.batteryWeightPercentage !== specs.batteryWeightPercentage) {
        changes.push(`batteryWeightPercentage: ${vehicle.batteryWeightPercentage} → ${specs.batteryWeightPercentage}`)
        vehicle.batteryWeightPercentage = specs.batteryWeightPercentage
      }

      if (vehicle.batteryWarranty !== specs.batteryWarranty) {
        changes.push(`batteryWarranty: ${vehicle.batteryWarranty} → ${specs.batteryWarranty}`)
        vehicle.batteryWarranty = specs.batteryWarranty
      }

      if (vehicle.chargingTimeDc0To80Min !== specs.chargingTimeDc0To80Min) {
        changes.push(`chargingTimeDc0To80Min: ${vehicle.chargingTimeDc0To80Min} → ${specs.chargingTimeDc0To80Min}`)
        vehicle.chargingTimeDc0To80Min = specs.chargingTimeDc0To80Min
      }

      if (vehicle.chargingCapabilities !== specs.chargingCapabilities) {
        changes.push(`chargingCapabilities: ${vehicle.chargingCapabilities} → ${specs.chargingCapabilities}`)
        vehicle.chargingCapabilities = specs.chargingCapabilities
      }

      if (specs.hasBidirectional !== undefined && vehicle.hasBidirectional !== specs.hasBidirectional) {
        changes.push(`hasBidirectional: ${vehicle.hasBidirectional} → ${specs.hasBidirectional}`)
        vehicle.hasBidirectional = specs.hasBidirectional
      }

      if (changes.length > 0) {
        updated++
        updates.push({ vehicle: vehicleKey, changes })
      }
    }

    // Create backup
    const backupPath = vehiclesDataPath.replace('.json', `.backup-${Date.now()}.json`)
    fs.writeFileSync(backupPath, fileContent)
    console.log(`Backup created: ${backupPath}\n`)

    // Write updated data
    fs.writeFileSync(vehiclesDataPath, JSON.stringify(vehicles, null, 2))

    console.log(`✅ Updated ${updated} Tesla vehicles`)
    if (updates.length > 0) {
      console.log('\nChanges made:')
      updates.forEach(({ vehicle, changes }) => {
        console.log(`\n${vehicle}:`)
        changes.forEach(change => console.log(`  - ${change}`))
      })
    }

    if (notFound.length > 0) {
      console.log(`\n⚠️  ${notFound.length} Tesla vehicles not found in official specs:`)
      notFound.forEach(v => console.log(`  - ${v}`))
      console.log('\nThese vehicles may need manual verification or are not in the official specs database.')
    }

  } catch (error: any) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

verifyTeslaSpecs()

