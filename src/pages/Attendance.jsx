import { useState, useMemo } from 'react'
import { Plus, Calendar } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Select } from '../components/common/Select'
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import {
  AttendanceOverview,
  LeaveRequestList,
  RequestLeaveModal,
} from '../components/attendance'
import { useApp } from '../context/AppContext'
import { useModal } from '../hooks/useModal'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'personal', label: 'Personal Leave' },
]

export default function Attendance() {
  const { state, dispatch } = useApp()
  const requestModal = useModal()

  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filteredRequests = useMemo(() => {
    return state.leaveRequests.filter((request) => {
      const matchesStatus = !statusFilter || request.status === statusFilter
      const matchesType = !typeFilter || request.type === typeFilter
      return matchesStatus && matchesType
    })
  }, [state.leaveRequests, statusFilter, typeFilter])

  const pendingCount = state.leaveRequests.filter(
    (r) => r.status === 'pending'
  ).length

  const handleApprove = (request) => {
    dispatch({
      type: 'UPDATE_LEAVE_STATUS',
      payload: {
        id: request.id,
        status: 'approved',
        approvedBy: state.teamMembers[0]?.id,
      },
    })
  }

  const handleReject = (request) => {
    dispatch({
      type: 'UPDATE_LEAVE_STATUS',
      payload: {
        id: request.id,
        status: 'rejected',
        approvedBy: state.teamMembers[0]?.id,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance & Leaves</h1>
          <p className="text-gray-500">
            {pendingCount > 0
              ? `${pendingCount} pending request${pendingCount > 1 ? 's' : ''}`
              : 'Manage team attendance and leave requests'}
          </p>
        </div>
        <Button icon={Plus} onClick={() => requestModal.open()}>
          Request Leave
        </Button>
      </div>

      <AttendanceOverview />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Leave Requests</CardTitle>
            <div className="flex gap-3">
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                className="w-36"
              />
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeOptions}
                className="w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRequests.length > 0 ? (
            <LeaveRequestList
              requests={filteredRequests}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ) : (
            <EmptyState
              icon={Calendar}
              title="No leave requests"
              description={
                statusFilter || typeFilter
                  ? 'Try adjusting your filters'
                  : 'No leave requests have been submitted yet'
              }
            />
          )}
        </CardContent>
      </Card>

      <RequestLeaveModal
        isOpen={requestModal.isOpen}
        onClose={requestModal.close}
      />
    </div>
  )
}
