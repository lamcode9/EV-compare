'use client'

import { create } from 'zustand'
import { Vehicle } from '@/types/vehicle'

interface VehicleState {
  selectedCountry: 'SG' | 'MY' | 'ID' | 'PH' | 'TH' | 'VN' | null
  selectedVehicles: Vehicle[]
  vehicles: Vehicle[]
  setSelectedCountry: (country: 'SG' | 'MY' | 'ID' | 'PH' | 'TH' | 'VN' | null) => void
  addVehicle: (vehicle: Vehicle) => void
  removeVehicle: (vehicleId: string) => void
  clearAll: () => void
  setVehicles: (vehicles: Vehicle[]) => void
  isVehicleSelected: (vehicleId: string) => boolean
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  selectedCountry: null,
  selectedVehicles: [],
  vehicles: [],
  
  setSelectedCountry: (country) => {
    set({ selectedCountry: country, selectedVehicles: [] })
  },
  
  addVehicle: (vehicle) => {
    const current = get().selectedVehicles
    if (current.length < 4 && !current.find(v => v.id === vehicle.id)) {
      set({ selectedVehicles: [...current, vehicle] })
    }
  },
  
  removeVehicle: (vehicleId) => {
    set({
      selectedVehicles: get().selectedVehicles.filter(v => v.id !== vehicleId),
    })
  },
  
  clearAll: () => {
    set({ selectedVehicles: [] })
  },
  
  setVehicles: (vehicles) => {
    set({ vehicles })
  },
  
  isVehicleSelected: (vehicleId) => {
    return get().selectedVehicles.some(v => v.id === vehicleId)
  },
}))

// Provider component for client-side initialization
export function VehicleProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

