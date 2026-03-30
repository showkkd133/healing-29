// NOTE: Not currently imported by any component — candidate for integration or removal
// Day1EmotionWeather inlines equivalent expo-av recording logic (permission, start, stop, auto-stop at 3 min).
// This hook provides the same capabilities in a cleaner, reusable form (ref-based cleanup, cancelRecording,
// duration counter). Consider replacing the inline logic in Day1EmotionWeather with this hook.
//
// Audio recording hook using expo-av with permission handling and auto-stop

import { useState, useRef, useCallback, useEffect } from 'react'
import { Audio } from 'expo-av'

const MAX_RECORDING_SECONDS = 180 // 3 minutes

interface UseAudioRecorder {
  readonly isRecording: boolean
  readonly duration: number
  readonly startRecording: () => Promise<void>
  readonly stopRecording: () => Promise<string | null>
  readonly cancelRecording: () => void
}

export const useAudioRecorder = (): UseAudioRecorder => {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)

  const recordingRef = useRef<Audio.Recording | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearTimer()
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {})
      }
    }
  }, [])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { granted } = await Audio.requestPermissionsAsync()
      return granted
    } catch (error) {
      console.error('Failed to request audio permission:', error)
      return false
    }
  }

  const startRecording = useCallback(async () => {
    try {
      const hasPermission = await requestPermission()
      if (!hasPermission) {
        throw new Error('Microphone permission not granted')
      }

      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const recording = new Audio.Recording()
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      await recording.startAsync()

      recordingRef.current = recording
      setIsRecording(true)
      setDuration(0)

      // Start duration timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const next = prev + 1
          // Auto-stop at max duration
          if (next >= MAX_RECORDING_SECONDS) {
            stopRecordingInternal()
          }
          return next
        })
      }, 1000)
    } catch (error) {
      console.error('Failed to start recording:', error)
      throw new Error('录音启动失败，请检查麦克风权限')
    }
  }, [])

  const stopRecordingInternal = useCallback(async (): Promise<string | null> => {
    clearTimer()

    const recording = recordingRef.current
    if (!recording) return null

    try {
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      recordingRef.current = null
      setIsRecording(false)

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      })

      return uri ?? null
    } catch (error) {
      console.error('Failed to stop recording:', error)
      recordingRef.current = null
      setIsRecording(false)
      return null
    }
  }, [clearTimer])

  const stopRecording = useCallback(async (): Promise<string | null> => {
    return stopRecordingInternal()
  }, [stopRecordingInternal])

  const cancelRecording = useCallback(() => {
    clearTimer()

    const recording = recordingRef.current
    if (recording) {
      recording.stopAndUnloadAsync().catch(() => {})
      recordingRef.current = null
    }

    setIsRecording(false)
    setDuration(0)
  }, [clearTimer])

  return {
    isRecording,
    duration,
    startRecording,
    stopRecording,
    cancelRecording,
  } as const
}
