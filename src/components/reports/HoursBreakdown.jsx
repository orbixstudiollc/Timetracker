import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { useApp } from '../../context/AppContext'
import { groupTimeEntriesByProject, calculateTotalHours } from '../../utils/calculations'

const COLORS = [
  '#4f46e5',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
]

export default function HoursBreakdown({ entries }) {
  const { state } = useApp()

  const chartData = useMemo(() => {
    const grouped = groupTimeEntriesByProject(entries)

    return Object.keys(grouped)
      .map((projectId) => {
        const project = state.projects.find((p) => p.id === projectId)
        const hours = calculateTotalHours(grouped[projectId])

        return {
          name: project?.name || 'Unknown Project',
          value: Math.round(hours * 10) / 10,
          hours,
        }
      })
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 8)
  }, [entries, state.projects])

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No data available for this period
      </div>
    )
  }

  const totalHours = chartData.reduce((sum, item) => sum + item.hours, 0)

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}h`, 'Hours']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend
            formatter={(value, entry) => {
              const percent = ((entry.payload.hours / totalHours) * 100).toFixed(
                0
              )
              return `${value} (${percent}%)`
            }}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
