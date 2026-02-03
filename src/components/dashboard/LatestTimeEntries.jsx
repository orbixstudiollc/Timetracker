import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import { Avatar } from '../common/Avatar'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatHours, formatDate } from '../../utils/formatters'

export function LatestTimeEntries() {
  const { state, getTeamMember, getProject, getTask } = useApp()

  const recentEntries = state.timeEntries
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Time Entries</CardTitle>
        <Link
          to="/timesheet"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          View timesheet <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="pb-3">Member</th>
              <th className="pb-3">Project</th>
              <th className="pb-3">Hours</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentEntries.map((entry) => {
              const member = getTeamMember(entry.teamMemberId)
              const project = getProject(entry.projectId)
              const task = entry.taskId ? getTask(entry.taskId) : null

              return (
                <tr key={entry.id} className="text-sm">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={member?.name} size="sm" />
                      <span className="font-medium text-gray-900">
                        {member?.name || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div>
                      <p className="text-gray-900">{project?.name || 'Unknown'}</p>
                      {task && (
                        <p className="text-xs text-gray-500">{task.title}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="font-medium text-gray-900">
                      {formatHours(entry.hours)}
                    </span>
                  </td>
                  <td className="py-3">
                    <Badge variant={entry.billable ? 'success' : 'default'}>
                      {entry.billable ? 'Billable' : 'Non-billable'}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <span className="font-medium text-gray-900">
                      {entry.billable ? formatCurrency(entry.amount) : '-'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {recentEntries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No time entries yet
          </div>
        )}
      </div>
    </Card>
  )
}
