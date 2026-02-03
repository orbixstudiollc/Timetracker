import { useState, useRef, useCallback, useEffect } from 'react'

export function useTimer(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    const totalSeconds = seconds
    setSeconds(0)
    return totalSeconds
  }, [seconds])

  const reset = useCallback(() => {
    setSeconds(0)
    setIsRunning(false)
  }, [])

  const setTime = useCallback((newSeconds) => {
    setSeconds(newSeconds)
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1)
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  return {
    seconds,
    isRunning,
    start,
    pause,
    stop,
    reset,
    setTime,
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    secs: seconds % 60,
  }
}
