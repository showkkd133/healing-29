import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import Day19ProgressBar from './Day19ProgressBar'

// ─── Types & Constants ─────────────────────────────────────────────

type QuestionStep = 'question1' | 'question2' | 'question3'

const GUIDANCE_TEXT = '想联系TA了吗？先完成这个'

const STEP_QUESTIONS: Record<QuestionStep, string> = {
  question1: '想说什么？',
  question2: '希望TA怎么回应？',
  question3: '能承受得不到回应吗？',
}

const STEP_LIMIT_SECONDS = 2 * 60

// ─── Helpers ───────────────────────────────────────────────────────

const formatTimer = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ─── Props ─────────────────────────────────────────────────────────

interface Day19QuestionCardProps {
  readonly currentQuestion: QuestionStep
  readonly currentIndex: number
  readonly stepRemaining: number
  readonly answerValue: string
  readonly isLastQuestion: boolean
  readonly onAnswerChange: (value: string) => void
  readonly onNext: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day19QuestionCard = React.memo(function Day19QuestionCard({
  currentQuestion,
  currentIndex,
  stepRemaining,
  answerValue,
  isLastQuestion,
  onAnswerChange,
  onNext,
}: Day19QuestionCardProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Guidance */}
      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.guidanceText}>
        {GUIDANCE_TEXT}
      </Animated.Text>

      {/* Step indicator */}
      <Animated.View entering={FadeIn.delay(400).duration(400)} style={styles.stepIndicator}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.stepDot,
              i <= currentIndex && styles.stepDotActive,
            ]}
          />
        ))}
      </Animated.View>

      {/* Question card */}
      <Animated.View
        key={currentQuestion}
        entering={FadeInDown.duration(400)}
        style={styles.questionCard}
      >
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>问题 {currentIndex + 1}/3</Text>
          <Text style={styles.questionTimer}>{formatTimer(stepRemaining)}</Text>
        </View>
        <Day19ProgressBar remaining={stepRemaining} total={STEP_LIMIT_SECONDS} />
        <Text style={styles.questionText}>{STEP_QUESTIONS[currentQuestion]}</Text>
        <TextInput
          style={styles.questionInput}
          value={answerValue}
          onChangeText={onAnswerChange}
          placeholder="写下你的想法..."
          placeholderTextColor={COLORS.textTertiary}
          multiline
          textAlignVertical="top"
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.nextButton,
            !answerValue.trim() && styles.nextButtonDisabled,
          ]}
          onPress={onNext}
          disabled={!answerValue.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? '进入冷静期' : '下一个问题'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING['4xl'],
  },
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING['2xl'],
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  questionCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  questionNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  questionTimer: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.warning,
    fontVariant: ['tabular-nums'],
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  questionInput: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 120,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  nextButton: {
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day19QuestionCard
