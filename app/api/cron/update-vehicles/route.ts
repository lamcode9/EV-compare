import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchVehiclesFromAPI } from '@/lib/data-fetchers/ev-api'
import { transformAndSaveVehicle } from '@/lib/data-fetchers/vehicle-transformer'
import { getPricingData } from '@/lib/data-fetchers/scraper'
import { scrapeVehicleOptions } from '@/lib/data-fetchers/options-scraper'

// This endpoint should be called by Vercel Cron
// Set up in vercel.json or Vercel dashboard
export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  let vehiclesProcessed = 0
  let vehiclesCreated = 0
  let vehiclesUpdated = 0
  let errors: string[] = []

  try {
    console.log('Starting vehicle data update cron job at:', new Date().toISOString())

    // Step 1: Fetch from API Ninjas (if API key is set)
    const apiKey = process.env.API_NINJAS_KEY
    let apiVehicles: any[] = []

    if (apiKey) {
      try {
        console.log('Fetching vehicles from API Ninjas...')
        apiVehicles = await fetchVehiclesFromAPI(apiKey)
        console.log(`Fetched ${apiVehicles.length} vehicles from API`)
      } catch (error) {
        const errorMsg = `API fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    } else {
      console.warn('API_NINJAS_KEY not set, skipping API fetch')
    }

    // Step 2: Get pricing data from scrapers (optional, can be slow)
    // We'll skip this for now to keep cron job fast and avoid rate limits
    // TODO: Implement scraping when needed
    // const sgPricing = await getPricingData('SG')
    // const myPricing = await getPricingData('MY')

    // Step 3: Process and save vehicles for Singapore
    console.log('Processing Singapore vehicles...')
    const scrapeOptions = process.env.SCRAPE_OPTIONS === 'true' // Optional: set to enable option scraping
    
    for (const apiVehicle of apiVehicles) {
      try {
        const existing = await prisma.vehicle.findFirst({
          where: {
            name: { contains: apiVehicle.name.split(' ')[0], mode: 'insensitive' },
            country: 'SG',
          },
        })

        // Optionally scrape options from manufacturer websites
        let optionPrices: Array<{ name: string; price: number }> = []
        if (scrapeOptions) {
          try {
            console.log(`Scraping options for ${apiVehicle.name}...`)
            optionPrices = await scrapeVehicleOptions(apiVehicle.name, apiVehicle.modelTrim, 'SG')
            console.log(`Found ${optionPrices.length} options for ${apiVehicle.name}`)
          } catch (error) {
            console.warn(`Failed to scrape options for ${apiVehicle.name}:`, error)
            // Continue without options if scraping fails
          }
        }

        await transformAndSaveVehicle({
          name: apiVehicle.name,
          modelTrim: apiVehicle.modelTrim,
          rangeKm: apiVehicle.rangeKm,
          rangeWltpKm: apiVehicle.rangeWltpKm,
          rangeEpaKm: apiVehicle.rangeEpaKm,
          efficiencyKwhPer100km: apiVehicle.efficiencyKwhPer100km,
          powerRatingKw: apiVehicle.powerRatingKw,
          batteryCapacityKwh: apiVehicle.batteryCapacityKwh,
          chargingTimeDc0To80Min: apiVehicle.chargingTimeDc0To80Min,
          acceleration0To100Kmh: apiVehicle.acceleration0To100Kmh,
          optionPrices,
          country: 'SG',
        })

        vehiclesProcessed++
        if (existing) {
          vehiclesUpdated++
        } else {
          vehiclesCreated++
        }
      } catch (error) {
        const errorMsg = `Error processing ${apiVehicle.name}: ${error instanceof Error ? error.message : 'Unknown'}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    // Step 4: Process and save vehicles for Malaysia
    console.log('Processing Malaysia vehicles...')
    for (const apiVehicle of apiVehicles) {
      try {
        const existing = await prisma.vehicle.findFirst({
          where: {
            name: { contains: apiVehicle.name.split(' ')[0], mode: 'insensitive' },
            country: 'MY',
          },
        })

        // Optionally scrape options from manufacturer websites
        let optionPrices: Array<{ name: string; price: number }> = []
        if (scrapeOptions) {
          try {
            console.log(`Scraping options for ${apiVehicle.name}...`)
            optionPrices = await scrapeVehicleOptions(apiVehicle.name, apiVehicle.modelTrim, 'MY')
            console.log(`Found ${optionPrices.length} options for ${apiVehicle.name}`)
          } catch (error) {
            console.warn(`Failed to scrape options for ${apiVehicle.name}:`, error)
            // Continue without options if scraping fails
          }
        }

        await transformAndSaveVehicle({
          name: apiVehicle.name,
          modelTrim: apiVehicle.modelTrim,
          rangeKm: apiVehicle.rangeKm,
          rangeWltpKm: apiVehicle.rangeWltpKm,
          rangeEpaKm: apiVehicle.rangeEpaKm,
          efficiencyKwhPer100km: apiVehicle.efficiencyKwhPer100km,
          powerRatingKw: apiVehicle.powerRatingKw,
          batteryCapacityKwh: apiVehicle.batteryCapacityKwh,
          chargingTimeDc0To80Min: apiVehicle.chargingTimeDc0To80Min,
          acceleration0To100Kmh: apiVehicle.acceleration0To100Kmh,
          optionPrices,
          country: 'MY',
        })

        vehiclesProcessed++
        if (existing) {
          vehiclesUpdated++
        } else {
          vehiclesCreated++
        }
      } catch (error) {
        const errorMsg = `Error processing ${apiVehicle.name}: ${error instanceof Error ? error.message : 'Unknown'}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    // Step 5: Mark vehicles as unavailable if not updated in last 7 days
    // (Optional: helps clean up discontinued models)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const outdatedCount = await prisma.vehicle.updateMany({
      where: {
        updatedAt: { lt: sevenDaysAgo },
        isAvailable: true,
      },
      data: {
        isAvailable: false,
      },
    })

    const duration = Date.now() - startTime

    // Log to audit table
    await prisma.auditLog.create({
      data: {
        action: 'CRON_RUN',
        changes: {
          timestamp: new Date().toISOString(),
          vehiclesProcessed,
          vehiclesCreated,
          vehiclesUpdated,
          outdatedMarked: outdatedCount.count,
          errors: errors.length > 0 ? errors : undefined,
          durationMs: duration,
        },
      },
    })

    console.log(`Cron job completed in ${duration}ms`)
    console.log(`Processed: ${vehiclesProcessed}, Created: ${vehiclesCreated}, Updated: ${vehiclesUpdated}`)

    return NextResponse.json({
      success: true,
      message: 'Cron job executed successfully',
      timestamp: new Date().toISOString(),
      stats: {
        vehiclesProcessed,
        vehiclesCreated,
        vehiclesUpdated,
        outdatedMarked: outdatedCount.count,
        errors: errors.length,
        durationMs: duration,
      },
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Cron job error:', error)

    await prisma.auditLog.create({
      data: {
        action: 'CRON_ERROR',
        changes: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          stack: error instanceof Error ? error.stack : undefined,
        },
      },
    })

    return NextResponse.json(
      {
        error: 'Cron job failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
