import { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Animated, {
  FadeIn, FadeOut, SlideInRight, SlideOutLeft,
  SlideInLeft, SlideOutRight, SlideInUp, LinearTransition,
} from 'react-native-reanimated'
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme'
import { IconPen, IconChart, IconSeedling } from '@/components/icons'

interface WelcomeOverlayProps { onStart: () => void }

interface Step {
  readonly icon: React.ReactNode
  readonly title: string
  readonly description: string
}

const STEPS: readonly Step[] = [
  { icon: <IconPen size={48} color={COLORS.primary} />, title: '每天一个小任务', description: '用简单的练习，一步步走出低谷。' },
  { icon: <IconChart size={48} color={COLORS.primary} />, title: '记录你的情绪变化', description: '看见自己的成长轨迹，每一天都在进步。' },
  { icon: <IconSeedling size={48} color={COLORS.accent} />, title: '29 天后，遇见新的自己', description: '四个阶段，从疗愈到重生。' },
] as const

// Refined welcome overlay styled like an opening booklet
export default function WelcomeOverlay({ onStart }: WelcomeOverlayProps) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const goNext = () => {
    if (isLast) { onStart(); return }
    setDirection('forward')
    setStep((s) => s + 1)
  }

  const goPrev = () => {
    if (step > 0) { setDirection('back'); setStep((s) => s - 1) }
  }

  // Directional slide animations for step transitions
  const entering = direction === 'forward' ? SlideInRight.duration(280) : SlideInLeft.duration(280)
  const exiting = direction === 'forward' ? SlideOutLeft.duration(200) : SlideOutRight.duration(200)

  return (
    <Animated.View entering={FadeIn.duration(350)} style={styles.overlay}>
      <Animated.View entering={SlideInUp.delay(150).springify()} style={styles.card}>
        {/* Decorative arc */}
        <View style={styles.arc} />
        {/* Tap zones for prev/next navigation */}
        <View style={styles.tapZones}>
          <Pressable style={styles.tapHalf} onPress={goPrev} accessibilityLabel="上一步" />
          <Pressable style={styles.tapHalf} onPress={goNext} accessibilityLabel="下一步" />
        </View>
        {/* Step content with directional transitions */}
        {/* Icon in circular tinted container */}
        <Animated.View key={`e-${step}`} entering={entering} exiting={exiting} style={styles.iconContainer}>
          {current.icon}
        </Animated.View>
        <Animated.Text
          key={`t-${step}`}
          entering={FadeIn.delay(120).duration(250)}
          exiting={FadeOut.duration(150)}
          style={styles.title}
        >
          {current.title}
        </Animated.Text>
        <Animated.Text
          key={`d-${step}`}
          entering={FadeIn.delay(200).duration(280)}
          exiting={FadeOut.duration(150)}
          style={styles.description}
        >
          {current.description}
        </Animated.Text>
        {/* Bar-style step indicators */}
        <Animated.View layout={LinearTransition.duration(250)} style={styles.indicators}>
          {STEPS.map((_, i) => (
            <Animated.View
              key={i}
              layout={LinearTransition.duration(250)}
              style={[styles.bar, i === step && styles.barActive]}
            />
          ))}
        </Animated.View>
        {/* CTA — ghost for intermediate steps, solid for final */}
        <View style={styles.btnWrap}>
          <Pressable
            style={isLast ? styles.btnSolid : styles.btnGhost}
            onPress={goNext}
            accessibilityRole="button"
            accessibilityLabel={isLast ? '开始旅程' : '下一步'}
          >
            <Text style={isLast ? styles.btnSolidText : styles.btnGhostText}>
              {isLast ? '开始旅程' : '下一步'}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(44, 44, 44, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['2xl'],
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    paddingTop: SPACING['4xl'],
    paddingBottom: SPACING['3xl'],
    paddingHorizontal: SPACING['3xl'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  arc: {
    position: 'absolute',
    top: -40,
    width: 200,
    height: 80,
    borderRadius: 100,
    backgroundColor: COLORS.secondary,
    opacity: 0.45,
  },
  tapZones: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 1,
  },
  tapHalf: { flex: 1 },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING['2xl'],
    paddingHorizontal: SPACING.sm,
  },
  indicators: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING['2xl'],
    alignItems: 'center',
  },
  bar: { width: 6, height: 4, borderRadius: 2, backgroundColor: COLORS.border },
  barActive: { width: 16, backgroundColor: COLORS.primary },
  btnWrap: { zIndex: 2 },
  btnSolid: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 26,
    paddingHorizontal: SPACING['5xl'],
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...SHADOWS.md,
  },
  btnSolidText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  btnGhost: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: SPACING['5xl'],
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  btnGhostText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
})
