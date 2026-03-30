import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  FadeIn, useSharedValue, withTiming, withRepeat, withSequence, cancelAnimation,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING } from '@/constants/theme'
import { DECISION_PAIRS, DECISION_TIMEOUT_MS, COMPLETION_TEXT, type DecisionEntry } from './Day23Types'
import Day23ChoosingPhase from './Day23ChoosingPhase'
import Day23FeedbackPhase from './Day23FeedbackPhase'
import Day23StatsPhase from './Day23StatsPhase'

interface Day23QuickDecisionProps {
  readonly onComplete: (data: {
    readonly decisions: ReadonlyArray<{
      readonly choice: string
      readonly time: number
      readonly satisfaction: string
    }>
    readonly avgTime: number
  }) => void
}

// ─── Main component ────────────────────────────────────────────────

const Day23QuickDecision = React.memo(function Day23QuickDecision({
  onComplete,
}: Day23QuickDecisionProps) {
  const [decisions, setDecisions] = useState<ReadonlyArray<DecisionEntry>>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<'choosing' | 'feedback' | 'stats'>('choosing')
  const [elapsed, setElapsed] = useState(0)
  const [lastChoice, setLastChoice] = useState<string | null>(null)
  const [showRegretMsg, setShowRegretMsg] = useState(false)
  const [completed, setCompleted] = useState(false)

  const startTimeRef = useRef(Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const regretTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Blink animation shared value (passed to choosing phase)
  const blinkOpacity = useSharedValue(1)

  const currentPair = DECISION_PAIRS[currentIndex % DECISION_PAIRS.length]

  // Start / restart timer for each decision
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    startTimeRef.current = Date.now()
    setElapsed(0)
    timerRef.current = setInterval(() => {
      const ms = Date.now() - startTimeRef.current
      setElapsed(ms)
    }, 100)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Initialize timer on mount
  useEffect(() => {
    startTimer()
    return () => stopTimer()
  }, [startTimer, stopTimer])

  // Cleanup pending timeouts on unmount
  useEffect(() => () => {
    if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current)
    if (regretTimeoutRef.current) clearTimeout(regretTimeoutRef.current)
  }, [])

  const handleChoiceMade = useCallback(async (choice: string, _timeMs: number) => {
    stopTimer()
    setLastChoice(choice)
    setPhase('feedback')
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      // Haptics not available
    }
  }, [stopTimer])

  // Auto-select when timeout
  useEffect(() => {
    if (phase !== 'choosing') return
    if (elapsed >= DECISION_TIMEOUT_MS) {
      stopTimer()
      // Random auto-select with blink effect
      blinkOpacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 100 }),
          withTiming(1, { duration: 100 })
        ),
        3,
        false
      )

      const randomChoice = Math.random() > 0.5 ? currentPair.optionA : currentPair.optionB
      autoTimeoutRef.current = setTimeout(() => {
        cancelAnimation(blinkOpacity)
        blinkOpacity.value = 1
        handleChoiceMade(randomChoice, DECISION_TIMEOUT_MS)
      }, 600)
    }
  }, [elapsed, phase])

  const handleChoice = useCallback((choice: string) => {
    if (phase !== 'choosing') return
    const timeMs = Date.now() - startTimeRef.current
    handleChoiceMade(choice, Math.min(timeMs, DECISION_TIMEOUT_MS))
  }, [phase, handleChoiceMade])

  const advanceOrFinish = useCallback((updatedDecisions: ReadonlyArray<DecisionEntry>) => {
    if (updatedDecisions.length >= DECISION_PAIRS.length) {
      setPhase('stats')
    } else {
      setCurrentIndex((prev) => prev + 1)
      setPhase('choosing')
      startTimer()
    }
  }, [startTimer])

  const handleSatisfaction = useCallback(async (satisfaction: string) => {
    const timeMs = Date.now() - startTimeRef.current
    const newDecision: DecisionEntry = {
      choice: lastChoice ?? '',
      time: Math.round(timeMs / 100) / 10,
      satisfaction,
    }
    const updatedDecisions = [...decisions, newDecision]
    setDecisions(updatedDecisions)

    if (satisfaction === 'regret') {
      setShowRegretMsg(true)
      try {
        await Haptics.selectionAsync()
      } catch {
        // Haptics not available
      }
      regretTimeoutRef.current = setTimeout(() => {
        setShowRegretMsg(false)
        advanceOrFinish(updatedDecisions)
      }, 1500)
    } else {
      advanceOrFinish(updatedDecisions)
    }
  }, [lastChoice, decisions, advanceOrFinish])

  const handleComplete = useCallback(async () => {
    setCompleted(true)
    const totalTime = decisions.reduce((sum, d) => sum + d.time, 0)
    const avgTime = decisions.length > 0 ? Math.round((totalTime / decisions.length) * 10) / 10 : 0
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
    onComplete({
      decisions: [...decisions],
      avgTime,
    })
  }, [decisions, onComplete])

  const timeRemaining = Math.max(0, DECISION_TIMEOUT_MS - elapsed)
  const progress = timeRemaining / DECISION_TIMEOUT_MS

  // ─── Render: completed state ──────────────────────────────────

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>⚡</Text>
          <Text style={styles.completedText}>{COMPLETION_TEXT}</Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: stats ────────────────────────────────────────────

  if (phase === 'stats') {
    return (
      <View style={styles.container}>
        <Day23StatsPhase decisions={decisions} onComplete={handleComplete} />
      </View>
    )
  }

  // ─── Render: feedback ─────────────────────────────────────────

  if (phase === 'feedback') {
    return (
      <View style={styles.container}>
        <Day23FeedbackPhase
          lastChoice={lastChoice}
          showRegretMsg={showRegretMsg}
          onSatisfaction={handleSatisfaction}
        />
      </View>
    )
  }

  // ─── Render: choosing ─────────────────────────────────────────

  return (
    <View style={styles.container}>
      <Day23ChoosingPhase
        currentIndex={currentIndex}
        timeRemaining={timeRemaining}
        progress={progress}
        blinkOpacity={blinkOpacity}
        onChoice={handleChoice}
      />
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xl,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day23QuickDecision
