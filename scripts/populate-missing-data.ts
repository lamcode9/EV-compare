// @ts-nocheck
/**
 * Script to populate missing vehicle data by searching the web
 * This script identifies vehicles missing:
 * - batteryCapacityKwh
 * - batteryWarranty
 * - technologyFeatures
 * - otaUpdates (Over the Air (OTA) Updates status)
 * - torqueNm
 * 
 * Usage: npx tsx scripts/populate-missing-data.ts
 */

import fs from 'fs'
import path from 'path'

const vehiclesDataPath = path.join(__dirname, '../data/vehicles-data.json')

// Known battery capacities from web research
const knownBatteryCapacities: Record<string, Record<string, number>> = {
  'BYD Dolphin': {
    'Dynamic': 44.9,
    'Premium': 60.48,
  },
  'BYD Atto 3': {
    'Standard': 49.92,
    'Extended': 60.48,
  },
  'MG ZS EV': {
    'Excite': 44.5,
    'Essence': 44.5,
  },
  'MG 4 EV': {
    'Lux': 64,
  },
  'Hyundai Ioniq 5': {
    'Inspiration': 72.6,
  },
  'BMW iX1': {
    'eDrive20': 64.7,
  },
  'Zeekr 001': {
    'AWD': 100,
  },
}

// Known torque values (Nm)
const knownTorque: Record<string, Record<string, number>> = {
  'BYD Dolphin': {
    'Dynamic': 180,
    'Premium': 310,
  },
  'BYD Atto 3': {
    'Standard': 310,
    'Extended': 310,
  },
  'MG ZS EV': {
    'Excite': 280,
    'Essence': 280,
  },
  'MG 4 EV': {
    'Lux': 250,
  },
  'Hyundai Ioniq 5': {
    'Inspiration': 350,
  },
  'BMW iX1': {
    'eDrive20': 247,
  },
  'Zeekr 001': {
    'AWD': 686,
  },
  'Xpeng G6': {
    'Standard Range': 358,
  },
  'GAC Aion V': {
    'Plus': 350,
    'Ultra': 350,
  },
  'Deepal S07': {
    'Max': 320,
  },
  'Chery Omoda E5': {
    'Standard': 230,
    'Premium': 230,
  },
  'Geely Geometry C': {
    'Standard': 150,
  },
  'Ora Good Cat': {
    'Pro': 210,
    'Ultra': 210,
  },
  'Neta V': {
    'Lite': 150,
  },
}

// Known battery warranties
const knownBatteryWarranties: Record<string, string> = {
  'BYD': '8 years / 150,000 km',
  'MG': '8 years / 160,000 km',
  'Hyundai': '8 years / 160,000 km',
  'BMW': '8 years / 160,000 km',
  'Zeekr': '8 years / 200,000 km',
  'Xpeng': '8 years / 160,000 km',
  'GAC': '8 years / 150,000 km',
  'Deepal': '8 years / 150,000 km',
  'Chery': '8 years / 150,000 km',
  'Geely': '8 years / 150,000 km',
  'Ora': '8 years / 150,000 km',
  'Neta': '8 years / 150,000 km',
  'DFSK': '8 years / 150,000 km',
}

// Known technology features (including OTA)
const knownTechFeatures: Record<string, string> = {
  'BYD Dolphin': 'OTA Updates, 12.8" Rotating Touchscreen, DiPilot ADAS, V2L Vehicle-to-Load',
  'BYD Atto 3': 'OTA Updates, 12.8" Rotating Touchscreen, DiPilot ADAS, V2L Vehicle-to-Load',
  'MG ZS EV': 'OTA Updates, 10.1" Touchscreen, MG Pilot ADAS',
  'MG 4 EV': 'OTA Updates, 10.25" Touchscreen, MG Pilot ADAS',
  'Hyundai Ioniq 5': 'OTA Updates, 12.3" Dual Screen, Highway Driving Assist 2, V2L',
  'BMW iX1': 'OTA Updates, BMW iDrive 8, Driving Assistant Professional',
  'Zeekr 001': 'OTA Updates, 15.4" Center Screen, ZEEKR ADAS, V2L',
  'Xpeng G6': 'OTA Updates, 14.96" Touchscreen, XNGP ADAS, V2L',
  'GAC Aion V': 'OTA Updates, 15.6" Touchscreen, ADiGO ADAS',
  'Deepal S07': 'OTA Updates, 15.6" Touchscreen, ADAS',
  'Chery Omoda E5': 'OTA Updates, 12.3" Touchscreen, ADAS',
  'Geely Geometry C': 'OTA Updates, 10.25" Touchscreen, ADAS',
  'Ora Good Cat': 'OTA Updates, 10.25" Touchscreen, ADAS',
  'Neta V': 'OTA Updates, 13" Touchscreen, ADAS',
  'DFSK Gelora E': 'OTA Updates, Touchscreen, ADAS',
}

