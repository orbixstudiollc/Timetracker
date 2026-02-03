import { useState } from 'react'
import { Modal, ModalFooter } from '../common/Modal'
import { Button } from '../common/Button'
import { FormInput, FormSelect } from '../common/Input'
import { Select } from '../common/Select'
import { useApp } from '../../context/AppContext'
import { DEPARTMENTS, ROLES, MEMBER_STATUS } from '../../utils/constants'

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'away', label: 'Away' },
  { value: 'offline', label: 'Offline' },
]

const departmentOptions = DEPARTMENTS.map((d) => ({ value: d, label: d }))
const roleOptions = ROLES.map((r) => ({ value: r, label: r }))

export function AddMemberModal({ isOpen, onClose, editMember }) {
  const { dispatch } = useApp()
  const isEditing = !!editMember

  const [formData, setFormData] = useState({
    name: editMember?.name || '',
    email: editMember?.email || '',
    role: editMember?.role || '',
    department: editMember?.department || '',
    hourlyRate: editMember?.hourlyRate || '',
    status: editMember?.status || 'active',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email format'
    if (!formData.role) newErrors.role = 'Role is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.hourlyRate) newErrors.hourlyRate = 'Hourly rate is required'
    else if (isNaN(formData.hourlyRate) || formData.hourlyRate <= 0)
      newErrors.hourlyRate = 'Invalid hourly rate'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const memberData = {
      ...formData,
      hourlyRate: parseFloat(formData.hourlyRate),
      joinDate: editMember?.joinDate || new Date().toISOString().split('T')[0],
      projectIds: editMember?.projectIds || [],
    }

    if (isEditing) {
      dispatch({
        type: 'UPDATE_TEAM_MEMBER',
        payload: { id: editMember.id, ...memberData },
      })
    } else {
      dispatch({
        type: 'ADD_TEAM_MEMBER',
        payload: memberData,
      })
    }

    onClose()
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      hourlyRate: '',
      status: 'active',
    })
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Team Member' : 'Add Team Member'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormInput
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter full name"
            error={errors.name}
            required
          />

          <FormInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter email address"
            error={errors.email}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.role}
                onChange={(value) => handleChange('role', value)}
                options={roleOptions}
                placeholder="Select role"
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.department}
                onChange={(value) => handleChange('department', value)}
                options={departmentOptions}
                placeholder="Select department"
              />
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Hourly Rate ($)"
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => handleChange('hourlyRate', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              error={errors.hourlyRate}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(value) => handleChange('status', value)}
                options={statusOptions}
              />
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Add Member'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
