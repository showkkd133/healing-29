import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { COLORS, TYPOGRAPHY } from '@/constants/theme'

const TOTAL_DAYS = 29

interface ProgressRingProps {
  currentDay: number
  totalDays?: number
}

// Minimal circular progress ring — visual focal point of the home screen
export default function ProgressRing({ currentDay, totalDays = TOTAL_DAYS }: ProgressRingProps) {
  const size = 200
  const strokeWidth = 6
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = currentDay / totalDays
  const strokeDashoffset = circumference * (1 - progress)
  const percentage = Math.round(progress * 100)

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={`旅程进度，第${currentDay}天，共${totalDays}天`}
    >
      <Svg width={size} height={size}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={COLORS.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={COLORS.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
      {/* Center text — day label + percentage */}
      <View style={styles.textContainer}>
        <Text style={styles.dayLabel}>Day {currentDay}</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
    marginBottom: 2,
  },
  percentage: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },
})
