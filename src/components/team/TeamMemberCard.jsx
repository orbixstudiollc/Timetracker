import { MoreVertical, Mail, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '../common/Avatar'
import { Badge } from '../common/Badge'
import { StatusBadge } from '../common/StatusIndicator'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatHours } from '../../utils/formatters'
import { calculateTotalHours, calculateBillableHours } from '../../utils/calculations'

export function TeamMemberCard({ member, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)
  const { state, getMemberTimeEntries } = useApp()

  const timeEntries = getMemberTimeEntries(member.id)
  const totalHours = calculateTotalHours(timeEntries)
  const billableHours = calculateBillableHours(timeEntries)
  const projectCount = member.projectIds?.length || 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <Avatar
            name={member.name}
            size="lg"
            showStatus
            status={member.status}
          />
          <div>
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.role}</p>
          </div>
        </div>
        <div className="relative">
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
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={() => {
                    onEdit(member)
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4" />
                  Edit Member
                </button>
                <button
                  onClick={() => {
                    onDelete(member)
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Member
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <StatusBadge status={member.status} />
        <Badge variant="info">{member.department}</Badge>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Mail className="w-4 h-4" />
        <a
          href={`mailto:${member.email}`}
          className="hover:text-primary-600 hover:underline"
        >
          {member.email}
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{formatHours(totalHours)}</p>
          <p className="text-xs text-gray-500">Hours Logged</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{projectCount}</p>
          <p className="text-xs text-gray-500">Projects</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(member.hourlyRate)}
          </p>
          <p className="text-xs text-gray-500">Hourly Rate</p>
        </div>
      </div>
    </div>
  )
}
