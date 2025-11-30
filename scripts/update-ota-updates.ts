// @ts-nocheck
/**
 * Script to update OTA Updates field in database from vehicles-data.json
 * Usage: npx tsx scripts/update-ota-updates.ts
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function updateOTAUpdates() {
  const dataPath = path.join(process.cwd(), 'data', 'vehicles-data.json')
  console.log(`Reading from: ${dataPath}`)
  
  if (!fs.existsSync(dataPath)) {
    console.error(`File not found: ${dataPath}`)
    process.exit(1)
  }
  
  const vehicles = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  console.log(`Found ${vehicles.length} vehicles in JSON file`)
  
  let updated = 0
  let notFound = 0
  let errors = 0
  
  for (const vehicle of vehicles) {
    try {
      if (!vehicle.otaUpdates) {
        console.warn(`Vehicle ${vehicle.name} ${vehicle.modelTrim || ''} missing otaUpdates field`)
        continue
      }
      
      // Find vehicle by name, modelTrim, and country
      const updatedVehicle = await prisma.vehicle.updateMany({
        where: {
          name: vehicle.name,
          modelTrim: vehicle.modelTrim || null,
          country: vehicle.country,
        },
        data: {
          otaUpdates: vehicle.otaUpdates,
        },
      })
      
      if (updatedVehicle.count > 0) {
        updated += updatedVehicle.count
        console.log(`✓ Updated ${vehicle.name} ${vehicle.modelTrim || ''} (${vehicle.country}): ${vehicle.otaUpdates}`)
      } else {
        notFound++
        console.warn(`✗ Not found: ${vehicle.name} ${vehicle.modelTrim || ''} (${vehicle.country})`)
      }
    } catch (error) {
      errors++
      console.error(`Error updating ${vehicle.name} ${vehicle.modelTrim || ''}:`, error.message)
    }
  }
  
  console.log(`\nUpdate complete:`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Not found: ${notFound}`)
  console.log(`  Errors: ${errors}`)
}

updateOTAUpdates()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

