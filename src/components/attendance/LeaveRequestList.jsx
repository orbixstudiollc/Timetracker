import { Check, X, Calendar, User } from 'lucide-react'
import { Avatar } from '../common/Avatar'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../utils/formatters'

const typeLabels = {
  annual: 'Annual Leave',
  sick: 'Sick Leave',
  personal: 'Personal Leave',
}

const typeColors = {
  annual: 'primary',
  sick: 'danger',
  personal: 'warning',
}

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

export default function LeaveRequestList({ requests, onApprove, onReject }) {
  const { state } = useApp()

  const getMember = (id) => state.teamMembers.find((m) => m.id === id)

  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return (
    <div className="space-y-4">
      {sortedRequests.map((request) => {
        const member = getMember(request.teamMemberId)
        const approver = request.approvedBy
          ? getMember(request.approvedBy)
          : null

        return (
          <div
            key={request.id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1">
              <Avatar name={member?.name || 'Unknown'} />
              <div>
                <div className="font-medium text-gray-900">
                  {member?.name || 'Unknown Member'}
                </div>
                <div className="text-sm text-gray-500">{member?.role}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 flex-1">
              <Badge variant={typeColors[request.type]} size="sm">
                {typeLabels[request.type]}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar size={14} />
                <span>
                  {formatDate(request.startDate)} - {formatDate(request.endDate)}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({request.totalDays} day{request.totalDays > 1 ? 's' : ''})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={statusColors[request.status]}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>

              {request.status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="success"
                    icon={Check}
                    onClick={() => onApprove(request)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    icon={X}
                    onClick={() => onReject(request)}
                  >
                    Reject
                  </Button>
                </div>
              ) : approver ? (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User size={12} />
                  <span>by {approver.name}</span>
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
