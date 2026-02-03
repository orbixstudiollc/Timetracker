import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { ProgressBar } from '../common/ProgressBar'
import { useApp } from '../../context/AppContext'
import {
  calculateTotalHours,
  calculateBillableHours,
  calculateTotalAmount,
  groupTimeEntriesByProject,
} from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'

export default function ProductivityMetrics({ entries }) {
  const { state } = useApp()

  const metrics = useMemo(() => {
    const totalHours = calculateTotalHours(entries)
    const billableHours = calculateBillableHours(entries)
    const totalRevenue = calculateTotalAmount(entries)
    const utilization = totalHours > 0 ? (billableHours / totalHours) * 100 : 0

    const projectBreakdown = groupTimeEntriesByProject(entries)
    const projectCount = Object.keys(projectBreakdown).length

    const avgHoursPerProject =
      projectCount > 0 ? totalHours / projectCount : 0

    const avgRevenuePerHour = billableHours > 0 ? totalRevenue / billableHours : 0

    const workingDays = new Set(entries.map((e) => e.date)).size
    const avgHoursPerDay = workingDays > 0 ? totalHours / workingDays : 0

    return [
      {
        label: 'Utilization Rate',
        value: `${utilization.toFixed(1)}%`,
        progress: utilization,
        target: 80,
        description: 'Billable vs total hours',
        trend: utilization >= 80 ? 'up' : utilization >= 60 ? 'neutral' : 'down',
      },
      {
        label: 'Avg. Hours/Day',
        value: `${avgHoursPerDay.toFixed(1)}h`,
        progress: (avgHoursPerDay / 8) * 100,
        target: 100,
        description: 'Target: 8h per day',
        trend:
          avgHoursPerDay >= 7 ? 'up' : avgHoursPerDay >= 5 ? 'neutral' : 'down',
      },
      {
        label: 'Revenue/Hour',
        value: formatCurrency(avgRevenuePerHour),
        progress: (avgRevenuePerHour / 100) * 100,
        target: 100,
        description: 'Average billable rate',
        trend:
          avgRevenuePerHour >= 80
            ? 'up'
            : avgRevenuePerHour >= 50
            ? 'neutral'
            : 'down',
      },
      {
        label: 'Active Projects',
        value: projectCount.toString(),
        progress: (projectCount / state.projects.length) * 100,
        target: 100,
        description: `Of ${state.projects.length} total projects`,
        trend: 'neutral',
      },
    ]
  }, [entries, state.projects])

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-500" />
      case 'down':
        return <TrendingDown size={16} className="text-red-500" />
      default:
        return <Minus size={16} className="text-gray-400" />
    }
  }

  const getProgressVariant = (trend) => {
    switch (trend) {
      case 'up':
        return 'success'
      case 'down':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-medium text-gray-900">
                {metric.label}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {metric.description}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {metric.value}
              </span>
              {getTrendIcon(metric.trend)}
            </div>
          </div>
          <ProgressBar
            value={Math.min(metric.progress, 100)}
            max={100}
            variant={getProgressVariant(metric.trend)}
            size="sm"
          />
        </div>
      ))}
    </div>
  )
}
