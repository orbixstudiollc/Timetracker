import { useState, useEffect, useMemo } from 'react'
import { Modal, ModalFooter } from '../common/Modal'
import { FormInput, FormTextarea, Checkbox } from '../common/Input'
import { FormSelect } from '../common/Select'
import { Button } from '../common/Button'
import { useApp } from '../../context/AppContext'
import { generateId } from '../../utils/formatters'
import { formatDateISO } from '../../utils/dateHelpers'

const defaultForm = {
  date: formatDateISO(new Date()),
  projectId: '',
  taskId: '',
  hours: '',
  description: '',
  billable: true,
}

export default function AddTimeEntryModal({ isOpen, onClose, editEntry }) {
  const { state, dispatch } = useApp()
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})

  const currentUser = state.teamMembers[0]

  const projectOptions = useMemo(
    () => [
      { value: '', label: 'Select Project' },
      ...state.projects.map((p) => ({ value: p.id, label: p.name })),
    ],
    [state.projects]
  )

  const taskOptions = useMemo(() => {
    if (!form.projectId) return [{ value: '', label: 'Select Task (optional)' }]
    const projectTasks = state.tasks.filter(
      (t) => t.projectId === form.projectId
    )
    return [
      { value: '', label: 'Select Task (optional)' },
      ...projectTasks.map((t) => ({ value: t.id, label: t.title })),
    ]
  }, [state.tasks, form.projectId])

  useEffect(() => {
    if (editEntry) {
      setForm({
        date: editEntry.date,
        projectId: editEntry.projectId,
        taskId: editEntry.taskId || '',
        hours: editEntry.hours.toString(),
        description: editEntry.description || '',
        billable: editEntry.billable,
      })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
  }, [editEntry, isOpen])

  const handleChange = (field) => (e) => {
    const value = e.target ? e.target.value : e
    setForm((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'projectId') {
        updated.taskId = ''
      }
      return updated
    })
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleCheckboxChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.checked }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.date) newErrors.date = 'Date is required'
    if (!form.projectId) newErrors.projectId = 'Project is required'
    if (!form.hours || parseFloat(form.hours) <= 0) {
      newErrors.hours = 'Valid hours required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const hours = parseFloat(form.hours)
    const hourlyRate = currentUser?.hourlyRate || 0

    const entryData = {
      date: form.date,
      projectId: form.projectId,
      taskId: form.taskId || null,
      hours,
      description: form.description.trim(),
      billable: form.billable,
      hourlyRate,
      amount: form.billable ? hours * hourlyRate : 0,
      teamMemberId: currentUser?.id,
    }

    if (editEntry) {
      dispatch({
        type: 'UPDATE_TIME_ENTRY',
        payload: { ...entryData, id: editEntry.id },
      })
    } else {
      dispatch({
        type: 'ADD_TIME_ENTRY',
        payload: {
          ...entryData,
          id: generateId('te'),
          createdAt: new Date().toISOString(),
        },
      })
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editEntry ? 'Edit Time Entry' : 'Add Time Entry'}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormInput
            label="Date"
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            error={errors.date}
            required
          />

          <FormSelect
            label="Project"
            value={form.projectId}
            onChange={handleChange('projectId')}
            options={projectOptions}
            error={errors.projectId}
            required
          />

          <FormSelect
            label="Task"
            value={form.taskId}
            onChange={handleChange('taskId')}
            options={taskOptions}
            disabled={!form.projectId}
          />

          <FormInput
            label="Hours"
            type="number"
            value={form.hours}
            onChange={handleChange('hours')}
            error={errors.hours}
            placeholder="0.0"
            min="0.25"
            step="0.25"
            required
          />

          <FormTextarea
            label="Description"
            value={form.description}
            onChange={handleChange('description')}
            placeholder="What did you work on?"
            rows={3}
          />

          <Checkbox
            label="Billable"
            checked={form.billable}
            onChange={handleCheckboxChange('billable')}
          />
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit">{editEntry ? 'Save Changes' : 'Add Entry'}</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
