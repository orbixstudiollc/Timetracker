import { useState, useMemo } from 'react'
import { Plus, FolderKanban } from 'lucide-react'
import { Button } from '../components/common/Button'
import { SearchInput } from '../components/common/SearchInput'
import { Select } from '../components/common/Select'
import { EmptyState } from '../components/common/EmptyState'
import { ProjectCard, AddProjectModal } from '../components/projects'
import { useApp } from '../context/AppContext'
import { useModal } from '../hooks/useModal'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'planning', label: 'Planning' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export default function Projects() {
  const { state, dispatch } = useApp()
  const addModal = useModal()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [editProject, setEditProject] = useState(null)

  const filteredProjects = useMemo(() => {
    return state.projects.filter((project) => {
      const matchesSearch =
        !search ||
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.client.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = !status || project.status === status
      const matchesPriority = !priority || project.priority === priority

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [state.projects, search, status, priority])

  const handleEdit = (project) => {
    setEditProject(project)
    addModal.open()
  }

  const handleDelete = (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      dispatch({ type: 'DELETE_PROJECT', payload: project.id })
    }
  }

  const handleCloseModal = () => {
    setEditProject(null)
    addModal.close()
  }

  // Group projects by status
  const activeProjects = filteredProjects.filter((p) => p.status === 'in-progress')
  const planningProjects = filteredProjects.filter((p) => p.status === 'planning')
  const otherProjects = filteredProjects.filter(
    (p) => p.status !== 'in-progress' && p.status !== 'planning'
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500">
            {state.projects.length} projects, {activeProjects.length} active
          </p>
        </div>
        <Button icon={Plus} onClick={() => addModal.open()}>
          New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by project or client..."
          className="sm:w-80"
        />
        <Select
          value={status}
          onChange={setStatus}
          options={statusOptions}
          className="sm:w-44"
        />
        <Select
          value={priority}
          onChange={setPriority}
          options={priorityOptions}
          className="sm:w-44"
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="space-y-8">
          {activeProjects.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                In Progress ({activeProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {activeProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {planningProjects.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Planning ({planningProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {planningProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {otherProjects.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Other ({otherProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {otherProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description={
            search || status || priority
              ? 'Try adjusting your filters'
              : 'Create your first project to get started'
          }
          action={
            !search && !status && !priority ? (
              <Button icon={Plus} onClick={() => addModal.open()}>
                New Project
              </Button>
            ) : null
          }
        />
      )}

      <AddProjectModal
        isOpen={addModal.isOpen}
        onClose={handleCloseModal}
        editProject={editProject}
      />
    </div>
  )
}
