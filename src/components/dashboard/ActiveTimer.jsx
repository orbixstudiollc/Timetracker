import { Play, Pause, Square, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../common/Card'
import { Button } from '../common/Button'
import { useTimerContext } from '../../context/TimerContext'
import { useApp } from '../../context/AppContext'
import { formatDuration } from '../../utils/formatters'

export function ActiveTimer() {
  const {
    taskId,
    projectId,
    elapsedSeconds,
    isRunning,
    pauseTimer,
    resumeTimer,
    stopTimer,
  } = useTimerContext()
  const { getTask, getProject, dispatch, state } = useApp()

  const task = taskId ? getTask(taskId) : null
  const project = projectId ? getProject(projectId) : null

  const handleStop = () => {
    const result = stopTimer()
    if (result.taskId && result.hours > 0) {
      const taskData = getTask(result.taskId)
      const member = state.teamMembers[0] // Current user

      // Add time entry
      dispatch({
        type: 'ADD_TIME_ENTRY',
        payload: {
          teamMemberId: member.id,
          projectId: result.projectId,
          taskId: result.taskId,
          date: new Date().toISOString().split('T')[0],
          hours: Math.round(result.hours * 100) / 100,
          description: `Worked on: ${taskData?.title || 'Task'}`,
          billable: true,
          hourlyRate: member.hourlyRate,
          amount: Math.round(result.hours * member.hourlyRate * 100) / 100,
          createdAt: new Date().toISOString(),
        },
      })

      // Update task logged hours
      if (taskData) {
        dispatch({
          type: 'UPDATE_TASK',
          payload: {
            id: result.taskId,
            loggedHours: (taskData.loggedHours || 0) + result.hours,
          },
        })
      }
    }
  }

  if (!taskId) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Timer</h3>
          <p className="text-sm text-gray-500">Start tracking time from the Tasks page</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Timer</CardTitle>
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
          isRunning ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
          {isRunning ? 'Running' : 'Paused'}
        </span>
      </CardHeader>

      <div className="text-center mb-6">
        <div className="font-mono text-5xl font-bold text-primary-600 mb-2">
          {formatDuration(elapsedSeconds)}
        </div>
        {task && (
          <p className="text-lg text-gray-900 font-medium">{task.title}</p>
        )}
        {project && (
          <p className="text-sm text-gray-500">{project.name}</p>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        {isRunning ? (
          <Button onClick={pauseTimer} variant="secondary" icon={Pause}>
            Pause
          </Button>
        ) : (
          <Button onClick={resumeTimer} icon={Play}>
            Resume
          </Button>
        )}
        <Button onClick={handleStop} variant="danger" icon={Square}>
          Stop & Save
        </Button>
      </div>
    </Card>
  )
}
