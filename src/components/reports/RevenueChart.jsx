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
import { groupTimeEntriesByDate } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'

export default function RevenueChart({ entries, dateRange }) {
  const chartData = useMemo(() => {
    const grouped = groupTimeEntriesByDate(entries)

    const weeklyData = {}

    Object.keys(grouped).forEach((date) => {
      const d = new Date(date)
      const weekStart = new Date(d)
      weekStart.setDate(d.getDate() - d.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { billable: 0, nonBillable: 0 }
      }

      grouped[date].forEach((entry) => {
        if (entry.billable) {
          weeklyData[weekKey].billable += entry.amount || 0
        } else {
          weeklyData[weekKey].nonBillable += entry.hours * (entry.hourlyRate || 0)
        }
      })
    })

    return Object.keys(weeklyData)
      .sort()
      .map((weekKey) => {
        const date = new Date(weekKey)
        return {
          week: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          billable: weeklyData[weekKey].billable,
          nonBillable: weeklyData[weekKey].nonBillable,
        }
      })
  }, [entries])

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
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar
            dataKey="billable"
            name="Billable"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="nonBillable"
            name="Non-Billable"
            fill="#9ca3af"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
