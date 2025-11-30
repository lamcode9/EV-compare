// @ts-nocheck
/**
 * Script to search for bidirectional capability (V2L/V2H) for all vehicles
 * and update vehicles-data.json with hasBidirectional field
 */

import fs from 'fs'
import path from 'path'

const vehiclesDataPath = path.join(__dirname, '../data/vehicles-data.json')

// Known bidirectional vehicles (to be expanded via web search)
const knownBidirectionalVehicles: Record<string, boolean> = {
  // Tesla - No V2L/V2H (as of 2025, except Cybertruck)
  'Tesla Model 3': false,
  'Tesla Model Y': false,
  'Tesla Model S': false,
  'Tesla Model X': false,
  'Tesla Cybertruck': true, // V2L, V2H, V2V
  
  // Hyundai/Kia - V2L available
  'Hyundai IONIQ 5': true,
  'Hyundai IONIQ 6': true,
  'Kia EV6': true,
  'Kia EV9': true,
  'Kia Niro EV': true,
  'Kia EV5': true,
  
  // Ford - V2L/V2H available
  'Ford F-150 Lightning': true, // V2H
  'Ford Mustang Mach-E': false, // No V2L
  
  // BYD - V2L available
  'BYD Atto 3': true,
  'BYD Dolphin': true,
  'BYD Seal': true,
  'BYD Han': true,
  'BYD Tang': true,
  'BYD Yuan Plus': true,
  'BYD Song Plus': true,
  
  // MG - V2L available
  'MG ZS EV': true,
  'MG 4': true,
  'MG Marvel R': true,
  
  // Nissan - V2L/V2G available
  'Nissan Leaf': true, // V2G pioneer
  'Nissan Ariya': true,
  
  // Mitsubishi - V2L available
  'Mitsubishi Outlander PHEV': true,
  
  // Volvo/Polestar - No V2L
  'Volvo XC40 Recharge': false,
  'Polestar 2': false,
  
  // BMW - No V2L
  'BMW iX': false,
  'BMW i4': false,
  'BMW iX3': false,
  'BMW iX1': false,
  
  // Mercedes - No V2L
  'Mercedes-Benz EQS': false,
  'Mercedes-Benz EQE': false,
  'Mercedes-Benz EQC': false,
  
  // Audi - No V2L (VW ID.4 has V2G/V2H but Audi doesn't)
  'Audi e-tron': false,
  'Audi Q4 e-tron': false,
  'Audi e-tron GT': false,
  
  // Volkswagen - V2G/V2H available
  'Volkswagen ID.4': true, // V2G, V2H
  'Volkswagen ID.3': false,
  
  // Porsche - No V2L
  'Porsche Taycan': false,
  
  // Rivian - V2L available
  'Rivian R1T': true,
  'Rivian R1S': true,
  
  // Lucid - V2V only (not V2L/V2H)
  'Lucid Air': false,
  
  // GWM/Ora - V2L available
  'GWM Ora Good Cat': true,
  'Ora Good Cat': true,
  'Ora Funky Cat': true,
  
  // Chery - V2L available
  'Chery Omoda 5': true,
  
  // Neta - V2L available
  'Neta V': true,
  'Neta U': true,
  
  // Wuling - V2L available
  'Wuling Air EV': true,
  'Wuling Binguo EV': true,
  
  // Geely - V2L available
  'Geely Geometry C': true,
  'Geely Geometry A': true,
  
  // XPeng - No V2L
  'XPeng P7': false,
  'XPeng G9': false,
  
  // NIO - No V2L
  'NIO ES8': false,
  'NIO ES6': false,
  
  // Zeekr - V2L available
  'Zeekr 001': true,
  
  // VinFast - V2L available
  'VinFast VF 8': true,
  'VinFast VF 9': true,
}

interface Vehicle {
  name: string
  modelTrim?: string
  country: string
  chargingCapabilities?: string
  hasBidirectional?: boolean | 'N/A'
  [key: string]: any
}

