'use client'

import { useState } from 'react'
import { useVehicleStore } from '@/store/VehicleStore'
import { Vehicle } from '@/types/vehicle'
import StatsGrid from './StatsGrid'

interface VehicleCardProps {
  vehicle: Vehicle
}

/**
 * Extract manufacturer name from vehicle name
 * Examples: "Tesla Model Y" -> "Tesla", "BYD Atto 3" -> "BYD"
 */
const getManufacturer = (vehicleName: string): string => {
  const name = vehicleName.trim()
  const firstSpace = name.indexOf(' ')
  return firstSpace > 0 ? name.substring(0, firstSpace) : name
}

/**
 * Get manufacturer logo styling based on manufacturer name
 * Returns a styled div with manufacturer initial/name as a logo placeholder
 */
const ManufacturerLogo = ({ manufacturer }: { manufacturer: string }) => {
  const logoStyle: Record<string, { bg: string; text: string }> = {
    Tesla: { bg: 'bg-red-600', text: 'text-white' },
    BYD: { bg: 'bg-blue-600', text: 'text-white' },
    Hyundai: { bg: 'bg-slate-800', text: 'text-white' },
    Kia: { bg: 'bg-emerald-600', text: 'text-white' },
    BMW: { bg: 'bg-blue-800', text: 'text-white' },
    Mercedes: { bg: 'bg-gray-900', text: 'text-white' },
    Audi: { bg: 'bg-gray-800', text: 'text-white' },
    Porsche: { bg: 'bg-red-800', text: 'text-white' },
    Nissan: { bg: 'bg-red-700', text: 'text-white' },
    Toyota: { bg: 'bg-red-600', text: 'text-white' },
  }

  const style = logoStyle[manufacturer] || { bg: 'bg-gray-600', text: 'text-white' }
  const initial = manufacturer.substring(0, 1).toUpperCase()

  return (
    <div className={`${style.bg} ${style.text} w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm`}>
      {initial}
    </div>
  )
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { removeVehicle } = useVehicleStore()

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleToggleOption = (name: string) => {
    setSelectedOptions((prev) =>
      prev.includes(name) ? prev.filter((opt) => opt !== name) : [...prev, name]
    )
  }

  const manufacturer = getManufacturer(vehicle.name)

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
          <div className="flex items-start gap-4">
            {/* Manufacturer Logo */}
            <div className="flex-shrink-0 mt-1">
              <ManufacturerLogo manufacturer={manufacturer} />
            </div>
            {/* Vehicle Info */}
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
                {vehicle.name}
              </h2>
              <p className="text-base text-gray-600">{vehicle.modelTrim}</p>
            </div>
          </div>
          <button
            onClick={() => removeVehicle(vehicle.id)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
            aria-label={`Remove ${vehicle.name} from comparison`}
          >
            Remove
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <StatsGrid
          vehicle={vehicle}
          selectedOptions={selectedOptions}
          onToggleOption={handleToggleOption}
        />
      </div>
    </div>
  )
}

