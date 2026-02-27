import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchVehiclesFromFile } from '@/lib/data-fetchers/file-data'
import { transformAndSaveVehicle } from '@/lib/data-fetchers/vehicle-transformer'

export const dynamic = 'force-dynamic'

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

    // Step 1: Fetch vehicles from file
    console.log('Reading vehicles from data/vehicles-data.json...')
    const fileVehicles = await fetchVehiclesFromFile()
    console.log(`Found ${fileVehicles.length} vehicles in file`)

    if (fileVehicles.length === 0) {
      console.warn('No vehicles found in data/vehicles-data.json')
    }

    // Step 2: Process and save all vehicles from file
    for (const vehicle of fileVehicles) {
      try {
        const existing = await prisma.vehicle.findFirst({
          where: {
            name: vehicle.name,
            country: vehicle.country,
          },
        })

        await transformAndSaveVehicle({
          name: vehicle.name,
          modelTrim: vehicle.modelTrim,
          rangeKm: vehicle.rangeKm,
          rangeWltpKm: vehicle.rangeWltpKm,
          rangeEpaKm: vehicle.rangeEpaKm,
          efficiencyKwhPer100km: vehicle.efficiencyKwhPer100km,
          powerRatingKw: vehicle.powerRatingKw,
          torqueNm: vehicle.torqueNm,
          batteryCapacityKwh: vehicle.batteryCapacityKwh,
          chargingTimeDc0To80Min: vehicle.chargingTimeDc0To80Min,
          acceleration0To100Kmh: vehicle.acceleration0To100Kmh,
          topSpeedKmh: vehicle.topSpeedKmh,
          grossVehicleWeightKg: vehicle.grossVehicleWeightKg,
          batteryWeightKg: vehicle.batteryWeightKg,
          curbWeightKg: vehicle.curbWeightKg,
          batteryWeightPercentage: vehicle.batteryWeightPercentage,
          batteryManufacturer: vehicle.batteryManufacturer,
          batteryTechnology: vehicle.batteryTechnology,
          batteryWarranty: vehicle.batteryWarranty,
          chargingCapabilities: vehicle.chargingCapabilities,
          technologyFeatures: vehicle.technologyFeatures,
          basePrice: vehicle.basePrice,
          optionPrices: vehicle.optionPrices,
          country: vehicle.country,
          isAvailable: vehicle.isAvailable,
        })

        vehiclesProcessed++
        if (existing) {
          vehiclesUpdated++
        } else {
          vehiclesCreated++
        }
      } catch (error) {
        const errorMsg = `Error processing ${vehicle.name} (${vehicle.country}): ${error instanceof Error ? error.message : 'Unknown'}`
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
