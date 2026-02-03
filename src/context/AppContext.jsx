import { createContext, useContext, useReducer, useEffect } from 'react'
import { loadAllData, saveAllData } from '../services/storageService'
import {
  mockTeamMembers,
  mockProjects,
  mockTasks,
  mockTimeEntries,
  mockLeaveRequests,
} from '../data'

const AppContext = createContext()

const initialState = {
  teamMembers: [],
  projects: [],
  tasks: [],
  timeEntries: [],
  leaveRequests: [],
  isLoaded: false,
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload, isLoaded: true }

    // Team Members
    case 'ADD_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: [...state.teamMembers, { ...action.payload, id: generateId() }],
      }
    case 'UPDATE_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: state.teamMembers.map(m =>
          m.id === action.payload.id ? { ...m, ...action.payload } : m
        ),
      }
    case 'DELETE_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: state.teamMembers.filter(m => m.id !== action.payload),
      }

    // Projects
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, { ...action.payload, id: generateId() }],
      }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      }
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
      }

    // Tasks
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: generateId() }],
      }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      }
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id
            ? { ...t, status: action.payload.status }
            : t
        ),
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
      }

    // Time Entries
    case 'ADD_TIME_ENTRY':
      return {
        ...state,
        timeEntries: [...state.timeEntries, { ...action.payload, id: generateId() }],
      }
    case 'UPDATE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.map(e =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      }
    case 'DELETE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.filter(e => e.id !== action.payload),
      }

    // Leave Requests
    case 'ADD_LEAVE_REQUEST':
      return {
        ...state,
        leaveRequests: [...state.leaveRequests, { ...action.payload, id: generateId() }],
      }
    case 'UPDATE_LEAVE_STATUS':
      return {
        ...state,
        leaveRequests: state.leaveRequests.map(lr =>
          lr.id === action.payload.id
            ? { ...lr, status: action.payload.status, approvedBy: action.payload.approvedBy }
            : lr
        ),
      }
    case 'DELETE_LEAVE_REQUEST':
      return {
        ...state,
        leaveRequests: state.leaveRequests.filter(lr => lr.id !== action.payload),
      }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load data on mount
  useEffect(() => {
    const storedData = loadAllData()
    const hasData = storedData.teamMembers && storedData.teamMembers.length > 0

    if (hasData) {
      dispatch({ type: 'LOAD_DATA', payload: storedData })
    } else {
      // Initialize with mock data
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          teamMembers: mockTeamMembers,
          projects: mockProjects,
          tasks: mockTasks,
          timeEntries: mockTimeEntries,
          leaveRequests: mockLeaveRequests,
        },
      })
    }
  }, [])

  // Persist changes
  useEffect(() => {
    if (state.isLoaded) {
      saveAllData({
        teamMembers: state.teamMembers,
        projects: state.projects,
        tasks: state.tasks,
        timeEntries: state.timeEntries,
        leaveRequests: state.leaveRequests,
      })
    }
  }, [state])

  // Helper functions
  const getTeamMember = (id) => state.teamMembers.find(m => m.id === id)
  const getProject = (id) => state.projects.find(p => p.id === id)
  const getTask = (id) => state.tasks.find(t => t.id === id)
  const getProjectTasks = (projectId) => state.tasks.filter(t => t.projectId === projectId)
  const getMemberTasks = (memberId) => state.tasks.filter(t => t.assigneeId === memberId)
  const getProjectTimeEntries = (projectId) => state.timeEntries.filter(e => e.projectId === projectId)
  const getMemberTimeEntries = (memberId) => state.timeEntries.filter(e => e.teamMemberId === memberId)
  const getMemberLeaveRequests = (memberId) => state.leaveRequests.filter(lr => lr.teamMemberId === memberId)

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        getTeamMember,
        getProject,
        getTask,
        getProjectTasks,
        getMemberTasks,
        getProjectTimeEntries,
        getMemberTimeEntries,
        getMemberLeaveRequests,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
