'use client'

import { useVehicleStore } from '@/store/VehicleStore'
import * as Select from '@radix-ui/react-select'

type Country = 'SG' | 'MY' | 'ID' | 'PH' | 'TH' | 'VN'

const countries: { value: Country; label: string; flag: string }[] = [
  { value: 'SG', label: 'Singapore', flag: '🇸🇬' },
  { value: 'MY', label: 'Malaysia', flag: '🇲🇾' },
  { value: 'ID', label: 'Indonesia', flag: '🇮🇩' },
  { value: 'PH', label: 'Philippines', flag: '🇵🇭' },
  { value: 'TH', label: 'Thailand', flag: '🇹🇭' },
  { value: 'VN', label: 'Vietnam', flag: '🇻🇳' },
]

export default function CountrySelector() {
  const { selectedCountry, setSelectedCountry } = useVehicleStore()

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="country-select" className="text-sm font-medium text-ink-700">
        Country:
      </label>
      <Select.Root 
        value={selectedCountry || undefined} 
        onValueChange={(value: Country) => setSelectedCountry(value)}
      >
        <Select.Trigger
          id="country-select"
          className="inline-flex items-center justify-center rounded-lg bg-paper-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-paper-300 focus:outline-none focus:ring-0 min-w-[180px]"
          aria-label="Select country"
        >
          <Select.Value placeholder="Select a country" />
          <Select.Icon className="ml-2">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M4 6H11L7.5 10.5L4 6Z" fill="currentColor" />
            </svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={8}
            className="overflow-hidden bg-paper-100 rounded-lg shadow-lg border border-ink/10 z-50 min-w-[180px]"
          >
            <Select.Viewport className="p-1">
              {countries.map((country) => (
                <Select.Item
                  key={country.value}
                  value={country.value}
                  className="relative flex items-center px-4 py-2 text-sm text-ink-700 rounded-md hover:bg-ev-primary/10 focus:bg-ev-primary/10 focus:outline-none cursor-pointer"
                >
                  <Select.ItemText>
                    {country.flag} {country.label}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}
