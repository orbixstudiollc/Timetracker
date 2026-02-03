import { useState, useMemo } from 'react'
import { Plus, Users } from 'lucide-react'
import { Button } from '../components/common/Button'
import { SearchInput } from '../components/common/SearchInput'
import { Select } from '../components/common/Select'
import { EmptyState } from '../components/common/EmptyState'
import { TeamMemberCard, AddMemberModal } from '../components/team'
import { useApp } from '../context/AppContext'
import { useModal } from '../hooks/useModal'
import { DEPARTMENTS } from '../utils/constants'

const departmentOptions = [
  { value: '', label: 'All Departments' },
  ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'away', label: 'Away' },
  { value: 'offline', label: 'Offline' },
]

export default function Team() {
  const { state, dispatch } = useApp()
  const addModal = useModal()

  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [editMember, setEditMember] = useState(null)

  const filteredMembers = useMemo(() => {
    return state.teamMembers.filter((member) => {
      const matchesSearch =
        !search ||
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()) ||
        member.role.toLowerCase().includes(search.toLowerCase())

      const matchesDepartment = !department || member.department === department
      const matchesStatus = !status || member.status === status

      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [state.teamMembers, search, department, status])

  const handleEdit = (member) => {
    setEditMember(member)
    addModal.open()
  }

  const handleDelete = (member) => {
    if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
      dispatch({ type: 'DELETE_TEAM_MEMBER', payload: member.id })
    }
  }

  const handleCloseModal = () => {
    setEditMember(null)
    addModal.close()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-500">
            Manage your team and track their performance
          </p>
        </div>
        <Button icon={Plus} onClick={() => addModal.open()}>
          Add Member
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, or role..."
          className="sm:w-80"
        />
        <Select
          value={department}
          onChange={setDepartment}
          options={departmentOptions}
          className="sm:w-48"
        />
        <Select
          value={status}
          onChange={setStatus}
          options={statusOptions}
          className="sm:w-40"
        />
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No team members found"
          description={
            search || department || status
              ? 'Try adjusting your filters'
              : 'Add your first team member to get started'
          }
          action={
            !search && !department && !status ? (
              <Button icon={Plus} onClick={() => addModal.open()}>
                Add Member
              </Button>
            ) : null
          }
        />
      )}

      <AddMemberModal
        isOpen={addModal.isOpen}
        onClose={handleCloseModal}
        editMember={editMember}
      />
    </div>
  )
}
