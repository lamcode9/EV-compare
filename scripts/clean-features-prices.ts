/**
 * Script to remove price-related content from technologyFeatures in vehicles-data.json
 * Removes patterns like: (RM16,000 option), (RM16000), (SGD500 option), etc.
 */

import * as fs from 'fs'
import * as path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'vehicles-data.json')

function cleanFeatureString(features: string | null | undefined): string | null {
  if (!features) return features

  // First, clean the entire string to remove price parentheses (before splitting)
  // This handles cases where commas are inside parentheses like "(RM16, 000 option)"
  let cleaned = features
  
  // Remove parentheses containing currency codes with prices
  // Pattern: (RM16,000 option), (RM16, 000 option), (RM16000), etc.
  cleaned = cleaned.replace(/\s*\([^)]*?(?:RM|SGD|MYR|USD|EUR|GBP|IDR|PHP|THB|VND)\s*\d+[,\d\s]*\s*(?:option|Option|OPTION)?[^)]*?\)\s*/gi, '')
  
  // Remove any parentheses containing numbers followed by "option" (catch-all)
  cleaned = cleaned.replace(/\s*\([^)]*?\d+[,\d\s]+\s*(?:option|Option|OPTION)[^)]*?\)\s*/gi, '')
  
  // Now split, trim, and filter empty features
  return cleaned
    .split(',')
    .map((feature) => feature.trim())
    .filter((feature) => feature.length > 0)
    .join(', ')
}

async function main() {
  console.log('Reading vehicles-data.json...')
  const fileContent = fs.readFileSync(dataFilePath, 'utf-8')
  const vehicles = JSON.parse(fileContent)

  if (!Array.isArray(vehicles)) {
    console.error('Error: vehicles-data.json does not contain an array')
    process.exit(1)
  }

  console.log(`Processing ${vehicles.length} vehicles...`)

  let cleanedCount = 0
  let totalCleaned = 0

  for (const vehicle of vehicles) {
    if (vehicle.technologyFeatures) {
      const original = vehicle.technologyFeatures
      const cleaned = cleanFeatureString(vehicle.technologyFeatures)
      
      // Normalize both strings for comparison (trim and normalize whitespace)
      const normalizedOriginal = original.trim().replace(/\s+/g, ' ')
      const normalizedCleaned = cleaned?.trim().replace(/\s+/g, ' ') || ''
      
      if (normalizedOriginal !== normalizedCleaned) {
        vehicle.technologyFeatures = cleaned
        cleanedCount++
        totalCleaned++
        
        if (cleanedCount <= 10) {
          console.log(`\nVehicle: ${vehicle.name} ${vehicle.modelTrim || ''}`)
          console.log(`  Before: ${original}`)
          console.log(`  After:  ${cleaned}`)
        }
      } else if (original.includes('RM') || (original.includes('option') && original.includes('('))) {
        // Debug: show vehicles that should have been cleaned but weren't
        console.log(`\n⚠️  Not cleaned: ${vehicle.name} ${vehicle.modelTrim || ''}`)
        console.log(`  Features: ${original}`)
        console.log(`  Cleaned result: ${cleaned}`)
      }
    }
  }

  // Create backup
  const backupPath = dataFilePath.replace('.json', `.backup.${Date.now()}.json`)
  console.log(`\nCreating backup: ${backupPath}`)
  fs.writeFileSync(backupPath, fileContent, 'utf-8')

  // Write cleaned data
  console.log(`Writing cleaned data to ${dataFilePath}...`)
  fs.writeFileSync(dataFilePath, JSON.stringify(vehicles, null, 2), 'utf-8')

  console.log(`\n✅ Complete!`)
  console.log(`   - Vehicles processed: ${vehicles.length}`)
  console.log(`   - Vehicles with cleaned features: ${totalCleaned}`)
  console.log(`   - Backup saved to: ${backupPath}`)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})

