import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  Clock,
  Calendar,
  BarChart3,
  Timer,
  X,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useTimerContext } from '../../context/TimerContext'
import { useApp } from '../../context/AppContext'
import { formatDuration } from '../../utils/formatters'

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Team', path: '/team', icon: Users },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Timesheet', path: '/timesheet', icon: Clock },
  { name: 'Attendance', path: '/attendance', icon: Calendar },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
]

export function Sidebar({ isOpen, onClose }) {
  const { taskId, elapsedSeconds, isRunning } = useTimerContext()
  const { getTask, getProject } = useApp()

  const activeTask = taskId ? getTask(taskId) : null
  const activeProject = activeTask ? getProject(activeTask.projectId) : null

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">TimeTrack Pro</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Active Timer */}
          {taskId && (
            <div className="p-4 border-b border-gray-200 bg-primary-50">
              <div className="flex items-center gap-2 mb-2">
                <Timer className={clsx('w-4 h-4', isRunning ? 'text-primary-600 animate-pulse' : 'text-gray-500')} />
                <span className="text-xs font-medium text-gray-600">
                  {isRunning ? 'Timer Running' : 'Timer Paused'}
                </span>
              </div>
              <div className="font-mono text-xl font-bold text-primary-600 mb-1">
                {formatDuration(elapsedSeconds)}
              </div>
              {activeTask && (
                <p className="text-sm text-gray-600 truncate">{activeTask.title}</p>
              )}
              {activeProject && (
                <p className="text-xs text-gray-500 truncate">{activeProject.name}</p>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              TimeTrack Pro v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
