import { DollarSign, Clock, TrendingUp, Percent } from 'lucide-react'
import { Card, CardContent } from '../common/Card'
import { formatCurrency } from '../../utils/formatters'
import {
  calculateTotalHours,
  calculateBillableHours,
  calculateTotalAmount,
  calculateProductivity,
} from '../../utils/calculations'

export default function BillingSummary({ entries }) {
  const totalHours = calculateTotalHours(entries)
  const billableHours = calculateBillableHours(entries)
  const totalAmount = calculateTotalAmount(entries)
  const productivity = calculateProductivity(billableHours, totalHours)

  const avgRate =
    billableHours > 0
      ? entries
          .filter((e) => e.billable)
          .reduce((sum, e) => sum + e.hourlyRate, 0) /
        entries.filter((e) => e.billable).length
      : 0

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalAmount),
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      subtext: 'From billable hours',
    },
    {
      label: 'Total Hours',
      value: `${totalHours.toFixed(1)}h`,
      icon: Clock,
      color: 'bg-blue-100 text-blue-600',
      subtext: `${billableHours.toFixed(1)}h billable`,
    },
    {
      label: 'Avg. Hourly Rate',
      value: formatCurrency(avgRate),
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      subtext: 'Per billable hour',
    },
    {
      label: 'Billable Rate',
      value: `${productivity}%`,
      icon: Percent,
      color: 'bg-orange-100 text-orange-600',
      subtext: 'Of total hours',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="py-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
