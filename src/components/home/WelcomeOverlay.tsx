import { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Pressable, Animated as RNAnimated } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme'
import { IconPen, IconChart, IconSeedling } from '@/components/icons'
import { useTypewriter } from '@/hooks/useTypewriter'

interface WelcomeOverlayProps { onStart: () => void }

interface Step {
  readonly icon: React.ReactNode
  readonly title: string
  readonly description: string
}

const STEPS: readonly Step[] = [
  { icon: <IconPen size={32} color={COLORS.primary} />, title: '每天一个小任务', description: '用简单的练习，一步步走出低谷。' },
  { icon: <IconChart size={32} color={COLORS.primary} />, title: '记录你的情绪变化', description: '看见自己的成长轨迹，每一天都在进步。' },
  { icon: <IconSeedling size={32} color={COLORS.accent} />, title: '29 天后，遇见新的自己', description: '四个阶段，从疗愈到重生。' },
] as const

// Blinking cursor for typewriter effect
function BlinkingCursor() {
  const opacity = useRef(new RNAnimated.Value(1)).current

  useEffect(() => {
    const animation = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        RNAnimated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  return (
    <RNAnimated.Text style={[styles.cursor, { opacity }]}>|</RNAnimated.Text>
  )
}

// Minimal welcome overlay — quiet white dialog
export default function WelcomeOverlay({ onStart }: WelcomeOverlayProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  // Typewriter: title is fast (30ms) with no delay, description is slower (40ms) with 300ms delay
  const { displayedText: titleText, isComplete: titleDone } = useTypewriter(current.title, 30, 0)
  const { displayedText: descText, isComplete: descDone } = useTypewriter(current.description, 40, 300)

  const goNext = () => {
    if (isLast) { onStart(); return }
    setStep((s) => s + 1)
  }

  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.overlay}>
      <Animated.View entering={FadeIn.duration(200)} style={styles.card}>
        {/* Step content with simple fade transition */}
        <Animated.View key={`i-${step}`} entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)} style={styles.iconContainer}>
          {current.icon}
        </Animated.View>
        <Animated.Text key={`t-${step}`} entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)} style={styles.title}>
          {titleText}
          {!titleDone && <BlinkingCursor />}
        </Animated.Text>
        <Animated.Text key={`d-${step}`} entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)} style={styles.description}>
          {descText}
          {titleDone && !descDone && <BlinkingCursor />}
        </Animated.Text>

        {/* Dot indicators */}
        <View style={styles.indicators}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>

        {/* CTA — ghost for intermediate, solid for final */}
        {isLast ? (
          <Pressable style={styles.btnSolid} onPress={goNext} accessibilityRole="button" accessibilityLabel="开始旅程">
            <Text style={styles.btnSolidText}>开始旅程</Text>
          </Pressable>
        ) : (
          <Pressable onPress={goNext} accessibilityRole="button" accessibilityLabel="下一步">
            <Text style={styles.btnGhostText}>下一步</Text>
          </Pressable>
        )}
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['2xl'],
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING['2xl'],
  },
  indicators: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING['2xl'],
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  btnSolid: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: SPACING['5xl'],
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  btnSolidText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  btnGhostText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textDecorationLine: 'underline',
  },
  cursor: {
    color: COLORS.primary,
    fontWeight: '300' as const,
  },
})
