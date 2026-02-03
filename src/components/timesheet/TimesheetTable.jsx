import { Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent } from '../common/Card'
import { Badge } from '../common/Badge'
import { useApp } from '../../context/AppContext'
import { formatDate, formatCurrency } from '../../utils/formatters'

export default function TimesheetTable({ entries, onEdit, onDelete }) {
  const { state } = useApp()

  const getProject = (projectId) =>
    state.projects.find((p) => p.id === projectId)

  const getTask = (taskId) => state.tasks.find((t) => t.id === taskId)

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Project / Task
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Description
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                  Hours
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                  Billable
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.map((entry) => {
                const project = getProject(entry.projectId)
                const task = getTask(entry.taskId)

                return (
                  <tr
                    key={entry.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">
                        {formatDate(entry.date)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">
                        {project?.name || 'Unknown Project'}
                      </div>
                      {task && (
                        <div className="text-xs text-gray-500">{task.title}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 line-clamp-1">
                        {entry.description || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-medium text-gray-900">
                        {entry.hours.toFixed(1)}h
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={entry.billable ? 'success' : 'secondary'}
                        size="sm"
                      >
                        {entry.billable ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(entry.amount || 0)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(entry)}
                          className="p-1 text-gray-400 hover:text-primary-600 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(entry)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
