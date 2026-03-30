import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { COLORS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day23ProgressBarProps {
  readonly progress: number // 0-1
}

// ─── Component ─────────────────────────────────────────────────────

const Day23ProgressBar = React.memo(function Day23ProgressBar({
  progress,
}: Day23ProgressBarProps) {
  const width = useSharedValue(progress)

  useEffect(() => {
    width.value = withTiming(progress, { duration: 200 })
  }, [progress, width])

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }))

  const isUrgent = progress < 0.3

  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.fill,
          isUrgent && styles.fillUrgent,
          barStyle,
        ]}
      />
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  fillUrgent: {
    backgroundColor: COLORS.error,
  },
})

export default Day23ProgressBar
