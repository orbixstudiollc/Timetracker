import { Link } from 'react-router-dom'
import { ArrowRight, Clock, CheckCircle, FolderPlus, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../common/Card'
import { Avatar } from '../common/Avatar'
import { useApp } from '../../context/AppContext'
import { formatRelativeTime, formatHours } from '../../utils/formatters'

export function TeamActivityFeed() {
  const { state, getTeamMember, getProject, getTask } = useApp()

  // Generate activity items from recent data
  const activities = []

  // Add recent time entries as activities
  state.timeEntries.slice(0, 5).forEach((entry) => {
    const member = getTeamMember(entry.teamMemberId)
    const project = getProject(entry.projectId)
    if (member && project) {
      activities.push({
        id: `te-${entry.id}`,
        type: 'time_entry',
        member,
        description: `logged ${formatHours(entry.hours)} on ${project.name}`,
        timestamp: entry.createdAt,
        icon: Clock,
      })
    }
  })

  // Add completed tasks as activities
  state.tasks
    .filter((t) => t.status === 'completed' && t.completedAt)
    .slice(0, 3)
    .forEach((task) => {
      const member = getTeamMember(task.assigneeId)
      const project = getProject(task.projectId)
      if (member && project) {
        activities.push({
          id: `task-${task.id}`,
          type: 'task_completed',
          member,
          description: `completed "${task.title}"`,
          timestamp: task.completedAt,
          icon: CheckCircle,
        })
      }
    })

  // Sort by timestamp and take top 6
  const sortedActivities = activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6)

  const getIconBg = (type) => {
    switch (type) {
      case 'time_entry':
        return 'bg-blue-100 text-blue-600'
      case 'task_completed':
        return 'bg-green-100 text-green-600'
      case 'project_created':
        return 'bg-purple-100 text-purple-600'
      case 'leave_requested':
        return 'bg-yellow-100 text-yellow-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Activity</CardTitle>
        <Link
          to="/team"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          View team <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>

      <div className="space-y-4">
        {sortedActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <Avatar name={activity.member.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.member.name}</span>{' '}
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
            <div className={`p-1.5 rounded-lg ${getIconBg(activity.type)}`}>
              <activity.icon className="w-4 h-4" />
            </div>
          </div>
        ))}

        {sortedActivities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recent activity
          </div>
        )}
      </div>
    </Card>
  )
}
