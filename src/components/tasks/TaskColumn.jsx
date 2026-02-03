import { clsx } from 'clsx'
import TaskCard from './TaskCard'

export default function TaskColumn({
  title,
  status,
  color,
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          'flex items-center justify-between px-4 py-3 rounded-t-lg',
          color
        )}
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-600 bg-white px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 bg-gray-50 rounded-b-lg p-3 space-y-3 min-h-[400px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No tasks
          </div>
        )}
      </div>
    </div>
  )
}
