import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'
import { SATISFACTION_OPTIONS, REGRET_TEXT } from './Day23Types'

// ─── Props ─────────────────────────────────────────────────────────

interface Day23FeedbackPhaseProps {
  readonly lastChoice: string | null
  readonly showRegretMsg: boolean
  readonly onSatisfaction: (satisfaction: string) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day23FeedbackPhase = React.memo(function Day23FeedbackPhase({
  lastChoice,
  showRegretMsg,
  onSatisfaction,
}: Day23FeedbackPhaseProps) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.feedbackContainer}>
      <Text style={styles.feedbackChoice}>你选了「{lastChoice}」</Text>

      {showRegretMsg ? (
        <Animated.Text entering={FadeIn.duration(400)} style={styles.regretText}>
          {REGRET_TEXT}
        </Animated.Text>
      ) : (
        <View style={styles.satisfactionRow}>
          {SATISFACTION_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={styles.satisfactionButton}
              onPress={() => onSatisfaction(opt.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.satisfactionEmoji}>{opt.emoji}</Text>
              <Text style={styles.satisfactionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackChoice: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING['3xl'],
  },
  satisfactionRow: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  satisfactionButton: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  satisfactionEmoji: {
    fontSize: 40,
  },
  satisfactionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  regretText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 28,
  },
})

export default Day23FeedbackPhase
