import { MoreVertical, Calendar, Clock, Play, Pause, Square } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'
import { Avatar } from '../common/Avatar'
import { Badge } from '../common/Badge'
import { useApp } from '../../context/AppContext'
import { useTimerContext } from '../../context/TimerContext'
import { formatDate, formatDuration } from '../../utils/formatters'

const priorityColors = {
  high: 'danger',
  medium: 'warning',
  low: 'success',
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const { state } = useApp()
  const { timerState, startTimer, pauseTimer, stopTimer } = useTimerContext()
  const [showMenu, setShowMenu] = useState(false)

  const assignee = state.teamMembers.find((m) => m.id === task.assigneeId)
  const project = state.projects.find((p) => p.id === task.projectId)

  const isTimerRunning =
    timerState.isRunning && timerState.currentTaskId === task.id
  const isTimerPaused =
    !timerState.isRunning &&
    timerState.currentTaskId === task.id &&
    timerState.elapsedSeconds > 0

  const handleTimerToggle = () => {
    if (isTimerRunning) {
      pauseTimer()
    } else if (isTimerPaused) {
      startTimer(task.id, task.projectId)
    } else {
      startTimer(task.id, task.projectId)
    }
  }

  const handleTimerStop = () => {
    stopTimer()
  }

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ].filter((opt) => opt.value !== task.status)

  return (
    <div
      className={clsx(
        'bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow',
        isTimerRunning && 'ring-2 ring-primary-500'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={priorityColors[task.priority]} size="sm">
              {task.priority}
            </Badge>
            {project && (
              <span className="text-xs text-gray-500 truncate">
                {project.name}
              </span>
            )}
          </div>
          <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border z-20 py-1">
                <button
                  onClick={() => {
                    onEdit(task)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onStatusChange(task.id, option.value)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Move to {option.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    onDelete(task)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>
            {task.loggedHours.toFixed(1)}h / {task.estimatedHours}h
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        <div className="flex items-center gap-2">
          {assignee ? (
            <>
              <Avatar name={assignee.name} size="sm" />
              <span className="text-sm text-gray-600">{assignee.name}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400">Unassigned</span>
          )}
        </div>

        {task.status !== 'completed' && (
          <div className="flex items-center gap-1">
            {(isTimerRunning || isTimerPaused) && (
              <span className="text-xs font-mono text-primary-600 mr-1">
                {formatDuration(timerState.elapsedSeconds)}
              </span>
            )}
            <button
              onClick={handleTimerToggle}
              className={clsx(
                'p-1.5 rounded-full transition-colors',
                isTimerRunning
                  ? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
            </button>
            {(isTimerRunning || isTimerPaused) && (
              <button
                onClick={handleTimerStop}
                className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                <Square size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
