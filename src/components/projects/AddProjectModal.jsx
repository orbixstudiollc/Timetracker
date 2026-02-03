import { useState, useEffect } from 'react'
import { Modal, ModalFooter } from '../common/Modal'
import { Button } from '../common/Button'
import { FormInput, FormTextarea } from '../common/Input'
import { Select } from '../common/Select'
import { useApp } from '../../context/AppContext'
import { PROJECT_STATUS, PRIORITY } from '../../utils/constants'

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export function AddProjectModal({ isOpen, onClose, editProject }) {
  const { state, dispatch } = useApp()
  const isEditing = !!editProject

  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    deadline: '',
    budget: '',
    estimatedHours: '',
    teamMemberIds: [],
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editProject) {
      setFormData({
        name: editProject.name || '',
        client: editProject.client || '',
        description: editProject.description || '',
        status: editProject.status || 'planning',
        priority: editProject.priority || 'medium',
        startDate: editProject.startDate || '',
        deadline: editProject.deadline || '',
        budget: editProject.budget || '',
        estimatedHours: editProject.estimatedHours || '',
        teamMemberIds: editProject.teamMemberIds || [],
      })
    } else {
      setFormData({
        name: '',
        client: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        deadline: '',
        budget: '',
        estimatedHours: '',
        teamMemberIds: [],
      })
    }
  }, [editProject, isOpen])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const toggleMember = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      teamMemberIds: prev.teamMemberIds.includes(memberId)
        ? prev.teamMemberIds.filter((id) => id !== memberId)
        : [...prev.teamMemberIds, memberId],
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Project name is required'
    if (!formData.client.trim()) newErrors.client = 'Client name is required'
    if (!formData.deadline) newErrors.deadline = 'Deadline is required'
    if (!formData.budget || formData.budget <= 0)
      newErrors.budget = 'Valid budget is required'
    if (!formData.estimatedHours || formData.estimatedHours <= 0)
      newErrors.estimatedHours = 'Valid estimated hours is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const projectData = {
      ...formData,
      budget: parseFloat(formData.budget),
      estimatedHours: parseInt(formData.estimatedHours),
      spent: editProject?.spent || 0,
      loggedHours: editProject?.loggedHours || 0,
      progress: editProject?.progress || 0,
      createdAt: editProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (isEditing) {
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: { id: editProject.id, ...projectData },
      })
    } else {
      dispatch({
        type: 'ADD_PROJECT',
        payload: projectData,
      })
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Project Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter project name"
              error={errors.name}
              required
            />
            <FormInput
              label="Client"
              value={formData.client}
              onChange={(e) => handleChange('client', e.target.value)}
              placeholder="Enter client name"
              error={errors.client}
              required
            />
          </div>

          <FormTextarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter project description"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <Select
                value={formData.priority}
                onChange={(value) => handleChange('priority', value)}
                options={priorityOptions}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
            <FormInput
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
              error={errors.deadline}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Budget ($)"
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              placeholder="0.00"
              min="0"
              step="100"
              error={errors.budget}
              required
            />
            <FormInput
              label="Estimated Hours"
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => handleChange('estimatedHours', e.target.value)}
              placeholder="0"
              min="0"
              error={errors.estimatedHours}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Members
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
              <div className="grid grid-cols-2 gap-2">
                {state.teamMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.teamMemberIds.includes(member.id)}
                      onChange={() => toggleMember(member.id)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{member.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
