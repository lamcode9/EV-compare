'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import ResponsiveContainer from '@/components/ResponsiveContainer'

type CountryCode = 'SG' | 'MY' | 'TH' | 'ID' | 'VN' | 'PH'

const COUNTRIES: { code: CountryCode; name: string; flag: string; evAdoptionRate: number; totalEvs: number; chargersPerMillion: number; solarCapacityGw: number; evSalesGrowth: number; policyGrade: string }[] = [
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', evAdoptionRate: 11.2, totalEvs: 115000, chargersPerMillion: 95, solarCapacityGw: 5.2, evSalesGrowth: 78, policyGrade: 'A' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', evAdoptionRate: 8.5, totalEvs: 18000, chargersPerMillion: 380, solarCapacityGw: 1.1, evSalesGrowth: 52, policyGrade: 'A-' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', evAdoptionRate: 2.1, totalEvs: 45000, chargersPerMillion: 8, solarCapacityGw: 0.6, evSalesGrowth: 65, policyGrade: 'B+' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', evAdoptionRate: 2.8, totalEvs: 38000, chargersPerMillion: 42, solarCapacityGw: 2.8, evSalesGrowth: 120, policyGrade: 'B' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', evAdoptionRate: 1.5, totalEvs: 28000, chargersPerMillion: 12, solarCapacityGw: 17.0, evSalesGrowth: 45, policyGrade: 'B-' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', evAdoptionRate: 0.4, totalEvs: 5000, chargersPerMillion: 4, solarCapacityGw: 2.4, evSalesGrowth: 90, policyGrade: 'C+' },
]

const radarData = COUNTRIES.map((c) => ({
  country: c.flag,
  'EV Adoption': Math.min(c.evAdoptionRate * 10, 100),
  'Charger Density': Math.min(c.chargersPerMillion / 4, 100),
  'Solar Capacity': Math.min(c.solarCapacityGw * 5, 100),
  'EV Growth': Math.min(c.evSalesGrowth, 100),
}))

export default function EmbedScoreboard() {
  const [view, setView] = useState<'table' | 'chart'>('table')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          🌏 SEA EV & Energy Scoreboard
        </h2>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setView('table')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              view === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setView('chart')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              view === 'chart' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Chart
          </button>
        </div>
      </div>

      {view === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 pr-3 font-semibold text-gray-700">Country</th>
                <th className="py-2 px-2 font-semibold text-gray-700 text-right">EV %</th>
                <th className="py-2 px-2 font-semibold text-gray-700 text-right">Total EVs</th>
                <th className="py-2 px-2 font-semibold text-gray-700 text-right">Chargers/M</th>
                <th className="py-2 px-2 font-semibold text-gray-700 text-right">Solar GW</th>
                <th className="py-2 px-2 font-semibold text-gray-700 text-right">Growth</th>
                <th className="py-2 pl-2 font-semibold text-gray-700 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {COUNTRIES.map((c) => (
                <tr key={c.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 pr-3">
                    <span className="mr-1">{c.flag}</span>
                    <span className="font-medium text-gray-900">{c.name}</span>
                  </td>
                  <td className="py-2 px-2 text-right tabular-nums">{c.evAdoptionRate}%</td>
                  <td className="py-2 px-2 text-right tabular-nums">{(c.totalEvs / 1000).toFixed(0)}k</td>
                  <td className="py-2 px-2 text-right tabular-nums">{c.chargersPerMillion}</td>
                  <td className="py-2 px-2 text-right tabular-nums">{c.solarCapacityGw}</td>
                  <td className="py-2 px-2 text-right tabular-nums text-emerald-600">+{c.evSalesGrowth}%</td>
                  <td className="py-2 pl-2 text-center">
                    <span className={`inline-block w-7 text-center rounded font-bold text-xs py-0.5 ${
                      c.policyGrade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                      c.policyGrade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {c.policyGrade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {/* EV Adoption Bar Chart */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">EV Adoption Rate (%)</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COUNTRIES} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="flag" type="category" width={30} tick={{ fontSize: 14 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'EV Adoption']}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="evAdoptionRate" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Multi-Metric Comparison</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="country" tick={{ fontSize: 14 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar name="EV Adoption" dataKey="EV Adoption" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                  <Radar name="Charger Density" dataKey="Charger Density" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                  <Radar name="Solar Capacity" dataKey="Solar Capacity" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <p className="text-[10px] text-gray-400 text-right">
        Data updated monthly · Source: battery.mom
      </p>
    </div>
  )
}
