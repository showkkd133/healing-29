import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme'

const TOTAL_DAYS = 29

interface ProgressRingProps {
  currentDay: number
  totalDays?: number
}

// Circular progress ring showing journey completion
export default function ProgressRing({ currentDay, totalDays = TOTAL_DAYS }: ProgressRingProps) {
  const size = 200
  const strokeWidth = 12
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = currentDay / totalDays
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <View
      style={styles.ringContainer}
      accessibilityRole="progressbar"
      accessibilityLabel={`旅程进度，第${currentDay}天，共${totalDays}天`}
    >
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={COLORS.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
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
      <View style={styles.ringTextContainer}>
        <Text style={styles.ringDayNumber}>Day {currentDay}</Text>
        <Text style={styles.ringDayTotal}>/ {totalDays}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING['2xl'],
  },
  ringTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringDayNumber: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  ringDayTotal: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING['2xs'],
  },
})
