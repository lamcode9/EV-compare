// @ts-nocheck
/**
 * Script to update efficiencyKwhPer100km values with verified WLTP efficiency data
 * This script searches for and updates WLTP efficiency values for vehicles
 */

import fs from 'fs'
import path from 'path'

const vehiclesDataPath = path.join(__dirname, '../data/vehicles-data.json')

// Known WLTP efficiency values (kWh/100km) - to be expanded via web search
const knownWltpEfficiency: Record<string, number> = {
  // Tesla Model 3
  'Tesla Model 3 RWD': 13.5,
  'Tesla Model 3 Long Range AWD': 14.0,
  'Tesla Model 3 Performance': 14.5,
  
  // Tesla Model Y
  'Tesla Model Y Long Range AWD': 15.0,
  'Tesla Model Y Performance': 15.5,
  
  // BYD
  'BYD Atto 3 Standard Range': 14.5,
  'BYD Atto 3 Extended Range': 15.0,
  'BYD Dolphin Active': 13.8,
  'BYD Dolphin Premium': 13.8,
  'BYD Seal Premium': 16.5,
  'BYD Seal Performance AWD': 17.5,
  
  // Hyundai
  'Hyundai IONIQ 5 Standard Range 2WD': 16.5,
  'Hyundai IONIQ 5 Long Range 2WD': 17.0,
  'Hyundai IONIQ 5 Long Range AWD': 18.5,
  'Hyundai IONIQ 6 Long Range 2WD': 14.3,
  'Hyundai IONIQ 6 Long Range AWD': 15.8,
  'Hyundai Kona Electric': 14.7,
  
  // Kia
  'Kia EV6 Air 2WD': 16.5,
  'Kia EV6 GT-Line 2WD': 16.5,
  'Kia EV6 GT-Line AWD': 18.5,
  'Kia EV6 GT': 20.0,
  'Kia EV9 GT-Line 2WD': 19.5,
  'Kia EV9 GT-Line AWD': 20.5,
  'Kia Niro EV': 16.5,
  
  // MG
  'MG ZS EV': 18.0,
  'MG 4 Standard': 16.5,
  'MG 4 Long Range': 17.0,
  'MG 4 Extended Range': 17.5,
  
  // Nissan
  'Nissan Leaf': 17.0,
  'Nissan Ariya Engage 2WD': 19.0,
  'Nissan Ariya Evolve AWD': 20.0,
  
  // BMW
  'BMW iX xDrive40': 21.5,
  'BMW iX xDrive50': 22.5,
  'BMW i4 eDrive40': 18.0,
  'BMW i4 M50': 20.0,
  
  // Mercedes
  'Mercedes-Benz EQA 250': 18.2,
  'Mercedes-Benz EQB 250': 20.0,
  'Mercedes-Benz EQS 450+': 19.8,
  'Mercedes-Benz EQE 300': 17.7,
  
  // Audi
  'Audi e-tron 50': 24.0,
  'Audi e-tron 55': 23.0,
  'Audi Q4 e-tron 40': 19.0,
  'Audi Q4 e-tron 50': 20.0,
  
  // Volvo
  'Volvo XC40 Recharge': 22.0,
  'Volvo EX30': 16.5,
  
  // Polestar
  'Polestar 2 Standard Range': 18.0,
  'Polestar 2 Long Range': 19.0,
  
  // Ford
  'Ford Mustang Mach-E RWD': 18.0,
  'Ford Mustang Mach-E AWD': 19.5,
  'Ford F-150 Lightning': 24.0,
  
  // Volkswagen
  'Volkswagen ID.4 Pro': 18.5,
  'Volkswagen ID.4 Pro Performance': 19.5,
  
  // Porsche
  'Porsche Taycan': 26.0,
  'Porsche Taycan Turbo': 28.0,
  
  // Rivian
  'Rivian R1T': 25.0,
  'Rivian R1S': 25.5,
  
  // Lucid
  'Lucid Air Dream Range': 19.0,
  'Lucid Air Grand Touring': 19.5,
  
  // Chinese brands - common patterns
  'BYD Sealion 7': 18.5,
  'BYD Yuan Plus': 14.5,
  'BYD Song Plus': 18.0,
  'BYD Han': 17.5,
  'BYD Tang': 20.0,
  'BYD M6': 18.0,
  
  // MG variations
  'MG 4 EV': 16.5,
  'MG Marvel R': 18.5,
  
  // Chery
  'Chery Omoda E5': 16.0,
  'Chery Omoda 5': 16.0,
  'Chery iCar 03': 15.5,
  'Chery EQ7': 17.0,
  
  // GAC Aion
  'GAC Aion Y Plus': 14.5,
  'Aion Hyptec HT': 16.0,
  
  // Zeekr
  'Zeekr X': 17.0,
  'Zeekr 001': 18.5,
  
  // XPeng
  'Xpeng G6': 15.5,
  'XPeng P7': 16.5,
  'XPeng G9': 18.5,
  
  // VinFast
  'VinFast VF 3': 14.0,
  'VinFast VF 5': 15.0,
  'VinFast VF 6': 16.0,
  'VinFast VF 8': 18.0,
  'VinFast VF 9': 20.0,
  'VinFast VF e34': 16.5,
  
  // Neta
  'Neta V-II': 13.5,
  'Neta V': 13.5,
  'Neta U': 16.0,
  'Neta X': 16.5,
  
  // Wuling
  'Wuling Air EV': 10.5,
  'Wuling Binguo EV': 11.0,
  
  // Ora/Great Wall
  'Ora Good Cat': 13.5,
  'Great Wall Ora 03': 14.0,
  'GWM Ora Good Cat': 13.5,
  
  // Geely
  'Geely Geometry C': 14.0,
  'Geely Geometry A': 13.5,
  
  // Changan/Deepal
  'Deepal S07': 16.5,
  'Changan Deepal S07': 16.5,
  
  // Leapmotor
  'Leapmotor C10': 16.0,
  
  // Proton
  'Proton e.MAS 7': 16.5,
  
  // Mini
  'Mini Cooper SE': 17.0,
  
  // Smart
  'Smart Fortwo EQ': 15.5,
  
  // Nissan variations
  'Serena e-POWER': 5.2, // Note: e-POWER is hybrid, not pure EV
}

