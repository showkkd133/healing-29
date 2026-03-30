import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Timer formatting ──────────────────────────────────────────────

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ─── Pulsing dot ───────────────────────────────────────────────────

const PulsingDot = React.memo(function PulsingDot() {
  const scale = useSharedValue(1)

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
  }, [scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return <Animated.View style={[styles.pulsingDot, animatedStyle]} />
})

// ─── Timer display ─────────────────────────────────────────────────

interface Day18SilenceTimerProps {
  readonly elapsedSeconds: number
}

const Day18SilenceTimer = React.memo(function Day18SilenceTimer({
  elapsedSeconds,
}: Day18SilenceTimerProps) {
  return (
    <Animated.View entering={FadeIn.delay(900).duration(400)} style={styles.timerSection}>
      <View style={styles.timerHeader}>
        <PulsingDot />
        <Text style={styles.timerLabel}>已静默</Text>
      </View>
      <Text style={styles.timerText}>{formatDuration(elapsedSeconds)}</Text>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  timerSection: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    paddingVertical: SPACING.xl,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  timerLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '200',
    color: COLORS.text,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
})

export default Day18SilenceTimer
