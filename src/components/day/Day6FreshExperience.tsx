import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import Day6CompletedView from './Day6CompletedView'
import Day6RecordPhase from './Day6RecordPhase'
import Day6ExperienceCard from './Day6ExperienceCard'

// ─── Props ─────────────────────────────────────────────────────────

interface Day6FreshExperienceProps {
  readonly onComplete: (data: {
    readonly experienceType: string
    readonly completionMethod: string
    readonly reflection: string
  }) => void
}

// ─── Constants ─────────────────────────────────────────────────────

const EXPERIENCES = [
  { id: 'dance', label: '跟着视频跳30秒舞', icon: '💃' },
  { id: 'left-hand', label: '用左手刷牙', icon: '🪥' },
  { id: 'japanese', label: '学一句日语问候', icon: '🇯🇵' },
  { id: 'self-portrait', label: '画一个丑自画像', icon: '🎨' },
  { id: 'balance', label: '闭眼单脚站1分钟', icon: '🧘' },
] as const

const TIMER_DURATION_SEC = 5 * 60

// ─── Main component ────────────────────────────────────────────────

const Day6FreshExperience = React.memo(function Day6FreshExperience({
  onComplete,
}: Day6FreshExperienceProps) {
  const [selectedExperience, setSelectedExperience] = useState<typeof EXPERIENCES[number] | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION_SEC)
  const [timerDone, setTimerDone] = useState(false)
  const [recordMethod, setRecordMethod] = useState<string | null>(null)
  const [reflection, setReflection] = useState('')
  const [completed, setCompleted] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Dice rotation animation
  const diceRotation = useSharedValue(0)

  const diceStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${diceRotation.value}deg` }],
  }))

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // ─── Roll dice ──────────────────────────────────────────────────

  const rollDice = useCallback(async () => {
    // Clear any running timer before resetting state
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Animate dice
    diceRotation.value = withSequence(
      withTiming(360, { duration: 300, easing: Easing.inOut(Easing.ease) }),
      withTiming(720, { duration: 300, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 0 })
    )

    // Pick random experience
    const randomIndex = Math.floor(Math.random() * EXPERIENCES.length)
    setSelectedExperience(EXPERIENCES[randomIndex])
    setTimerRunning(false)
    setTimeLeft(TIMER_DURATION_SEC)
    setTimerDone(false)

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    } catch {
      // Haptics not available
    }
  }, [diceRotation])

  // ─── Timer controls ─────────────────────────────────────────────

  const startTimer = useCallback(() => {
    setTimerRunning(true)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          timerRef.current = null
          setTimerRunning(false)
          setTimerDone(true)
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
            // Haptics not available
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setTimerRunning(false)
  }, [])

  const skipTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setTimerRunning(false)
    setTimerDone(true)
  }, [])

  // ─── Complete ────────────────────────────────────────────────────

  const handleComplete = useCallback(() => {
    if (!selectedExperience || !recordMethod) return
    setCompleted(true)
    onComplete({
      experienceType: selectedExperience.id,
      completionMethod: recordMethod,
      reflection: reflection.trim(),
    })
  }, [selectedExperience, recordMethod, reflection, onComplete])

  // ─── Render ──────────────────────────────────────────────────────

  if (completed) {
    return <Day6CompletedView containerStyle={styles.container} />
  }

  if (timerDone) {
    return (
      <Day6RecordPhase
        containerStyle={styles.container}
        recordMethod={recordMethod}
        reflection={reflection}
        onRecordMethodChange={setRecordMethod}
        onReflectionChange={setReflection}
        onComplete={handleComplete}
      />
    )
  }

  return (
    <View style={styles.container}>
      {/* Dice area */}
      <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.diceArea}>
        <Animated.View style={diceStyle}>
          <Text style={styles.diceEmoji}>🎲</Text>
        </Animated.View>
        <TouchableOpacity
          style={styles.rollButton}
          onPress={rollDice}
          activeOpacity={0.8}
        >
          <Text style={styles.rollButtonText}>
            {selectedExperience ? '再试一次' : '掷骰子'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Selected experience card with timer */}
      {selectedExperience && (
        <Day6ExperienceCard
          experience={selectedExperience}
          timeLeft={timeLeft}
          timerRunning={timerRunning}
          timerDurationSec={TIMER_DURATION_SEC}
          onStart={startTimer}
          onPause={pauseTimer}
          onSkip={skipTimer}
        />
      )}
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
  diceArea: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  diceEmoji: {
    fontSize: 80,
    marginBottom: SPACING.xl,
  },
  rollButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.accent,
    ...SHADOWS.md,
  },
  rollButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
  },
})

export default Day6FreshExperience
