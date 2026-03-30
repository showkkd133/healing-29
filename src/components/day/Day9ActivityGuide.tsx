import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import {
  ACTIVITIES,
  ACTIVITY_GUIDES,
  TIMER_DURATION_SEC,
  formatTime,
} from './Day9Constants'

// ─── Props ─────────────────────────────────────────────────────────

interface Day9ActivityGuideProps {
  readonly activityId: string
  readonly onTimerDone: (elapsedSec: number) => void
  readonly onChangeActivity: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day9ActivityGuide = React.memo(function Day9ActivityGuide({
  activityId,
  onTimerDone,
  onChangeActivity,
}: Day9ActivityGuideProps) {
  const [customActivity, setCustomActivity] = useState('')
  const [timerRunning, setTimerRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION_SEC)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activity = ACTIVITIES.find((a) => a.id === activityId)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // ─── Timer controls ─────────────────────────────────────────────

  const startTimer = useCallback(() => {
    setTimerRunning(true)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          timerRef.current = null
          setTimerRunning(false)
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
            // Haptics not available
          })
          // Notify parent that timer is done
          onTimerDone(TIMER_DURATION_SEC)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [onTimerDone])

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
    const elapsed = TIMER_DURATION_SEC - timeLeft
    onTimerDone(elapsed)
  }, [timeLeft, onTimerDone])

  const handleChangeActivity = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    onChangeActivity()
  }, [onChangeActivity])

  return (
    <>
      {/* Activity guide */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.guideSection}>
        <View style={styles.guideHeader}>
          <Text style={styles.guideIcon}>{activity?.icon}</Text>
          <Text style={styles.guideTitle}>{activity?.label}</Text>
        </View>

        {activityId === 'other' ? (
          <TextInput
            style={styles.customInput}
            value={customActivity}
            onChangeText={setCustomActivity}
            placeholder="输入你想做的事..."
            placeholderTextColor={COLORS.textTertiary}
            maxLength={50}
          />
        ) : (
          <View style={styles.guideList}>
            {(ACTIVITY_GUIDES[activityId] ?? []).map((item, index) => (
              <Animated.View
                key={`guide-${index}`}
                entering={FadeInDown.delay(index * 150).duration(300)}
                style={styles.guideItem}
              >
                <Text style={styles.guideItemDot}>•</Text>
                <Text style={styles.guideItemText}>{item}</Text>
              </Animated.View>
            ))}
          </View>
        )}
      </Animated.View>

      {/* Timer */}
      <Animated.View entering={FadeIn.delay(400).duration(400)} style={styles.timerSection}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <View style={styles.timerActions}>
          {!timerRunning ? (
            <TouchableOpacity
              style={styles.timerButton}
              onPress={startTimer}
              activeOpacity={0.8}
            >
              <Text style={styles.timerButtonText}>
                {timeLeft < TIMER_DURATION_SEC ? '继续' : '开始计时'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.timerButton, styles.timerButtonPause]}
              onPress={pauseTimer}
              activeOpacity={0.8}
            >
              <Text style={styles.timerButtonText}>暂停</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={skipTimer}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>跳过计时</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Change activity */}
      <TouchableOpacity
        style={styles.changeButton}
        onPress={handleChangeActivity}
        activeOpacity={0.7}
      >
        <Text style={styles.changeButtonText}>换一种活动</Text>
      </TouchableOpacity>
    </>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  guideSection: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING['2xl'],
    ...SHADOWS.sm,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  guideIcon: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  guideList: {
    gap: SPACING.md,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  guideItemDot: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: SPACING.sm,
    lineHeight: 24,
  },
  guideItemText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
    flex: 1,
  },
  customInput: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 2,
    marginBottom: SPACING.xl,
  },
  timerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  timerButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
  },
  timerButtonPause: {
    backgroundColor: COLORS.warning,
  },
  timerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
  },
  skipButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
  changeButton: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
  },
  changeButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
})

export default Day9ActivityGuide
