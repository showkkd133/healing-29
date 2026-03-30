import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import type { Day2Data } from '@/types'
import FlipCard from './Day2FlipCard'
import type { TaskItem } from './Day2FlipCard'

// ─── Props ─────────────────────────────────────────────────────────

interface Day2SurvivalKitProps {
  readonly onComplete: (data: Day2Data) => void
}

// ─── Task definitions ──────────────────────────────────────────────

const TASKS: readonly TaskItem[] = [
  { id: 0, title: '起床', icon: '🌅' },
  { id: 1, title: '吃一顿饭', icon: '🍚' },
  { id: 2, title: '洗个脸', icon: '💧' },
] as const

// ─── Main component ────────────────────────────────────────────────

const Day2SurvivalKit = React.memo(function Day2SurvivalKit({
  onComplete,
}: Day2SurvivalKitProps) {
  const [completed, setCompleted] = useState<readonly [boolean, boolean, boolean]>([
    false,
    false,
    false,
  ])
  const [showResult, setShowResult] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const allDone = completed[0] && completed[1] && completed[2]
  const completionRate = useMemo(
    () => completed.filter(Boolean).length / 3,
    [completed]
  )

  // Show result message after a brief delay once user interacts with all
  useEffect(() => {
    if (allDone && !showResult) {
      const timer = setTimeout(() => setShowResult(true), 800)
      return () => clearTimeout(timer)
    }
  }, [allDone, showResult])

  const handleFlip = useCallback(
    (index: number) => {
      setCompleted((prev) => {
        const next: [boolean, boolean, boolean] = [prev[0], prev[1], prev[2]]
        next[index] = true
        return next
      })
    },
    []
  )

  const handleContinue = useCallback(() => {
    setDismissed(true)
    onComplete({
      type: 'day2',
      tasksCompleted: completed,
      completionRate,
    })
  }, [completed, completionRate, onComplete])

  const handleSkip = useCallback(() => {
    setDismissed(true)
    onComplete({
      type: 'day2',
      tasksCompleted: completed,
      completionRate,
    })
  }, [completed, completionRate, onComplete])

  // ─── Render: dismissed ────────────────────────────────────────

  if (dismissed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>{allDone ? '🏆' : '🌱'}</Text>
          <Text style={styles.resultText}>
            {allDone
              ? '今天的KPI达成了，其他事都不重要'
              : '明天再试，没关系'}
          </Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: main ─────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Guidance */}
      <Animated.Text entering={FadeIn.delay(200).duration(600)} style={styles.guidanceText}>
        今天的 KPI 很简单
      </Animated.Text>

      {/* Task cards */}
      <View style={styles.cardsContainer}>
        {TASKS.map((task, index) => (
          <FlipCard
            key={task.id}
            task={task}
            flipped={completed[index]}
            onFlip={() => handleFlip(index)}
            index={index}
          />
        ))}
      </View>

      {/* Progress indicator */}
      <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.progressRow}>
        {TASKS.map((task, i) => (
          <View
            key={task.id}
            style={[styles.progressDot, completed[i] && styles.progressDotDone]}
          />
        ))}
      </Animated.View>

      {/* Result / Continue / Skip */}
      {showResult && allDone && (
        <Animated.View entering={FadeIn.duration(600)} style={styles.bottomSection}>
          <Text style={styles.allDoneText}>
            今天的KPI达成了，其他事都不重要
          </Text>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.shareButtonText}>分享 "我今天好好活着" 🎖</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {!allDone && completed.some(Boolean) && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>先到这里，明天继续</Text>
          </TouchableOpacity>
        </Animated.View>
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
  guidanceText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING['3xl'],
  },
  cardsContainer: {
    gap: SPACING.lg,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING['2xl'],
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  progressDotDone: {
    backgroundColor: COLORS.accent,
  },
  bottomSection: {
    marginTop: SPACING['3xl'],
    alignItems: 'center',
  },
  allDoneText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  shareButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.accent,
    ...SHADOWS.sm,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: SPACING['2xl'],
  },
  skipText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xl,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day2SurvivalKit
