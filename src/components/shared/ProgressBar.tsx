// NOTE: Not currently imported by any component — candidate for integration or removal (only used by DayHeader.tsx which is also unused)
import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { COLORS } from '../../constants/theme'

interface ProgressBarProps {
  progress: number
  color?: string
  height?: number
}

// Animated rounded progress bar with configurable color and height
const ProgressBar = React.memo(function ProgressBar({
  progress,
  color = COLORS.primary,
  height = 8,
}: ProgressBarProps) {
  // Clamp progress between 0 and 1
  const clampedProgress = Math.min(1, Math.max(0, progress))
  const animatedWidth = useSharedValue(0)

  useEffect(() => {
    animatedWidth.value = withTiming(clampedProgress, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    })
  }, [clampedProgress, animatedWidth])

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%`,
  }))

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: color, borderRadius: height / 2 },
          fillStyle,
        ]}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
})

export default ProgressBar
