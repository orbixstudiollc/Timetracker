export const STORAGE_KEYS = {
  TEAM_MEMBERS: 'timetrack_team_members',
  PROJECTS: 'timetrack_projects',
  TASKS: 'timetrack_tasks',
  TIME_ENTRIES: 'timetrack_time_entries',
  LEAVE_REQUESTS: 'timetrack_leave_requests',
  ACTIVE_TIMER: 'timetrack_active_timer',
}

export const MEMBER_STATUS = {
  ACTIVE: 'active',
  AWAY: 'away',
  OFFLINE: 'offline',
}

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in-progress',
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed',
}

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
}

export const PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

export const LEAVE_TYPE = {
  ANNUAL: 'annual',
  SICK: 'sick',
  PERSONAL: 'personal',
}

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
]

export const ROLES = [
  'Senior Developer',
  'Junior Developer',
  'UI/UX Designer',
  'Product Manager',
  'Project Manager',
  'QA Engineer',
  'DevOps Engineer',
  'Marketing Specialist',
  'Sales Representative',
  'HR Manager',
]

export const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
}

export const STATUS_COLORS = {
  active: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-400',
}

export const PROJECT_STATUS_COLORS = {
  planning: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-purple-100 text-purple-800',
  'on-hold': 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
}

export const TASK_STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
}

export const LEAVE_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export const LEAVE_TYPE_COLORS = {
  annual: 'bg-blue-100 text-blue-800',
  sick: 'bg-red-100 text-red-800',
  personal: 'bg-purple-100 text-purple-800',
}
