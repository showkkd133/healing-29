import React from 'react'
import { Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { COLORS, SPACING, SHADOWS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface CourageBadgeProps {
  readonly points: number
}

// ─── Component ─────────────────────────────────────────────────────

const Day20CourageBadge = React.memo(function Day20CourageBadge({ points }: CourageBadgeProps) {
  const scale = useSharedValue(0)

  React.useEffect(() => {
    scale.value = withSequence(
      withSpring(1.3, { damping: 6, stiffness: 200 }),
      withTiming(1, { duration: 200 })
    )
  }, [points, scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View style={[styles.courageBadge, animatedStyle]}>
      <Text style={styles.courageBadgePoints}>+{points}</Text>
      <Text style={styles.courageBadgeLabel}>{'\u52C7\u6C14\u503C'}</Text>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  courageBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  courageBadgePoints: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.card,
  },
  courageBadgeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.card,
    marginTop: SPACING['2xs'],
  },
})

export default Day20CourageBadge
