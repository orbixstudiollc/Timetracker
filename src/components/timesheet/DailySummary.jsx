import { clsx } from 'clsx'
import { formatDateISO } from '../../utils/dateHelpers'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function DailySummary({ weekDates, entries }) {
  const today = formatDateISO(new Date())

  const getDayHours = (date) => {
    const dateStr = formatDateISO(date)
    return entries
      .filter((e) => e.date === dateStr)
      .reduce((sum, e) => sum + e.hours, 0)
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDates.map((date, index) => {
        const dateStr = formatDateISO(date)
        const hours = getDayHours(date)
        const isToday = dateStr === today
        const hasEntries = hours > 0

        return (
          <div
            key={dateStr}
            className={clsx(
              'text-center p-3 rounded-lg border transition-colors',
              isToday
                ? 'bg-primary-50 border-primary-200'
                : hasEntries
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            )}
          >
            <div
              className={clsx(
                'text-xs font-medium',
                isToday ? 'text-primary-600' : 'text-gray-500'
              )}
            >
              {dayNames[index]}
            </div>
            <div
              className={clsx(
                'text-sm font-semibold mt-1',
                isToday ? 'text-primary-900' : 'text-gray-900'
              )}
            >
              {date.getDate()}
            </div>
            <div
              className={clsx(
                'text-lg font-bold mt-1',
                hours > 0
                  ? isToday
                    ? 'text-primary-600'
                    : 'text-green-600'
                  : 'text-gray-300'
              )}
            >
              {hours.toFixed(1)}h
            </div>
          </div>
        )
      })}
    </div>
  )
}
