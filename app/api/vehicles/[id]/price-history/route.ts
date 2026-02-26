import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/vehicles/[id]/price-history
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        country: true,
        basePriceLocalCurrency: true,
        priceSnapshots: {
          orderBy: { snapshotDate: 'asc' },
          select: {
            basePrice: true,
            otrPrice: true,
            currency: true,
            snapshotDate: true,
          },
        },
      },
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Include current price as the latest data point
    const history = [
      ...vehicle.priceSnapshots.map(s => ({
        date: s.snapshotDate.toISOString().split('T')[0],
        basePrice: s.basePrice,
        otrPrice: s.otrPrice,
        currency: s.currency,
      })),
    ]

    // Calculate price change metrics
    const firstPrice = history.length > 0 ? history[0].basePrice : vehicle.basePriceLocalCurrency
    const currentPrice = vehicle.basePriceLocalCurrency
    const priceChange = firstPrice && currentPrice ? currentPrice - firstPrice : null
    const priceChangePercent = firstPrice && priceChange ? (priceChange / firstPrice) * 100 : null

    return NextResponse.json({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      country: vehicle.country,
      currentPrice: vehicle.basePriceLocalCurrency,
      history,
      metrics: {
        priceChange,
        priceChangePercent: priceChangePercent ? Math.round(priceChangePercent * 10) / 10 : null,
        dataPoints: history.length,
        trackingSince: history.length > 0 ? history[0].date : null,
      },
    })
  } catch (error) {
    console.error('Error fetching price history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
