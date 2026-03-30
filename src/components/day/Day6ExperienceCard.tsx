import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Types ─────────────────────────────────────────────────────────

interface Experience {
  readonly id: string
  readonly label: string
  readonly icon: string
}

// ─── Props ─────────────────────────────────────────────────────────

interface Day6ExperienceCardProps {
  readonly experience: Experience
  readonly timeLeft: number
  readonly timerRunning: boolean
  readonly timerDurationSec: number
  readonly onStart: () => void
  readonly onPause: () => void
  readonly onSkip: () => void
}

// ─── Timer formatting ──────────────────────────────────────────────

const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

// ─── Component ─────────────────────────────────────────────────────

const Day6ExperienceCard = React.memo(function Day6ExperienceCard({
  experience,
  timeLeft,
  timerRunning,
  timerDurationSec,
  onStart,
  onPause,
  onSkip,
}: Day6ExperienceCardProps) {
  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.experienceCard}>
      <Text style={styles.experienceIcon}>{experience.icon}</Text>
      <Text style={styles.experienceLabel}>{experience.label}</Text>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <View style={styles.timerActions}>
          {!timerRunning ? (
            <TouchableOpacity
              style={styles.timerButton}
              onPress={onStart}
              activeOpacity={0.8}
            >
              <Text style={styles.timerButtonText}>
                {timeLeft < timerDurationSec ? '继续' : '开始'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.timerButton, styles.timerButtonPause]}
              onPress={onPause}
              activeOpacity={0.8}
            >
              <Text style={styles.timerButtonText}>暂停</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>跳过计时</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  experienceCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING['2xl'],
    alignItems: 'center',
    ...SHADOWS.md,
  },
  experienceIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  experienceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
  },
  timerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  timerText: {
    fontSize: 40,
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
    paddingVertical: 12,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
  },
  timerButtonPause: {
    backgroundColor: COLORS.warning,
  },
  timerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.card,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
  },
  skipButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
})

export default Day6ExperienceCard
