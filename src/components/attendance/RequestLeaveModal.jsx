import { useState, useEffect, useMemo } from 'react'
import { Modal, ModalFooter } from '../common/Modal'
import { FormInput, FormTextarea } from '../common/Input'
import { FormSelect } from '../common/Select'
import { Button } from '../common/Button'
import { useApp } from '../../context/AppContext'
import { generateId } from '../../utils/formatters'
import { formatDateISO, getDaysBetween } from '../../utils/dateHelpers'

const typeOptions = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'personal', label: 'Personal Leave' },
]

const defaultForm = {
  type: 'annual',
  startDate: '',
  endDate: '',
  reason: '',
}

export default function RequestLeaveModal({ isOpen, onClose }) {
  const { state, dispatch } = useApp()
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})

  const currentUser = state.teamMembers[0]

  const totalDays = useMemo(() => {
    if (!form.startDate || !form.endDate) return 0
    return getDaysBetween(new Date(form.startDate), new Date(form.endDate))
  }, [form.startDate, form.endDate])

  useEffect(() => {
    if (isOpen) {
      setForm(defaultForm)
      setErrors({})
    }
  }, [isOpen])

  const handleChange = (field) => (e) => {
    const value = e.target ? e.target.value : e
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.startDate) newErrors.startDate = 'Start date is required'
    if (!form.endDate) newErrors.endDate = 'End date is required'
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      newErrors.endDate = 'End date must be after start date'
    }
    if (!form.reason.trim()) newErrors.reason = 'Reason is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    dispatch({
      type: 'ADD_LEAVE_REQUEST',
      payload: {
        id: generateId('lr'),
        teamMemberId: currentUser?.id,
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        totalDays,
        reason: form.reason.trim(),
        status: 'pending',
        approvedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })

    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Leave">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormSelect
            label="Leave Type"
            value={form.type}
            onChange={handleChange('type')}
            options={typeOptions}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={handleChange('startDate')}
              error={errors.startDate}
              min={formatDateISO(new Date())}
              required
            />

            <FormInput
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={handleChange('endDate')}
              error={errors.endDate}
              min={form.startDate || formatDateISO(new Date())}
              required
            />
          </div>

          {totalDays > 0 && (
            <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm">
              Total: {totalDays} day{totalDays > 1 ? 's' : ''}
            </div>
          )}

          <FormTextarea
            label="Reason"
            value={form.reason}
            onChange={handleChange('reason')}
            error={errors.reason}
            placeholder="Please provide a reason for your leave request..."
            rows={3}
            required
          />
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit">Submit Request</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
