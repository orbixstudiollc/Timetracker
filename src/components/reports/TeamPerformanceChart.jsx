import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useApp } from '../../context/AppContext'
import {
  groupTimeEntriesByMember,
  calculateTotalHours,
  calculateBillableHours,
} from '../../utils/calculations'

export default function TeamPerformanceChart({ entries }) {
  const { state } = useApp()

  const chartData = useMemo(() => {
    const grouped = groupTimeEntriesByMember(entries)

    return Object.keys(grouped)
      .map((memberId) => {
        const member = state.teamMembers.find((m) => m.id === memberId)
        const memberEntries = grouped[memberId]

        return {
          name: member?.name?.split(' ')[0] || 'Unknown',
          fullName: member?.name || 'Unknown',
          totalHours: Math.round(calculateTotalHours(memberEntries) * 10) / 10,
          billableHours:
            Math.round(calculateBillableHours(memberEntries) * 10) / 10,
        }
      })
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 8)
  }, [entries, state.teamMembers])

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No data available for this period
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            width={80}
          />
          <Tooltip
            formatter={(value, name) => [
              `${value}h`,
              name === 'totalHours' ? 'Total' : 'Billable',
            ]}
            labelFormatter={(label, payload) =>
              payload[0]?.payload?.fullName || label
            }
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar
            dataKey="totalHours"
            name="Total Hours"
            fill="#4f46e5"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="billableHours"
            name="Billable Hours"
            fill="#10b981"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
