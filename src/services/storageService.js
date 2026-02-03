import { STORAGE_KEYS } from '../utils/constants'

export function loadFromStorage(key) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error loading from storage: ${key}`, error)
    return null
  }
}

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to storage: ${key}`, error)
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from storage: ${key}`, error)
  }
}

export function clearAllStorage() {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key)
  })
}

export function loadAllData() {
  return {
    teamMembers: loadFromStorage(STORAGE_KEYS.TEAM_MEMBERS),
    projects: loadFromStorage(STORAGE_KEYS.PROJECTS),
    tasks: loadFromStorage(STORAGE_KEYS.TASKS),
    timeEntries: loadFromStorage(STORAGE_KEYS.TIME_ENTRIES),
    leaveRequests: loadFromStorage(STORAGE_KEYS.LEAVE_REQUESTS),
  }
}

export function saveAllData(data) {
  if (data.teamMembers) saveToStorage(STORAGE_KEYS.TEAM_MEMBERS, data.teamMembers)
  if (data.projects) saveToStorage(STORAGE_KEYS.PROJECTS, data.projects)
  if (data.tasks) saveToStorage(STORAGE_KEYS.TASKS, data.tasks)
  if (data.timeEntries) saveToStorage(STORAGE_KEYS.TIME_ENTRIES, data.timeEntries)
  if (data.leaveRequests) saveToStorage(STORAGE_KEYS.LEAVE_REQUESTS, data.leaveRequests)
}
