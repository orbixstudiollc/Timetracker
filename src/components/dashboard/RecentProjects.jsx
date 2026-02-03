import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import { ProgressBar } from '../common/ProgressBar'
import { AvatarGroup, Avatar } from '../common/Avatar'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'
import { PRIORITY_COLORS, PROJECT_STATUS_COLORS } from '../../utils/constants'

export function RecentProjects() {
  const { state, getTeamMember } = useApp()

  const recentProjects = state.projects
    .filter(p => p.status !== 'completed')
    .slice(0, 4)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Projects</CardTitle>
        <Link
          to="/projects"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>

      <div className="space-y-4">
        {recentProjects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{project.name}</h4>
                <p className="text-sm text-gray-500">{project.client}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={PRIORITY_COLORS[project.priority]}>
                  {project.priority}
                </Badge>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium text-gray-900">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} />
            </div>

            <div className="flex items-center justify-between">
              <AvatarGroup max={3}>
                {project.teamMemberIds.map((memberId) => {
                  const member = getTeamMember(memberId)
                  return member ? (
                    <Avatar key={memberId} name={member.name} size="sm" />
                  ) : null
                })}
              </AvatarGroup>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(project.spent)}
                </p>
                <p className="text-xs text-gray-500">
                  of {formatCurrency(project.budget)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {recentProjects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No active projects
          </div>
        )}
      </div>
    </Card>
  )
}
