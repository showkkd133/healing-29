import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { COURAGE_POINTS } from './Day20Constants'
import Day20CourageBadge from './Day20CourageBadge'
import Day20ComfortSlider from './Day20ComfortSlider'

// ─── Props ─────────────────────────────────────────────────────────

interface Day20FeedbackSectionProps {
  readonly comfortLevel: number
  readonly onComfortChange: (value: number) => void
  readonly onComplete: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day20FeedbackSection = React.memo(function Day20FeedbackSection({
  comfortLevel,
  onComfortChange,
  onComplete,
}: Day20FeedbackSectionProps) {
  return (
    <Animated.View entering={FadeIn.duration(600)}>
      {/* Virtual feedback */}
      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackText}>
          {'0\u4EBA\u6CE8\u610F\u5230\u4F60\uFF0C\u4F46\u8FD9\u6B63\u662F\u91CD\u70B9'}
        </Text>
      </View>

      {/* Courage badge */}
      <View style={styles.courageSection}>
        <Day20CourageBadge points={COURAGE_POINTS} />
        <Text style={styles.courageCumulative}>
          {'\u7D2F\u8BA1\u52C7\u6C14\u503C\uFF1A'}{COURAGE_POINTS}
        </Text>
      </View>

      {/* Comfort slider */}
      <Day20ComfortSlider value={comfortLevel} onChange={onComfortChange} />

      {/* Complete button */}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          comfortLevel === 0 && styles.primaryButtonDisabled,
        ]}
        onPress={onComplete}
        disabled={comfortLevel === 0}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>{'\u5B8C\u6210'}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  feedbackCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    ...SHADOWS.sm,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  courageSection: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  courageCumulative: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day20FeedbackSection
