import { useState, useMemo } from 'react'
import { Plus, Download, Clock } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import {
  WeekSelector,
  TimesheetTable,
  DailySummary,
  AddTimeEntryModal,
  ExportButton,
} from '../components/timesheet'
import { useApp } from '../context/AppContext'
import { useModal } from '../hooks/useModal'
import {
  getWeekDates,
  getWeekStart,
  formatDateISO,
} from '../utils/dateHelpers'
import {
  calculateTotalHours,
  calculateBillableHours,
  calculateTotalAmount,
} from '../utils/calculations'
import { formatCurrency } from '../utils/formatters'

export default function Timesheet() {
  const { state, dispatch } = useApp()
  const addModal = useModal()

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStart(new Date())
  )
  const [editEntry, setEditEntry] = useState(null)

  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart])

  const weekEntries = useMemo(() => {
    const startDate = formatDateISO(weekDates[0])
    const endDate = formatDateISO(weekDates[6])
    return state.timeEntries.filter(
      (entry) => entry.date >= startDate && entry.date <= endDate
    )
  }, [state.timeEntries, weekDates])

  const weekStats = useMemo(() => {
    return {
      totalHours: calculateTotalHours(weekEntries),
      billableHours: calculateBillableHours(weekEntries),
      totalAmount: calculateTotalAmount(weekEntries),
    }
  }, [weekEntries])

  const handlePreviousWeek = () => {
    const prev = new Date(currentWeekStart)
    prev.setDate(prev.getDate() - 7)
    setCurrentWeekStart(prev)
  }

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart)
    next.setDate(next.getDate() + 7)
    setCurrentWeekStart(next)
  }

  const handleCurrentWeek = () => {
    setCurrentWeekStart(getWeekStart(new Date()))
  }

  const handleEdit = (entry) => {
    setEditEntry(entry)
    addModal.open()
  }

  const handleDelete = (entry) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      dispatch({ type: 'DELETE_TIME_ENTRY', payload: entry.id })
    }
  }

  const handleCloseModal = () => {
    setEditEntry(null)
    addModal.close()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheet</h1>
          <p className="text-gray-500">Track and manage your time entries</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton entries={weekEntries} weekDates={weekDates} />
          <Button icon={Plus} onClick={() => addModal.open()}>
            Add Entry
          </Button>
        </div>
      </div>

      <WeekSelector
        currentWeekStart={currentWeekStart}
        onPrevious={handlePreviousWeek}
        onNext={handleNextWeek}
        onCurrent={handleCurrentWeek}
      />

      <DailySummary weekDates={weekDates} entries={weekEntries} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-gray-500">Total Hours</div>
            <div className="text-2xl font-bold text-gray-900">
              {weekStats.totalHours.toFixed(1)}h
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-gray-500">Billable Hours</div>
            <div className="text-2xl font-bold text-green-600">
              {weekStats.billableHours.toFixed(1)}h
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="text-2xl font-bold text-primary-600">
              {formatCurrency(weekStats.totalAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {weekEntries.length > 0 ? (
        <TimesheetTable
          entries={weekEntries}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              icon={Clock}
              title="No time entries"
              description="No time entries for this week. Add your first entry."
              action={
                <Button icon={Plus} onClick={() => addModal.open()}>
                  Add Entry
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}

      <AddTimeEntryModal
        isOpen={addModal.isOpen}
        onClose={handleCloseModal}
        editEntry={editEntry}
      />
    </div>
  )
}