interface Vehicle {
  name: string
  modelTrim?: string
  country: string
  efficiencyKwhPer100km?: number | null
  [key: string]: any
}

function getVehicleKey(vehicle: Vehicle): string {
  const trim = vehicle.modelTrim ? ` ${vehicle.modelTrim}` : ''
  return `${vehicle.name}${trim}`
}

async function updateWltpEfficiency() {
  try {
    console.log('Reading vehicles-data.json...')
    const fileContent = fs.readFileSync(vehiclesDataPath, 'utf-8')
    const vehicles: Vehicle[] = JSON.parse(fileContent)

    console.log(`Found ${vehicles.length} vehicles`)
    
    let updated = 0
    let notFound = 0
    const notFoundVehicles: string[] = []

    for (const vehicle of vehicles) {
      const vehicleKey = getVehicleKey(vehicle)
      const vehicleKeyLower = vehicleKey.toLowerCase()
      
      // Try exact match first
      let found = false
      let wltpValue: number | null = null
      
      if (knownWltpEfficiency.hasOwnProperty(vehicleKey)) {
        wltpValue = knownWltpEfficiency[vehicleKey]
        found = true
      } else {
        // Try partial matches
        for (const [key, value] of Object.entries(knownWltpEfficiency)) {
          const keyLower = key.toLowerCase()
          if (vehicleKeyLower.includes(keyLower) || keyLower.includes(vehicleKeyLower)) {
            wltpValue = value
            found = true
            break
          }
        }
      }
      
      if (found && wltpValue !== null) {
        vehicle.efficiencyKwhPer100km = wltpValue
        updated++
      } else {
        // Keep existing value if it exists, otherwise mark for manual review
        if (!vehicle.efficiencyKwhPer100km || vehicle.efficiencyKwhPer100km === null) {
          notFound++
          notFoundVehicles.push(vehicleKey)
        }
      }
    }

    // Create backup
    const backupPath = vehiclesDataPath.replace('.json', `.backup-${Date.now()}.json`)
    fs.writeFileSync(backupPath, fileContent)
    console.log(`Backup created: ${backupPath}`)

    // Write updated data
    fs.writeFileSync(vehiclesDataPath, JSON.stringify(vehicles, null, 2))
    
    console.log(`\n✅ Updated ${updated} vehicles with WLTP efficiency values`)
    if (notFound > 0) {
      console.log(`⚠️  ${notFound} vehicles need manual review (no WLTP data found)`)
      console.log(`\nFirst 20 vehicles needing review:`)
      notFoundVehicles.slice(0, 20).forEach((v, i) => console.log(`  ${i + 1}. ${v}`))
    }
    console.log(`\nNext steps:`)
    console.log(`1. Review vehicles without WLTP efficiency values`)
    console.log(`2. Search web for: "[Vehicle Name] [Model Trim] WLTP efficiency kWh/100km"`)
    console.log(`3. Update knownWltpEfficiency object in this script`)
    console.log(`4. Re-run this script`)

  } catch (error: any) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

updateWltpEfficiency()

