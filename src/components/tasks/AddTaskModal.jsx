import { useState, useEffect } from 'react'
import { Modal, ModalFooter } from '../common/Modal'
import { FormInput, FormTextarea } from '../common/Input'
import { FormSelect } from '../common/Select'
import { Button } from '../common/Button'
import { useApp } from '../../context/AppContext'
import { generateId } from '../../utils/formatters'

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const defaultForm = {
  title: '',
  description: '',
  projectId: '',
  assigneeId: '',
  status: 'todo',
  priority: 'medium',
  estimatedHours: '',
  dueDate: '',
}

export default function AddTaskModal({ isOpen, onClose, editTask }) {
  const { state, dispatch } = useApp()
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})

  const projectOptions = [
    { value: '', label: 'Select Project' },
    ...state.projects.map((p) => ({ value: p.id, label: p.name })),
  ]

  const assigneeOptions = [
    { value: '', label: 'Unassigned' },
    ...state.teamMembers.map((m) => ({ value: m.id, label: m.name })),
  ]

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title,
        description: editTask.description || '',
        projectId: editTask.projectId,
        assigneeId: editTask.assigneeId || '',
        status: editTask.status,
        priority: editTask.priority,
        estimatedHours: editTask.estimatedHours?.toString() || '',
        dueDate: editTask.dueDate || '',
      })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
  }, [editTask, isOpen])

  const handleChange = (field) => (e) => {
    const value = e.target ? e.target.value : e
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.projectId) newErrors.projectId = 'Project is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const taskData = {
      title: form.title.trim(),
      description: form.description.trim(),
      projectId: form.projectId,
      assigneeId: form.assigneeId || null,
      status: form.status,
      priority: form.priority,
      estimatedHours: parseFloat(form.estimatedHours) || 0,
      dueDate: form.dueDate || null,
    }

    if (editTask) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...taskData, id: editTask.id, loggedHours: editTask.loggedHours },
      })
    } else {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          ...taskData,
          id: generateId('task'),
          loggedHours: 0,
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
      })
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTask ? 'Edit Task' : 'Add New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormInput
            label="Title"
            value={form.title}
            onChange={handleChange('title')}
            error={errors.title}
            placeholder="Enter task title"
            required
          />

          <FormTextarea
            label="Description"
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Describe the task..."
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Project"
              value={form.projectId}
              onChange={handleChange('projectId')}
              options={projectOptions}
              error={errors.projectId}
              required
            />

            <FormSelect
              label="Assignee"
              value={form.assigneeId}
              onChange={handleChange('assigneeId')}
              options={assigneeOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Status"
              value={form.status}
              onChange={handleChange('status')}
              options={statusOptions}
            />

            <FormSelect
              label="Priority"
              value={form.priority}
              onChange={handleChange('priority')}
              options={priorityOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Estimated Hours"
              type="number"
              value={form.estimatedHours}
              onChange={handleChange('estimatedHours')}
              placeholder="0"
              min="0"
              step="0.5"
            />

            <FormInput
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={handleChange('dueDate')}
            />
          </div>
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit">{editTask ? 'Save Changes' : 'Add Task'}</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