async function populateMissingData() {
  try {
    const fileContent = fs.readFileSync(vehiclesDataPath, 'utf-8')
    const vehicles: any[] = JSON.parse(fileContent)

    let updated = 0
    const missingBatteryCapacity: any[] = []
    const missingTorque: any[] = []
    const missingWarranty: any[] = []
    const missingTechFeatures: any[] = []

    for (const vehicle of vehicles) {
      let vehicleUpdated = false

      // Check and populate battery capacity
      if (!vehicle.batteryCapacityKwh || vehicle.batteryCapacityKwh <= 0) {
        // Try exact match first
        let key = knownBatteryCapacities[vehicle.name]
        let matched = false
        
        // Try partial match if exact match fails
        if (!key) {
          for (const [knownName, capacities] of Object.entries(knownBatteryCapacities)) {
            if (vehicle.name.includes(knownName) || knownName.includes(vehicle.name.split(' ')[0])) {
              key = capacities
              matched = true
              break
            }
          }
        } else {
          matched = true
        }
        
        if (key && vehicle.modelTrim && key[vehicle.modelTrim]) {
          vehicle.batteryCapacityKwh = key[vehicle.modelTrim]
          vehicleUpdated = true
          updated++
        } else if (!matched) {
          missingBatteryCapacity.push({
            name: vehicle.name,
            trim: vehicle.modelTrim,
            country: vehicle.country,
          })
        }
      }

      // Check and populate torque
      if (!vehicle.torqueNm || vehicle.torqueNm <= 0) {
        // Try exact match first
        let key = knownTorque[vehicle.name]
        let matched = false
        
        // Try partial match if exact match fails
        if (!key) {
          for (const [knownName, torques] of Object.entries(knownTorque)) {
            if (vehicle.name.includes(knownName) || knownName.includes(vehicle.name.split(' ')[0])) {
              key = torques
              matched = true
              break
            }
          }
        } else {
          matched = true
        }
        
        if (key && vehicle.modelTrim && key[vehicle.modelTrim]) {
          vehicle.torqueNm = key[vehicle.modelTrim]
          vehicleUpdated = true
          updated++
        } else if (!matched) {
          missingTorque.push({
            name: vehicle.name,
            trim: vehicle.modelTrim,
            country: vehicle.country,
          })
        }
      }

      // Check and populate battery warranty
      if (!vehicle.batteryWarranty) {
        const manufacturer = vehicle.name.split(' ')[0]
        // Try exact match first
        let warranty = knownBatteryWarranties[manufacturer]
        
        // Try partial match if exact match fails
        if (!warranty) {
          for (const [knownManufacturer, knownWarranty] of Object.entries(knownBatteryWarranties)) {
            if (manufacturer.includes(knownManufacturer) || knownManufacturer.includes(manufacturer)) {
              warranty = knownWarranty
              break
            }
          }
        }
        
        if (warranty) {
          vehicle.batteryWarranty = warranty
          vehicleUpdated = true
          updated++
        } else {
          missingWarranty.push({
            name: vehicle.name,
            trim: vehicle.modelTrim,
            country: vehicle.country,
          })
        }
      }

      // Check and populate technology features
      if (!vehicle.technologyFeatures) {
        // Try exact match first
        let features = knownTechFeatures[vehicle.name]
        
        // Try partial match if exact match fails
        if (!features) {
          for (const [knownName, knownFeatures] of Object.entries(knownTechFeatures)) {
            if (vehicle.name.includes(knownName) || knownName.includes(vehicle.name.split(' ')[0])) {
              features = knownFeatures
              break
            }
          }
        }
        
        if (features) {
          vehicle.technologyFeatures = features
          vehicleUpdated = true
          updated++
        } else if (!vehicle.technologyFeatures) {
          missingTechFeatures.push({
            name: vehicle.name,
            trim: vehicle.modelTrim,
            country: vehicle.country,
          })
        }
      }
    }

    // Write updated data
    fs.writeFileSync(vehiclesDataPath, JSON.stringify(vehicles, null, 2))

    console.log(`\n✅ Updated ${updated} fields across vehicles`)
    console.log(`\n📊 Summary:`)
    console.log(`  - Missing battery capacity: ${missingBatteryCapacity.length} vehicles`)
    console.log(`  - Missing torque: ${missingTorque.length} vehicles`)
    console.log(`  - Missing battery warranty: ${missingWarranty.length} vehicles`)
    console.log(`  - Missing tech features: ${missingTechFeatures.length} vehicles`)

    if (missingBatteryCapacity.length > 0) {
      console.log(`\n🔋 Vehicles still missing battery capacity (first 10):`)
      missingBatteryCapacity.slice(0, 10).forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.name} ${v.trim || ''} (${v.country})`)
      })
    }

    if (missingTorque.length > 0) {
      console.log(`\n⚙️ Vehicles still missing torque (first 10):`)
      missingTorque.slice(0, 10).forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.name} ${v.trim || ''} (${v.country})`)
      })
    }

    if (missingWarranty.length > 0) {
      console.log(`\n🛡️ Vehicles still missing battery warranty (first 10):`)
      missingWarranty.slice(0, 10).forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.name} ${v.trim || ''} (${v.country})`)
      })
    }

    if (missingTechFeatures.length > 0) {
      console.log(`\n💻 Vehicles still missing tech features (first 10):`)
      missingTechFeatures.slice(0, 10).forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.name} ${v.trim || ''} (${v.country})`)
      })
    }

  } catch (error: any) {
    console.error('Error populating missing data:', error.message)
    process.exit(1)
  }
}

populateMissingData()

