import React, { useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { COLORS, SPACING, SHADOWS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface ClaimAnimationProps {
  readonly count: number
  readonly onFinish: () => void
}

// ─── Claim item with scale-in animation ────────────────────────────

const ClaimItem = React.memo(function ClaimItem({ index }: { readonly index: number }) {
  const scale = useSharedValue(0.95)

  React.useEffect(() => {
    const delay = index * 200
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
    )
  }, [scale, index])

  const itemStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View
      entering={FadeIn.delay(index * 200).duration(300)}
      style={[styles.item, itemStyle]}
    >
      <Text style={styles.itemText}>✓</Text>
    </Animated.View>
  )
})

// ─── Main claim animation ──────────────────────────────────────────

const ClaimAnimation = React.memo(function ClaimAnimation({
  count,
  onFinish,
}: ClaimAnimationProps) {
  // Stabilize onFinish ref to prevent timer restart on parent re-render
  const onFinishRef = useRef(onFinish)
  React.useEffect(() => { onFinishRef.current = onFinish }, [onFinish])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFinishRef.current()
    }, count * 200 + 1000)
    return () => clearTimeout(timer)
  }, [count])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>确权中…</Text>
      {Array.from({ length: count }, (_, i) => (
        <ClaimItem key={i} index={i} />
      ))}
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xl,
  },
  item: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  itemText: {
    fontSize: 24,
    color: COLORS.card,
    fontWeight: '700',
  },
})

export default ClaimAnimation
