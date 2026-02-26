import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CURRENCY_BY_COUNTRY } from '@/lib/constants'

// Called by Vercel Cron to take monthly price snapshots of all vehicles
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  let snapshotsCreated = 0
  let errors: string[] = []

  try {
    console.log('Starting price snapshot cron at:', new Date().toISOString())

    // Get all available vehicles with a base price
    const vehicles = await prisma.vehicle.findMany({
      where: {
        isAvailable: true,
        basePriceLocalCurrency: { not: null },
      },
      select: {
        id: true,
        name: true,
        country: true,
        basePriceLocalCurrency: true,
        onTheRoadPriceLocalCurrency: true,
      },
    })

    console.log(`Found ${vehicles.length} vehicles with prices`)

    for (const vehicle of vehicles) {
      try {
        // Check if a snapshot already exists this month
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const existingSnapshot = await prisma.priceSnapshot.findFirst({
          where: {
            vehicleId: vehicle.id,
            snapshotDate: { gte: startOfMonth },
          },
        })

        if (existingSnapshot) {
          continue // Already have a snapshot this month
        }

        await prisma.priceSnapshot.create({
          data: {
            vehicleId: vehicle.id,
            basePrice: vehicle.basePriceLocalCurrency!,
            otrPrice: vehicle.onTheRoadPriceLocalCurrency,
            currency: CURRENCY_BY_COUNTRY[vehicle.country] || 'USD',
          },
        })

        snapshotsCreated++
      } catch (error) {
        const msg = `Error snapshotting ${vehicle.name}: ${error instanceof Error ? error.message : 'Unknown'}`
        console.error(msg)
        errors.push(msg)
      }
    }

    const duration = Date.now() - startTime

    await prisma.auditLog.create({
      data: {
        action: 'PRICE_SNAPSHOT',
        changes: {
          timestamp: new Date().toISOString(),
          snapshotsCreated,
          totalVehicles: vehicles.length,
          errors: errors.length > 0 ? errors : undefined,
          durationMs: duration,
        },
      },
    })

    console.log(`Price snapshot completed: ${snapshotsCreated} snapshots in ${duration}ms`)

    return NextResponse.json({
      success: true,
      snapshotsCreated,
      totalVehicles: vehicles.length,
      durationMs: duration,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Price snapshot cron error:', error)
    return NextResponse.json(
      { error: 'Price snapshot cron failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
