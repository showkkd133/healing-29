import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'

// ─── Helpers ───────────────────────────────────────────────────────

const formatTimer = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ─── Props ─────────────────────────────────────────────────────────

interface Day19CooldownScreenProps {
  readonly cooldownRemaining: number
  readonly onSkip: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day19CooldownScreen = React.memo(function Day19CooldownScreen({
  cooldownRemaining,
  onSkip,
}: Day19CooldownScreenProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.cooldownContainer}>
        <Text style={styles.cooldownLabel}>冷静倒计时</Text>
        <Text style={styles.cooldownTimer}>{formatTimer(cooldownRemaining)}</Text>
        <Text style={styles.cooldownHint}>可以离开App，倒计时会继续</Text>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>跳过等待</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cooldownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING['3xl'],
  },
  cooldownLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  cooldownTimer: {
    fontSize: 56,
    fontWeight: '200',
    color: COLORS.text,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    marginBottom: SPACING.xl,
  },
  cooldownHint: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginBottom: SPACING['3xl'],
  },
  skipButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  skipButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
})

export default Day19CooldownScreen
