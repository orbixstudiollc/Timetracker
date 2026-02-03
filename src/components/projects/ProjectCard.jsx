import { MoreVertical, Calendar, Edit, Trash2, Users } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../common/Badge'
import { ProgressBar } from '../common/ProgressBar'
import { Avatar, AvatarGroup } from '../common/Avatar'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { PRIORITY_COLORS, PROJECT_STATUS_COLORS } from '../../utils/constants'

export function ProjectCard({ project, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)
  const { getTeamMember } = useApp()

  const budgetPercentage = project.budget > 0
    ? Math.round((project.spent / project.budget) * 100)
    : 0

  const getBudgetVariant = () => {
    if (budgetPercentage >= 90) return 'danger'
    if (budgetPercentage >= 70) return 'warning'
    return 'success'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
          </div>
          <p className="text-sm text-gray-500">{project.client}</p>
        </div>
        <div className="relative flex items-center gap-2">
          <Badge className={PRIORITY_COLORS[project.priority]}>
            {project.priority}
          </Badge>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={() => {
                    onEdit(project)
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4" />
                  Edit Project
                </button>
                <button
                  onClick={() => {
                    onDelete(project)
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge className={PROJECT_STATUS_COLORS[project.status]}>
          {project.status.replace('-', ' ')}
        </Badge>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Due {formatDate(project.deadline)}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-gray-900">{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">Budget Used</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
            </span>
          </div>
          <ProgressBar value={budgetPercentage} variant={getBudgetVariant()} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <AvatarGroup max={4}>
            {project.teamMemberIds.map((memberId) => {
              const member = getTeamMember(memberId)
              return member ? (
                <Avatar key={memberId} name={member.name} size="sm" />
              ) : null
            })}
          </AvatarGroup>
        </div>
        <div className="text-sm text-gray-500">
          {project.loggedHours}h / {project.estimatedHours}h
        </div>
      </div>
    </div>
  )
}
