import React, { useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface SealAnimationProps {
  readonly itemCount: number
  readonly onFinish: () => void
}

// ─── Individual seal item ──────────────────────────────────────────

const SealItem = React.memo(function SealItem({ index }: { readonly index: number }) {
  const translateY = useSharedValue(0)
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  React.useEffect(() => {
    const delay = index * 500
    translateY.value = withDelay(delay, withTiming(120, { duration: 500, easing: Easing.in(Easing.cubic) }))
    scale.value = withDelay(delay, withTiming(0.1, { duration: 500, easing: Easing.in(Easing.cubic) }))
    opacity.value = withDelay(delay + 400, withTiming(0, { duration: 100 }))
  }, [translateY, scale, opacity, index])

  const itemStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }))

  return (
    <Animated.View style={[styles.item, itemStyle]}>
      <Text style={styles.itemText}>遗憾 {index + 1}</Text>
    </Animated.View>
  )
})

// ─── Seal animation container ──────────────────────────────────────

const SealAnimation = React.memo(function SealAnimation({
  itemCount,
  onFinish,
}: SealAnimationProps) {
  const boxScale = useSharedValue(0.8)
  const boxOpacity = useSharedValue(0)

  // Stabilize onFinish ref to prevent timer restart on parent re-render
  const onFinishRef = useRef(onFinish)
  React.useEffect(() => { onFinishRef.current = onFinish }, [onFinish])

  React.useEffect(() => {
    // Box appears
    boxOpacity.value = withTiming(1, { duration: 400 })
    boxScale.value = withDelay(
      itemCount * 500 + 200,
      withSequence(
        withTiming(1.05, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 150 })
      )
    )

    const timer = setTimeout(() => {
      onFinishRef.current()
    }, itemCount * 500 + 1200)

    return () => clearTimeout(timer)
  }, [boxScale, boxOpacity, itemCount])

  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: boxScale.value }],
    opacity: boxOpacity.value,
  }))

  return (
    <View style={styles.container}>
      {/* Items flying into box */}
      {Array.from({ length: itemCount }, (_, i) => (
        <SealItem key={i} index={i} />
      ))}

      {/* Box */}
      <Animated.View style={[styles.box, boxStyle]}>
        <Text style={styles.boxEmoji}>📦</Text>
        <Text style={styles.boxLabel}>遗憾封存盒</Text>
      </Animated.View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.secondary,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  box: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  boxEmoji: {
    fontSize: 64,
  },
  boxLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
})

export default SealAnimation
