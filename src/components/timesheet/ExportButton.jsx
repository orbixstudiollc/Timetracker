import { Download } from 'lucide-react'
import { Button } from '../common/Button'
import { useApp } from '../../context/AppContext'
import { formatDateISO } from '../../utils/dateHelpers'

export default function ExportButton({ entries, weekDates }) {
  const { state } = useApp()

  const handleExport = () => {
    if (entries.length === 0) {
      alert('No entries to export')
      return
    }

    const getProject = (id) => state.projects.find((p) => p.id === id)
    const getTask = (id) => state.tasks.find((t) => t.id === id)
    const getMember = (id) => state.teamMembers.find((m) => m.id === id)

    const headers = [
      'Date',
      'Project',
      'Task',
      'Team Member',
      'Hours',
      'Billable',
      'Hourly Rate',
      'Amount',
      'Description',
    ]

    const rows = entries.map((entry) => {
      const project = getProject(entry.projectId)
      const task = getTask(entry.taskId)
      const member = getMember(entry.teamMemberId)

      return [
        entry.date,
        project?.name || '',
        task?.title || '',
        member?.name || '',
        entry.hours.toFixed(2),
        entry.billable ? 'Yes' : 'No',
        entry.hourlyRate.toFixed(2),
        entry.amount.toFixed(2),
        `"${(entry.description || '').replace(/"/g, '""')}"`,
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    const startDate = formatDateISO(weekDates[0])
    const endDate = formatDateISO(weekDates[6])
    const filename = `timesheet_${startDate}_to_${endDate}.csv`

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="secondary" icon={Download} onClick={handleExport}>
      Export CSV
    </Button>
  )
}
