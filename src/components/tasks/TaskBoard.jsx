import TaskColumn from './TaskColumn'

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'completed', title: 'Completed', color: 'bg-green-100' },
]

export default function TaskBoard({
  tasksByStatus,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <TaskColumn
          key={column.id}
          title={column.title}
          status={column.id}
          color={column.color}
          tasks={tasksByStatus[column.id] || []}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
