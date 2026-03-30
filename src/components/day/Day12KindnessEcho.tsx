// Day 12 – Kindness echo animation sub-component

import React from 'react'
import { Text, StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

interface Day12KindnessEchoProps {
  readonly visible: boolean
}

const Day12KindnessEcho = React.memo(function Day12KindnessEcho({
  visible,
}: Day12KindnessEchoProps) {
  const numberValue = useSharedValue(0)
  const scale = useSharedValue(0.8)

  React.useEffect(() => {
    if (visible) {
      numberValue.value = withTiming(3, {
        duration: 1500,
        easing: Easing.out(Easing.cubic),
      })
      scale.value = withDelay(
        200,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.5)) }),
      )
    }
  }, [visible, numberValue, scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }))

  if (!visible) return null

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.title}>善意回响</Text>
        <Text style={styles.number}>3%</Text>
        <Text style={styles.description}>你的善意可能让TA的一天好了 3%</Text>
      </Animated.View>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: SPACING['2xl'],
  },
  card: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS['2xl'],
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING['3xl'],
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.card,
    opacity: 0.8,
    marginBottom: SPACING.xs,
  },
  number: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.card,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.card,
    opacity: 0.9,
  },
})

export default Day12KindnessEcho
