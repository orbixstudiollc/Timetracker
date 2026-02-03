import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card'
import { Select } from '../components/common/Select'
import {
  RevenueChart,
  HoursBreakdown,
  TeamPerformanceChart,
  BillingSummary,
  ProductivityMetrics,
} from '../components/reports'
import { useApp } from '../context/AppContext'
import { getMonthStart, getMonthEnd, formatDateISO } from '../utils/dateHelpers'

const periodOptions = [
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'this-quarter', label: 'This Quarter' },
  { value: 'this-year', label: 'This Year' },
]

export default function Reports() {
  const { state } = useApp()
  const [period, setPeriod] = useState('this-month')

  const dateRange = useMemo(() => {
    const today = new Date()
    let start, end

    switch (period) {
      case 'this-month':
        start = getMonthStart(today)
        end = getMonthEnd(today)
        break
      case 'last-month':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        start = getMonthStart(lastMonth)
        end = getMonthEnd(lastMonth)
        break
      case 'this-quarter':
        const quarter = Math.floor(today.getMonth() / 3)
        start = new Date(today.getFullYear(), quarter * 3, 1)
        end = new Date(today.getFullYear(), quarter * 3 + 3, 0)
        break
      case 'this-year':
        start = new Date(today.getFullYear(), 0, 1)
        end = new Date(today.getFullYear(), 11, 31)
        break
      default:
        start = getMonthStart(today)
        end = getMonthEnd(today)
    }

    return {
      start: formatDateISO(start),
      end: formatDateISO(end),
    }
  }, [period])

  const filteredEntries = useMemo(() => {
    return state.timeEntries.filter(
      (entry) => entry.date >= dateRange.start && entry.date <= dateRange.end
    )
  }, [state.timeEntries, dateRange])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">
            Track performance, revenue, and team productivity
          </p>
        </div>
        <Select
          value={period}
          onChange={setPeriod}
          options={periodOptions}
          className="w-48"
        />
      </div>

      <BillingSummary entries={filteredEntries} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart entries={filteredEntries} dateRange={dateRange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hours by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <HoursBreakdown entries={filteredEntries} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamPerformanceChart entries={filteredEntries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productivity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductivityMetrics entries={filteredEntries} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
