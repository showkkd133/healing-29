import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
  FadeIn,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { COLORS, TYPOGRAPHY } from '@/constants/theme'

const TOTAL_DAYS = 29

interface ProgressRingProps {
  currentDay: number
  totalDays?: number
}

// Circular progress ring with breathing animation — visual focal point of the home screen
export default function ProgressRing({ currentDay, totalDays = TOTAL_DAYS }: ProgressRingProps) {
  const size = 200
  const strokeWidth = 6
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = currentDay / totalDays
  const strokeDashoffset = circumference * (1 - progress)
  const percentage = Math.round(progress * 100)

  // Breathing animation — slow pulse implying "healing in progress"
  const breathe = useSharedValue(0)

  useEffect(() => {
    breathe.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
  }, [])

  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breathe.value, [0, 1], [0.7, 1]),
    transform: [{ scale: interpolate(breathe.value, [0, 1], [1, 1.02]) }],
  }))

  return (
    <Animated.View
      style={[styles.container, ringStyle]}
      accessibilityRole="progressbar"
      accessibilityLabel={`旅程进度，第${currentDay}天，共${totalDays}天`}
    >
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={radius}
          stroke={COLORS.border} strokeWidth={strokeWidth} fill="none" />
        <Circle cx={center} cy={center} r={radius}
          stroke={COLORS.primary} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${circumference}`} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" transform={`rotate(-90, ${center}, ${center})`} />
      </Svg>
      {/* Center text — day label + percentage with fade-in on change */}
      <Animated.View style={styles.textContainer} entering={FadeIn.duration(600)}>
        <Animated.Text
          key={`day-${currentDay}`}
          style={styles.dayLabel}
          entering={FadeIn.duration(400)}
        >
          Day {currentDay}
        </Animated.Text>
        <Animated.Text
          key={`pct-${percentage}`}
          style={styles.percentage}
          entering={FadeIn.duration(400)}
        >
          {percentage}%
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  textContainer: { position: 'absolute', alignItems: 'center' },
  dayLabel: {
    fontSize: TYPOGRAPHY.fontSize.md, fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text, marginBottom: 2,
  },
  percentage: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textTertiary },
})
