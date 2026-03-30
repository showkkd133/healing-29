import React, { useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Types ─────────────────────────────────────────────────────────

export type SelfLoveAnswer = '是' | '否' | '说不清'

const ANSWER_OPTIONS: readonly SelfLoveAnswer[] = ['是', '否', '说不清']

// ─── Props ─────────────────────────────────────────────────────────

interface Day17QuestionCardProps {
  readonly selectedAnswer: SelfLoveAnswer | null
  readonly onAnswer: (answer: SelfLoveAnswer) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day17QuestionCard = React.memo(function Day17QuestionCard({
  selectedAnswer,
  onAnswer,
}: Day17QuestionCardProps) {
  const handleAnswer = useCallback(
    async (answer: SelfLoveAnswer) => {
      onAnswer(answer)
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      } catch {
        // Haptics not available
      }
    },
    [onAnswer],
  )

  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>这段关系让我更喜欢自己了吗？</Text>
      <View style={styles.answerRow}>
        {ANSWER_OPTIONS.map((answer) => (
          <TouchableOpacity
            key={answer}
            style={[
              styles.answerButton,
              selectedAnswer === answer && styles.answerButtonActive,
            ]}
            onPress={() => handleAnswer(answer)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.answerButtonText,
                selectedAnswer === answer && styles.answerButtonTextActive,
              ]}
            >
              {answer}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING['2xl'],
    alignItems: 'center',
    ...SHADOWS.md,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: SPACING.xl,
  },
  answerRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  answerButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  answerButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  answerButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  answerButtonTextActive: {
    color: COLORS.card,
  },
})

export default Day17QuestionCard
