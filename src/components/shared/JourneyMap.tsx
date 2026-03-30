// 29-day journey grid navigation grouped by healing stages

import { useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { IconCheck } from '@/components/icons'
import { STAGES } from '@/constants/stages'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme'

interface JourneyMapProps {
  readonly currentDay: number
  readonly completedDays: ReadonlyArray<number>
  readonly onDayPress: (day: number) => void
}

type DayStatus = 'completed' | 'current' | 'locked'

const CELL_SIZE = 44
const CELL_GAP = SPACING.sm

const getDayStatus = (
  day: number,
  currentDay: number,
  completedDays: ReadonlyArray<number>,
): DayStatus => {
  if (completedDays.includes(day)) return 'completed'
  if (day === currentDay) return 'current'
  return 'locked'
}

// Animated wrapper for the current-day cell with pulse effect
function PulsingCell({ children }: { readonly children: React.ReactNode }) {
  const scale = useSharedValue(1)

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    )
  }, [scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  )
}

// Single day cell within the grid
function DayCell({
  day,
  status,
  onPress,
}: {
  readonly day: number
  readonly status: DayStatus
  readonly onPress: (day: number) => void
}) {
  const isInteractive = status !== 'locked'

  const cellStyle = [
    styles.cell,
    status === 'completed' && styles.cellCompleted,
    status === 'current' && styles.cellCurrent,
    status === 'locked' && styles.cellLocked,
  ]

  const textStyle = [
    styles.cellText,
    status === 'completed' && styles.cellTextCompleted,
    status === 'current' && styles.cellTextCurrent,
    status === 'locked' && styles.cellTextLocked,
  ]

  // Accessibility label varies by status
  const a11yLabel =
    status === 'completed' ? `第${day}天，已完成` :
    status === 'current' ? `第${day}天，当前任务` :
    `第${day}天，未解锁`

  const cellContent = (
    <Pressable
      disabled={!isInteractive}
      onPress={() => onPress(day)}
      style={({ pressed }) => [
        ...cellStyle,
        pressed && isInteractive && styles.cellPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityState={{ disabled: !isInteractive }}
    >
      {status === 'completed' ? (
        <IconCheck size={16} color={COLORS.white} />
      ) : (
        <Text style={textStyle}>{day}</Text>
      )}
    </Pressable>
  )

  // Wrap current day in pulse animation
  if (status === 'current') {
    return <PulsingCell>{cellContent}</PulsingCell>
  }

  return cellContent
}

// A single stage block with title and day grid
function StageSection({
  name,
  color,
  days,
  currentDay,
  completedDays,
  onDayPress,
}: {
  readonly name: string
  readonly color: string
  readonly days: readonly number[]
  readonly currentDay: number
  readonly completedDays: ReadonlyArray<number>
  readonly onDayPress: (day: number) => void
}) {
  return (
    <View style={styles.stageSection}>
      <View style={styles.stageTitleRow}>
        <View style={[styles.stageDot, { backgroundColor: color }]} />
        <Text style={styles.stageTitle}>{name}</Text>
      </View>
      <View style={styles.dayGrid}>
        {days.map((day) => (
          <DayCell
            key={day}
            day={day}
            status={getDayStatus(day, currentDay, completedDays)}
            onPress={onDayPress}
          />
        ))}
      </View>
    </View>
  )
}

export function JourneyMap({
  currentDay,
  completedDays,
  onDayPress,
}: JourneyMapProps) {
  return (
    <View style={styles.outerContainer}>
      {/* Decorative gradient bar at top */}
      <View style={styles.gradientBar}>
        <View style={styles.gradientLeft} />
        <View style={styles.gradientRight} />
      </View>
      <View style={styles.container}>
        {/* Header: left-aligned title + progress counter */}
        <View style={styles.header}>
          <Text style={styles.title}>旅程地图</Text>
          <Text style={styles.progressText}>
            {completedDays.length}/29 天
          </Text>
        </View>
        {STAGES.map((stage) => (
          <StageSection
            key={stage.id}
            name={stage.name}
            color={stage.color}
            days={stage.days}
            currentDay={currentDay}
            completedDays={completedDays}
            onDayPress={onDayPress}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  gradientBar: {
    height: 2,
    flexDirection: 'row',
  },
  gradientLeft: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  gradientRight: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  container: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  progressText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  stageSection: {
    marginBottom: SPACING.lg,
  },
  stageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm + SPACING.xs,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  stageTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CELL_GAP,
  },
  // Day cell base
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellCompleted: {
    backgroundColor: COLORS.primary,
    // Subtle inner shadow via border trick
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  cellCurrent: {
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  cellLocked: {
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    opacity: 0.4,
  },
  cellPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.92 }],
  },
  // Day cell text
  cellText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  cellTextCompleted: {
    color: COLORS.white,
  },
  cellTextCurrent: {
    color: COLORS.white,
  },
  cellTextLocked: {
    color: COLORS.textSecondary,
  },
})
