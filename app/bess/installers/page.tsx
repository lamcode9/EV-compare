import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'BESS Installer Directory — battery.mom',
  description:
    'Find verified battery energy storage system (BESS) installers across Southeast Asia — Singapore, Malaysia, Thailand, Indonesia, Vietnam, and Philippines.',
  alternates: { canonical: '/bess/installers' },
}

interface Installer {
  name: string
  country: string[]
  website: string
  products: string[]
  specialties: string[]
  verified: boolean
}

const INSTALLERS: Installer[] = [
  {
    name: 'SolarPV Exchange',
    country: ['SG'],
    website: 'https://solarpvexchange.com',
    products: ['Tesla Powerwall', 'BYD BatteryBox', 'Enphase IQ Battery'],
    specialties: ['Residential', 'Commercial', 'Solar + Storage'],
    verified: true,
  },
  {
    name: 'Union Solar',
    country: ['SG'],
    website: 'https://unionsolar.sg',
    products: ['Tesla Powerwall', 'Huawei LUNA'],
    specialties: ['Residential', 'HDB Solar'],
    verified: true,
  },
  {
    name: 'Plus Solar Systems',
    country: ['MY'],
    website: 'https://plussolar.com.my',
    products: ['Tesla Powerwall', 'BYD BatteryBox', 'Growatt ARK'],
    specialties: ['Residential', 'Commercial', 'Industrial'],
    verified: true,
  },
  {
    name: 'Solarvest Holdings',
    country: ['MY'],
    website: 'https://solarvest.com.my',
    products: ['Huawei LUNA', 'BYD BatteryBox'],
    specialties: ['Large-scale Solar', 'Commercial BESS'],
    verified: true,
  },
  {
    name: 'Yolk Solar',
    country: ['MY'],
    website: 'https://yolksolar.com',
    products: ['Tesla Powerwall', 'Enphase IQ Battery'],
    specialties: ['Residential', 'Solar + Storage'],
    verified: false,
  },
  {
    name: 'Solar D',
    country: ['TH'],
    website: 'https://solard.com',
    products: ['Huawei LUNA', 'BYD BatteryBox', 'Pylontech'],
    specialties: ['Residential', 'Commercial'],
    verified: true,
  },
  {
    name: 'Banpu NEXT',
    country: ['TH'],
    website: 'https://banpunext.co.th',
    products: ['Custom BESS solutions'],
    specialties: ['Commercial', 'Industrial', 'Grid-scale'],
    verified: true,
  },
  {
    name: 'SUN Energy',
    country: ['ID'],
    website: 'https://sunenergy.id',
    products: ['BYD BatteryBox', 'Growatt ARK', 'Pylontech'],
    specialties: ['Commercial', 'Industrial', 'Solar + Storage'],
    verified: true,
  },
  {
    name: 'Xurya Daya Indonesia',
    country: ['ID'],
    website: 'https://xurya.com',
    products: ['Custom BESS solutions'],
    specialties: ['Rooftop Solar', 'Commercial BESS'],
    verified: true,
  },
  {
    name: 'SolarBK',
    country: ['VN'],
    website: 'https://solarbk.com',
    products: ['BYD BatteryBox', 'Pylontech', 'Growatt ARK'],
    specialties: ['Residential', 'Commercial', 'Solar farms'],
    verified: true,
  },
  {
    name: 'SolarNRG Philippines',
    country: ['PH'],
    website: 'https://solarnrg.ph',
    products: ['Tesla Powerwall', 'BYD BatteryBox', 'Enphase IQ Battery'],
    specialties: ['Residential', 'Commercial'],
    verified: true,
  },
  {
    name: 'Solaric',
    country: ['PH'],
    website: 'https://solaric.com.ph',
    products: ['Tesla Powerwall', 'Pylontech', 'Growatt ARK'],
    specialties: ['Residential', 'Solar + Storage', 'Off-grid'],
    verified: true,
  },
]

import { COUNTRY_NAMES } from '@/lib/constants'

const COUNTRY_FLAGS: Record<string, string> = {
  SG: '🇸🇬',
  MY: '🇲🇾',
  ID: '🇮🇩',
  TH: '🇹🇭',
  VN: '🇻🇳',
  PH: '🇵🇭',
}

export default function InstallersPage() {
  const countries = Object.keys(COUNTRY_NAMES)

  return (
    <main className="min-h-screen pt-12 md:pt-14">
      <section className="container mx-auto px-4 pt-12 pb-16 max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/bess" className="text-sm text-emerald-600 hover:text-emerald-700">
              Battery Storage
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-500">Installer Directory</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            BESS Installer Directory
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Verified battery storage installers across Southeast Asia. Contact them directly to get quotes for home or commercial BESS installations.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
          <strong>Note:</strong> battery.mom does not receive commissions or referral fees from any installer.
          This directory is provided as a public resource. Always get multiple quotes and verify credentials independently.
        </div>

        {/* Country Sections */}
        {countries.map((countryCode) => {
          const countryInstallers = INSTALLERS.filter((i) => i.country.includes(countryCode))
          if (countryInstallers.length === 0) return null

          return (
            <div key={countryCode} className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">{COUNTRY_FLAGS[countryCode]}</span>
                {COUNTRY_NAMES[countryCode]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {countryInstallers.map((installer) => (
                  <div
                    key={installer.name}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{installer.name}</h3>
                      {installer.verified && (
                        <span className="flex-shrink-0 text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Products */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1.5">Products installed</p>
                      <div className="flex flex-wrap gap-1.5">
                        {installer.products.map((p) => (
                          <span key={p} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1.5">Specialties</p>
                      <div className="flex flex-wrap gap-1.5">
                        {installer.specialties.map((s) => (
                          <span key={s} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Website Link */}
                    <a
                      href={installer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Visit website
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Submit your company */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Are you a BESS installer?</h2>
          <p className="text-gray-600 mb-4">
            If you install battery storage systems in Southeast Asia and want to be listed in this directory, let us know.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Request listing
          </Link>
        </div>
      </section>
    </main>
  )
}
