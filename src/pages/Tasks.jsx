import { useState, useMemo } from 'react'
import { Plus, CheckSquare } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Select } from '../components/common/Select'
import { EmptyState } from '../components/common/EmptyState'
import { TaskBoard, AddTaskModal } from '../components/tasks'
import { useApp } from '../context/AppContext'
import { useModal } from '../hooks/useModal'

export default function Tasks() {
  const { state, dispatch } = useApp()
  const addModal = useModal()

  const [selectedProject, setSelectedProject] = useState('')
  const [selectedAssignee, setSelectedAssignee] = useState('')
  const [editTask, setEditTask] = useState(null)

  const projectOptions = useMemo(() => {
    return [
      { value: '', label: 'All Projects' },
      ...state.projects.map((p) => ({ value: p.id, label: p.name })),
    ]
  }, [state.projects])

  const assigneeOptions = useMemo(() => {
    return [
      { value: '', label: 'All Assignees' },
      ...state.teamMembers.map((m) => ({ value: m.id, label: m.name })),
    ]
  }, [state.teamMembers])

  const filteredTasks = useMemo(() => {
    return state.tasks.filter((task) => {
      const matchesProject = !selectedProject || task.projectId === selectedProject
      const matchesAssignee = !selectedAssignee || task.assigneeId === selectedAssignee
      return matchesProject && matchesAssignee
    })
  }, [state.tasks, selectedProject, selectedAssignee])

  const tasksByStatus = useMemo(() => {
    return {
      todo: filteredTasks.filter((t) => t.status === 'todo'),
      'in-progress': filteredTasks.filter((t) => t.status === 'in-progress'),
      completed: filteredTasks.filter((t) => t.status === 'completed'),
    }
  }, [filteredTasks])

  const handleEdit = (task) => {
    setEditTask(task)
    addModal.open()
  }

  const handleDelete = (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      dispatch({ type: 'DELETE_TASK', payload: task.id })
    }
  }

  const handleStatusChange = (taskId, newStatus) => {
    dispatch({
      type: 'UPDATE_TASK_STATUS',
      payload: { id: taskId, status: newStatus },
    })
  }

  const handleCloseModal = () => {
    setEditTask(null)
    addModal.close()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500">
            {filteredTasks.length} tasks, {tasksByStatus['in-progress'].length} in
            progress
          </p>
        </div>
        <Button icon={Plus} onClick={() => addModal.open()}>
          Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={selectedProject}
          onChange={setSelectedProject}
          options={projectOptions}
          className="sm:w-56"
        />
        <Select
          value={selectedAssignee}
          onChange={setSelectedAssignee}
          options={assigneeOptions}
          className="sm:w-48"
        />
      </div>

      {filteredTasks.length > 0 ? (
        <TaskBoard
          tasksByStatus={tasksByStatus}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description={
            selectedProject || selectedAssignee
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'
          }
          action={
            !selectedProject && !selectedAssignee ? (
              <Button icon={Plus} onClick={() => addModal.open()}>
                Add Task
              </Button>
            ) : null
          }
        />
      )}

      <AddTaskModal
        isOpen={addModal.isOpen}
        onClose={handleCloseModal}
        editTask={editTask}
      />
    </div>
  )
}