async function populateBidirectionalCapability() {
  try {
    console.log('Reading vehicles-data.json...')
    const fileContent = fs.readFileSync(vehiclesDataPath, 'utf-8')
    const vehicles: Vehicle[] = JSON.parse(fileContent)

    console.log(`Found ${vehicles.length} vehicles`)
    
    let updated = 0
    let notFound = 0

    for (const vehicle of vehicles) {
      const vehicleKey = vehicle.name
      const vehicleKeyLower = vehicleKey.toLowerCase()
      
      // Try exact match first
      let hasKnownValue = knownBidirectionalVehicles.hasOwnProperty(vehicleKey)
      let knownValue = hasKnownValue ? knownBidirectionalVehicles[vehicleKey] : null
      
      // Try partial matches for common variations
      if (!hasKnownValue) {
        for (const [key, value] of Object.entries(knownBidirectionalVehicles)) {
          const keyLower = key.toLowerCase()
          // Check if vehicle name contains known key or vice versa
          if (vehicleKeyLower.includes(keyLower) || keyLower.includes(vehicleKeyLower)) {
            knownValue = value
            hasKnownValue = true
            break
          }
        }
      }
      
      if (hasKnownValue && knownValue !== null) {
        vehicle.hasBidirectional = knownValue
        updated++
      } else {
        // Check if chargingCapabilities already mentions V2L/V2H
        const caps = (vehicle.chargingCapabilities || '').toLowerCase()
        if (caps.includes('v2l') || caps.includes('v2h') || caps.includes('vehicle-to-load') || caps.includes('vehicle-to-home')) {
          vehicle.hasBidirectional = true
          updated++
        } else if (caps.includes('bidirectional') || caps.includes('v2g')) {
          vehicle.hasBidirectional = true
          updated++
        } else {
          // Check vehicle name patterns
          if (vehicleKeyLower.includes('hyundai ioniq') || vehicleKeyLower.includes('ioniq 5') || vehicleKeyLower.includes('ioniq 6')) {
            vehicle.hasBidirectional = true
            updated++
          } else if (vehicleKeyLower.includes('kia ev') || vehicleKeyLower.includes('ev6') || vehicleKeyLower.includes('ev9') || vehicleKeyLower.includes('ev5')) {
            vehicle.hasBidirectional = true
            updated++
          } else if (vehicleKeyLower.includes('byd') || vehicleKeyLower.includes('atto') || vehicleKeyLower.includes('dolphin') || vehicleKeyLower.includes('seal') || vehicleKeyLower.includes('han') || vehicleKeyLower.includes('tang') || vehicleKeyLower.includes('yuan') || vehicleKeyLower.includes('song') || vehicleKeyLower.includes('sealion')) {
            vehicle.hasBidirectional = true
            updated++
          } else if (vehicleKeyLower.includes('mg ') || vehicleKeyLower.includes('mg4') || vehicleKeyLower.includes('mg zs')) {
            vehicle.hasBidirectional = true
            updated++
          } else if (vehicleKeyLower.includes('nissan leaf') || vehicleKeyLower.includes('nissan ariya')) {
            vehicle.hasBidirectional = true
            updated++
          } else if (vehicleKeyLower.includes('vinfast') || vehicleKeyLower.includes('vf ')) {
            vehicle.hasBidirectional = true
            updated++
          } else if (vehicleKeyLower.includes('neta')) {
            vehicle.hasBidirectional = true
            updated++
          } else if (vehicleKeyLower.includes('chery') || vehicleKeyLower.includes('omod') || vehicleKeyLower.includes('icar')) {
            vehicle.hasBidirectional = true
            updated++
          } else if (vehicleKeyLower.includes('zeekr')) {
            vehicle.hasBidirectional = true
            updated++
          } else if (vehicleKeyLower.includes('gwm') || vehicleKeyLower.includes('ora') || vehicleKeyLower.includes('great wall')) {
            vehicle.hasBidirectional = true
            updated++
          } else if (vehicleKeyLower.includes('wuling')) {
            vehicle.hasBidirectional = true
            updated++
          } else if (vehicleKeyLower.includes('tesla') && !vehicleKeyLower.includes('cybertruck')) {
            vehicle.hasBidirectional = false
            updated++
          } else if (vehicleKeyLower.includes('bmw') || vehicleKeyLower.includes('mercedes') || vehicleKeyLower.includes('audi') || vehicleKeyLower.includes('porsche') || vehicleKeyLower.includes('volvo') || vehicleKeyLower.includes('polestar') || vehicleKeyLower.includes('mini') || vehicleKeyLower.includes('smart')) {
            vehicle.hasBidirectional = false
            updated++
          } else {
            vehicle.hasBidirectional = 'N/A'
            notFound++
          }
        }
      }
    }

    // Create backup
    const backupPath = vehiclesDataPath.replace('.json', `.backup-${Date.now()}.json`)
    fs.writeFileSync(backupPath, fileContent)
    console.log(`Backup created: ${backupPath}`)

    // Write updated data
    fs.writeFileSync(vehiclesDataPath, JSON.stringify(vehicles, null, 2))
    
    console.log(`\n✅ Updated ${updated} vehicles with bidirectional capability`)
    console.log(`⚠️  ${notFound} vehicles marked as N/A (need manual research)`)
    console.log(`\nNext steps:`)
    console.log(`1. Review vehicles marked as N/A`)
    console.log(`2. Search web for: "[Vehicle Name] [Model Trim] V2L V2H bidirectional charging"`)
    console.log(`3. Update knownBidirectionalVehicles object in this script`)
    console.log(`4. Re-run this script`)

  } catch (error: any) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

populateBidirectionalCapability()

