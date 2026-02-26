import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import VehicleDetailClient from './page-client'
import type { Vehicle } from '@/types/vehicle'

interface PageProps {
  params: {
    id: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!vehicle) {
      return {
        title: 'Vehicle Not Found — battery.mom',
      }
    }

    const title = `${vehicle.name}${vehicle.modelTrim ? ` ${vehicle.modelTrim}` : ''} — battery.mom`
    const description = `${vehicle.name} specs: ${vehicle.rangeKm || vehicle.rangeWltpKm || 'N/A'} km range, ${vehicle.efficiencyKwhPer100km || 'N/A'} kWh/100km efficiency, ${vehicle.batteryCapacityKwh || 'N/A'} kWh battery. Local pricing and charging details for ${vehicle.country}.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
    }
  } catch (error) {
    return {
      title: 'Vehicle Details — battery.mom',
    }
  }
}

// Generate static params for all vehicles (for static generation)
export async function generateStaticParams() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      select: { id: true },
      where: { isAvailable: true },
    })

    return vehicles.map((vehicle) => ({
      id: vehicle.id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function VehicleDetailPage({ params }: PageProps) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!vehicle) {
      notFound()
    }

    return <VehicleDetailClient vehicle={vehicle as unknown as Vehicle} />
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    notFound()
  }
}