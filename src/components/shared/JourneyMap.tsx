// 29-day journey grid navigation grouped by healing stages

import { View, Text, Pressable, StyleSheet } from 'react-native'
import { STAGES } from '@/constants/stages'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/constants/theme'

interface JourneyMapProps {
  readonly currentDay: number
  readonly completedDays: ReadonlyArray<number>
  readonly onDayPress: (day: number) => void
}

type DayStatus = 'completed' | 'current' | 'locked'

const CELL_SIZE = 40
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

  return (
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
        <Text style={styles.checkmark}>✓</Text>
      ) : (
        <Text style={textStyle}>{day}</Text>
      )}
    </Pressable>
  )
}

// A single stage block with title and day grid
function StageSection({
  name,
  days,
  currentDay,
  completedDays,
  onDayPress,
}: {
  readonly name: string
  readonly days: readonly number[]
  readonly currentDay: number
  readonly completedDays: ReadonlyArray<number>
  readonly onDayPress: (day: number) => void
}) {
  return (
    <View style={styles.stageSection}>
      <Text style={styles.stageTitle}>{name}</Text>
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
    <View style={styles.container}>
      <Text style={styles.title}>旅程地图</Text>
      {STAGES.map((stage) => (
        <StageSection
          key={stage.id}
          name={stage.name}
          days={stage.days}
          currentDay={currentDay}
          completedDays={completedDays}
          onDayPress={onDayPress}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    marginBottom: SPACING['3xl'],
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  stageSection: {
    marginBottom: SPACING.md,
  },
  stageTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
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
  },
  cellCurrent: {
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 4,
  },
  cellLocked: {
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
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
  checkmark: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
})
