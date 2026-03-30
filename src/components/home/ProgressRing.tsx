import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg'
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme'

const TOTAL_DAYS = 29

interface ProgressRingProps {
  currentDay: number
  totalDays?: number
}

// Circular progress ring with gradient stroke and subtle glow
export default function ProgressRing({ currentDay, totalDays = TOTAL_DAYS }: ProgressRingProps) {
  const size = 220
  const strokeWidth = 10
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
      {/* Outer glow layer */}
      <View style={styles.glowWrapper}>
        <Svg width={size} height={size}>
          <Defs>
            {/* Gradient from primary blue to accent amber */}
            <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.primary} stopOpacity="1" />
              <Stop offset="100%" stopColor={COLORS.accent} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={COLORS.border}
            strokeWidth={strokeWidth - 2}
            fill="none"
            opacity={0.5}
          />
          {/* Progress circle with gradient */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${center}, ${center})`}
          />
        </Svg>
        {/* Center text overlay */}
        <View style={styles.ringTextContainer}>
          <Text style={styles.ringDayLabel}>Day</Text>
          <Text style={styles.ringDayNumber}>{currentDay}</Text>
          <Text style={styles.ringDayTotal}>of {totalDays}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING['3xl'],
  },
  glowWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle outer glow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  ringTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringDayLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
    textTransform: 'uppercase',
    marginBottom: SPACING['2xs'],
  },
  ringDayNumber: {
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    lineHeight: TYPOGRAPHY.lineHeight['4xl'],
  },
  ringDayTotal: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING['2xs'],
  },
})
