import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  SlideInLeft,
  SlideInRight,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ZenButton } from '@/components/ui/ZenButton'
import { DECISION_PAIRS, GUIDANCE_TEXT } from './Day23Types'
import Day23ProgressBar from './Day23ProgressBar'

// ─── Props ─────────────────────────────────────────────────────────

interface Day23ChoosingPhaseProps {
  readonly currentIndex: number
  readonly timeRemaining: number
  readonly progress: number
  readonly blinkOpacity: SharedValue<number>
  readonly onChoice: (choice: string) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day23ChoosingPhase = React.memo(function Day23ChoosingPhase({
  currentIndex,
  timeRemaining,
  progress,
  blinkOpacity,
  onChoice,
}: Day23ChoosingPhaseProps) {
  const currentPair = DECISION_PAIRS[currentIndex % DECISION_PAIRS.length]

  const blinkStyle = useAnimatedStyle(() => ({
    opacity: blinkOpacity.value,
  }))

  return (
    <>
      {/* Guidance */}
      <Animated.Text entering={FadeIn.duration(400)} style={styles.guidanceText}>
        {GUIDANCE_TEXT}
      </Animated.Text>

      {/* Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.timerText}>
          {Math.ceil(timeRemaining / 1000)}s
        </Text>
        <Day23ProgressBar progress={progress} />
      </View>

      {/* Question */}
      <Text style={styles.questionText}>
        {currentPair.question}：选哪个？
      </Text>

      {/* Decision round indicator */}
      <Text style={styles.roundText}>
        第 {currentIndex + 1} / {DECISION_PAIRS.length} 题
      </Text>

      {/* Option cards */}
      <View style={styles.optionRow}>
        <Animated.View entering={SlideInLeft.duration(300)} style={styles.optionWrapper}>
          <ZenButton
            style={styles.optionCard}
            onPress={() => onChoice(currentPair.optionA)}
          >
            <Animated.Text style={[styles.optionText, blinkStyle]}>
              {currentPair.optionA}
            </Animated.Text>
          </ZenButton>
        </Animated.View>

        <Text style={styles.vsText}>VS</Text>

        <Animated.View entering={SlideInRight.duration(300)} style={styles.optionWrapper}>
          <ZenButton
            style={styles.optionCard}
            onPress={() => onChoice(currentPair.optionB)}
          >
            <Animated.Text style={[styles.optionText, blinkStyle]}>
              {currentPair.optionB}
            </Animated.Text>
          </ZenButton>
        </Animated.View>
      </View>
    </>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: SPACING['3xl'],
  },
  progressSection: {
    marginBottom: SPACING['2xl'],
  },
  timerText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  roundText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING['3xl'],
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  optionWrapper: {
    flex: 1,
  },
  optionCard: {
    aspectRatio: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
    padding: 0,
    minHeight: undefined,
  },
  optionText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  vsText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
})

export default Day23ChoosingPhase
