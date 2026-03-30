import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { COLORS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day19ProgressBarProps {
  readonly remaining: number
  readonly total: number
}

// ─── Component ─────────────────────────────────────────────────────

const Day19ProgressBar = React.memo(function Day19ProgressBar({
  remaining,
  total,
}: Day19ProgressBarProps) {
  const width = useSharedValue(1)

  useEffect(() => {
    width.value = withTiming(remaining / total, {
      duration: 1000,
      easing: Easing.linear,
    })
  }, [remaining, total, width])

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }))

  return (
    <View style={styles.progressContainer}>
      <Animated.View style={[styles.progressFill, animatedStyle]} />
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  progressContainer: {
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.warning,
    borderRadius: 2,
  },
})

export default Day19ProgressBar
