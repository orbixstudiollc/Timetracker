import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import { loadFromStorage, saveToStorage } from '../services/storageService'

const TimerContext = createContext()

const initialState = {
  isRunning: false,
  taskId: null,
  projectId: null,
  startTime: null,
  elapsedSeconds: 0,
}

function timerReducer(state, action) {
  switch (action.type) {
    case 'LOAD_TIMER':
      return { ...state, ...action.payload }

    case 'START_TIMER':
      return {
        ...state,
        isRunning: true,
        taskId: action.payload.taskId,
        projectId: action.payload.projectId,
        startTime: Date.now(),
        elapsedSeconds: action.payload.elapsedSeconds || 0,
      }

    case 'PAUSE_TIMER':
      return {
        ...state,
        isRunning: false,
        startTime: null,
      }

    case 'RESUME_TIMER':
      return {
        ...state,
        isRunning: true,
        startTime: Date.now(),
      }

    case 'TICK':
      return {
        ...state,
        elapsedSeconds: state.elapsedSeconds + 1,
      }

    case 'STOP_TIMER':
      return {
        ...initialState,
      }

    case 'RESET_TIMER':
      return {
        ...state,
        elapsedSeconds: 0,
        startTime: state.isRunning ? Date.now() : null,
      }

    default:
      return state
  }
}

export function TimerProvider({ children }) {
  const [state, dispatch] = useReducer(timerReducer, initialState)
  const intervalRef = useRef(null)

  // Load timer state from storage on mount
  useEffect(() => {
    const savedTimer = loadFromStorage(STORAGE_KEYS.ACTIVE_TIMER)
    if (savedTimer && savedTimer.taskId) {
      // Calculate elapsed time since last save if timer was running
      let elapsedSeconds = savedTimer.elapsedSeconds || 0
      if (savedTimer.isRunning && savedTimer.startTime) {
        const additionalSeconds = Math.floor((Date.now() - savedTimer.startTime) / 1000)
        elapsedSeconds += additionalSeconds
      }

      dispatch({
        type: 'LOAD_TIMER',
        payload: {
          ...savedTimer,
          elapsedSeconds,
          startTime: savedTimer.isRunning ? Date.now() : null,
        },
      })
    }
  }, [])

  // Save timer state to storage when it changes
  useEffect(() => {
    if (state.taskId) {
      saveToStorage(STORAGE_KEYS.ACTIVE_TIMER, state)
    } else {
      saveToStorage(STORAGE_KEYS.ACTIVE_TIMER, null)
    }
  }, [state])

  // Timer interval
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.isRunning])

  const startTimer = (taskId, projectId, elapsedSeconds = 0) => {
    dispatch({ type: 'START_TIMER', payload: { taskId, projectId, elapsedSeconds } })
  }

  const pauseTimer = () => {
    dispatch({ type: 'PAUSE_TIMER' })
  }

  const resumeTimer = () => {
    dispatch({ type: 'RESUME_TIMER' })
  }

  const stopTimer = () => {
    const result = {
      taskId: state.taskId,
      projectId: state.projectId,
      elapsedSeconds: state.elapsedSeconds,
      hours: state.elapsedSeconds / 3600,
    }
    dispatch({ type: 'STOP_TIMER' })
    return result
  }

  const resetTimer = () => {
    dispatch({ type: 'RESET_TIMER' })
  }

  return (
    <TimerContext.Provider
      value={{
        ...state,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        resetTimer,
        hours: Math.floor(state.elapsedSeconds / 3600),
        minutes: Math.floor((state.elapsedSeconds % 3600) / 60),
        seconds: state.elapsedSeconds % 60,
      }}
    >
      {children}
    </TimerContext.Provider>
  )
}

export function useTimerContext() {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider')
  }
  return context
}
