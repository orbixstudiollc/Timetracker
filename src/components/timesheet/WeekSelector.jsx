import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '../common/Button'
import { formatDateRange } from '../../utils/formatters'
import { getWeekDates } from '../../utils/dateHelpers'

export default function WeekSelector({
  currentWeekStart,
  onPrevious,
  onNext,
  onCurrent,
}) {
  const weekDates = getWeekDates(currentWeekStart)
  const startDate = weekDates[0]
  const endDate = weekDates[6]

  const isCurrentWeek = () => {
    const today = new Date()
    const currentStart = new Date(currentWeekStart)
    const todayStart = new Date(today.setHours(0, 0, 0, 0))
    const diff = Math.abs(currentStart - todayStart)
    return diff < 7 * 24 * 60 * 60 * 1000 && currentStart <= todayStart
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-lg border p-4">
      <Button variant="ghost" size="sm" icon={ChevronLeft} onClick={onPrevious}>
        Previous
      </Button>

      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {formatDateRange(startDate, endDate)}
          </div>
          <div className="text-sm text-gray-500">
            Week of{' '}
            {startDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
        {!isCurrentWeek() && (
          <Button
            variant="secondary"
            size="sm"
            icon={Calendar}
            onClick={onCurrent}
          >
            Today
          </Button>
        )}
      </div>

      <Button variant="ghost" size="sm" onClick={onNext}>
        Next
        <ChevronRight size={16} className="ml-1" />
      </Button>
    </div>
  )
}
