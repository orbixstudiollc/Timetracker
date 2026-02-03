import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isToday,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  format,
  differenceInDays,
  differenceInHours,
} from 'date-fns'

export function getWeekRange(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 }) // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return { start, end }
}

export function getMonthRange(date = new Date()) {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return { start, end }
}

export function getWeekDays(date = new Date()) {
  const { start, end } = getWeekRange(date)
  return eachDayOfInterval({ start, end })
}

export function getMonthDays(date = new Date()) {
  const { start, end } = getMonthRange(date)
  return eachDayOfInterval({ start, end })
}

export function nextWeek(date = new Date()) {
  return addWeeks(date, 1)
}

export function prevWeek(date = new Date()) {
  return subWeeks(date, 1)
}

export function nextMonth(date = new Date()) {
  return addMonths(date, 1)
}

export function prevMonth(date = new Date()) {
  return subMonths(date, 1)
}

export function isDateInRange(date, start, end) {
  const d = typeof date === 'string' ? parseISO(date) : date
  const s = typeof start === 'string' ? parseISO(start) : start
  const e = typeof end === 'string' ? parseISO(end) : end
  return isWithinInterval(d, { start: s, end: e })
}

export function getDaysBetween(startDate, endDate) {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  return differenceInDays(end, start) + 1
}

export function getHoursBetween(startDate, endDate) {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  return differenceInHours(end, start)
}

export function formatWeekRange(date = new Date()) {
  const { start, end } = getWeekRange(date)
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
}

export function formatMonthYear(date = new Date()) {
  return format(date, 'MMMM yyyy')
}

export function toISODateString(date) {
  return format(date, 'yyyy-MM-dd')
}

export function parseDate(dateString) {
  return parseISO(dateString)
}

export {
  isToday,
  isSameDay,
  isSameMonth,
  addDays,
  format,
}
