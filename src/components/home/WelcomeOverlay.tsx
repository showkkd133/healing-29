import { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated'
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme'

interface WelcomeOverlayProps {
  onStart: () => void
}

interface Step {
  readonly emoji: string
  readonly title: string
  readonly description: string
}

const STEPS: readonly Step[] = [
  { emoji: '📝', title: '每天一个小任务', description: '用简单的练习，一步步走出低谷。' },
  { emoji: '📊', title: '记录你的情绪变化', description: '看见自己的成长轨迹，每一天都在进步。' },
  { emoji: '🌱', title: '29 天后，遇见新的自己', description: '四个阶段，从疗愈到重生。' },
] as const

// Welcome overlay with 3-step onboarding guide
export default function WelcomeOverlay({ onStart }: WelcomeOverlayProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const goNext = () => {
    if (isLast) {
      onStart()
    } else {
      setStep((s) => s + 1)
    }
  }

  const goPrev = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.overlay}>
      <Animated.View entering={SlideInUp.delay(200).springify()} style={styles.card}>
        {/* Tap zones for navigation */}
        <View style={styles.tapZones}>
          <Pressable style={styles.tapLeft} onPress={goPrev} accessibilityLabel="上一步" />
          <Pressable style={styles.tapRight} onPress={goNext} accessibilityLabel="下一步" />
        </View>

        {/* Emoji */}
        <Animated.Text
          key={`emoji-${step}`}
          entering={FadeIn.delay(400).duration(300)}
          style={styles.emoji}
        >
          {current.emoji}
        </Animated.Text>

        {/* Title */}
        <Animated.Text
          key={`title-${step}`}
          entering={FadeIn.delay(500).duration(300)}
          style={styles.title}
        >
          {current.title}
        </Animated.Text>

        {/* Description */}
        <Animated.Text
          key={`desc-${step}`}
          entering={FadeIn.delay(600).duration(300)}
          style={styles.description}
        >
          {current.description}
        </Animated.Text>

        {/* Step indicator dots */}
        <Animated.View entering={FadeIn.delay(700).duration(300)} style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.dotActive]}
            />
          ))}
        </Animated.View>

        {/* Action button */}
        <Animated.View entering={FadeIn.delay(800).duration(300)} style={styles.buttonWrapper}>
          <Pressable
            style={styles.button}
            onPress={goNext}
            accessibilityRole="button"
            accessibilityLabel={isLast ? '开始旅程' : '下一步'}
          >
            <Text style={styles.buttonText}>
              {isLast ? '开始旅程' : '下一步'}
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['2xl'],
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING['3xl'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  tapZones: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 1,
  },
  tapLeft: { flex: 1 },
  tapRight: { flex: 1 },
  emoji: {
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
    marginBottom: SPACING.xl,
  },
  dots: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING['2xl'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
  buttonWrapper: {
    zIndex: 2,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING['5xl'],
  },
  buttonText: {
    color: COLORS.card,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
})
