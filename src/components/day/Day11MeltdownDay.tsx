// Day 11 — Meltdown Day: orchestrates setup, meltdown, timeup, and completed phases

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert } from 'react-native'
import * as Haptics from 'expo-haptics'
import {
  DURATION_OPTIONS,
  EXTEND_CONFIRMATIONS_NEEDED,
  type Day11MeltdownDayProps,
  type MeltdownPhase,
} from './Day11constants'
import Day11SetupPhase from './Day11SetupPhase'
import Day11MeltdownPhase from './Day11MeltdownPhase'
import Day11TimeUpPhase from './Day11TimeUpPhase'
import Day11CompletedPhase from './Day11CompletedPhase'

// ─── Timer helper ─────────────────────────────────────────────────

const startCountdownTimer = (
  timerRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>,
  totalSeconds: number,
  setRemainingSeconds: React.Dispatch<React.SetStateAction<number>>,
  onTimeUp: () => void,
) => {
  if (timerRef.current) clearInterval(timerRef.current)

  setRemainingSeconds(totalSeconds)

  timerRef.current = setInterval(() => {
    setRemainingSeconds((prev) => {
      if (prev <= 1) {
        if (timerRef.current) clearInterval(timerRef.current)
        onTimeUp()
        return 0
      }
      return prev - 1
    })
  }, 1000)
}

// ─── Main component ───────────────────────────────────────────────

const Day11MeltdownDay = React.memo(function Day11MeltdownDay({
  onComplete,
}: Day11MeltdownDayProps) {
  const [phase, setPhase] = useState<MeltdownPhase>('setup')
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null)
  const [customMinutes, setCustomMinutes] = useState(60)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [expandedTool, setExpandedTool] = useState<string | null>(null)
  const [toolsUsed, setToolsUsed] = useState<readonly string[]>([])
  const [ventText, setVentText] = useState('')
  const [faceWashed, setFaceWashed] = useState(false)
  const [extendCount, setExtendCount] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const durationMinutes = useMemo(() => {
    if (!selectedDuration) return 0
    const option = DURATION_OPTIONS.find((o) => o.id === selectedDuration)
    return option?.minutes ?? customMinutes
  }, [selectedDuration, customMinutes])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleTimeUp = useCallback(() => {
    setPhase('timeup')
  }, [])

  // ─── Handlers ──────────────────────────────────────────────────

  const handleSelectDuration = useCallback(async (id: string) => {
    setSelectedDuration(id)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleStartMeltdown = useCallback(async () => {
    const minutes = selectedDuration === 'custom'
      ? customMinutes
      : (DURATION_OPTIONS.find((o) => o.id === selectedDuration)?.minutes ?? 60)

    setPhase('meltdown')
    startCountdownTimer(timerRef, minutes * 60, setRemainingSeconds, handleTimeUp)

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      // Haptics not available
    }
  }, [selectedDuration, customMinutes, handleTimeUp])

  const handleToolPress = useCallback(async (toolId: string) => {
    setExpandedTool((prev) => (prev === toolId ? null : toolId))
    setToolsUsed((prev) => (prev.includes(toolId) ? prev : [...prev, toolId]))
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleFaceWash = useCallback(async () => {
    setFaceWashed(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
  }, [])

  const handleExtend = useCallback(() => {
    const newCount = extendCount + 1
    setExtendCount(newCount)

    if (newCount < EXTEND_CONFIRMATIONS_NEEDED) {
      Alert.alert(
        '确认延长',
        `还需要确认 ${EXTEND_CONFIRMATIONS_NEEDED - newCount} 次才能延长崩溃时间`,
        [{ text: '知道了' }]
      )
    } else {
      setExtendCount(0)
      setPhase('meltdown')
      startCountdownTimer(timerRef, 30 * 60, setRemainingSeconds, handleTimeUp)
    }
  }, [extendCount, handleTimeUp])

  const handleComplete = useCallback(() => {
    setPhase('completed')
    onComplete({
      duration: durationMinutes,
      toolsUsed,
      faceWashed,
    })
  }, [durationMinutes, toolsUsed, faceWashed, onComplete])

  // ─── Phase routing ─────────────────────────────────────────────

  if (phase === 'completed') {
    return <Day11CompletedPhase />
  }

  if (phase === 'timeup') {
    return (
      <Day11TimeUpPhase
        faceWashed={faceWashed}
        extendCount={extendCount}
        onFaceWash={handleFaceWash}
        onExtend={handleExtend}
        onComplete={handleComplete}
      />
    )
  }

  if (phase === 'meltdown') {
    return (
      <Day11MeltdownPhase
        remainingSeconds={remainingSeconds}
        expandedTool={expandedTool}
        toolsUsed={toolsUsed}
        ventText={ventText}
        onToolPress={handleToolPress}
        onVentTextChange={setVentText}
      />
    )
  }

  return (
    <Day11SetupPhase
      selectedDuration={selectedDuration}
      customMinutes={customMinutes}
      onSelectDuration={handleSelectDuration}
      onSetCustomMinutes={setCustomMinutes}
      onStartMeltdown={handleStartMeltdown}
    />
  )
})

export default Day11MeltdownDay
