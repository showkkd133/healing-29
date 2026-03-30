// NOTE: Not currently imported by any component — candidate for integration or removal
//
// Generic countdown timer hook

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseCountdown {
  readonly secondsLeft: number
  readonly isRunning: boolean
  readonly start: (seconds: number) => void
  readonly pause: () => void
  readonly resume: () => void
  readonly reset: () => void
}

export const useCountdown = (): UseCountdown => {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  // Tick effect — manages the interval based on isRunning state
  useEffect(() => {
    if (!isRunning) {
      clearTimer()
      return
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearTimer()
  }, [isRunning, clearTimer])

  const start = useCallback((seconds: number) => {
    if (seconds <= 0) return
    setSecondsLeft(Math.ceil(seconds))
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    setSecondsLeft((current) => {
      if (current > 0) {
        setIsRunning(true)
      }
      return current
    })
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setSecondsLeft(0)
  }, [])

  return {
    secondsLeft,
    isRunning,
    start,
    pause,
    resume,
    reset,
  } as const
}
