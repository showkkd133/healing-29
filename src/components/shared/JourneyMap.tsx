// Minimal 29-day journey grid, calendar-style layout

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
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme'

interface JourneyMapProps {
  readonly currentDay: number
  readonly completedDays: ReadonlyArray<number>
  readonly onDayPress: (day: number) => void
}

type DayStatus = 'completed' | 'current' | 'locked'

const CELL_SIZE = 38
const CELL_GAP = 8
const DAYS = Array.from({ length: 29 }, (_, i) => i + 1)

const getDayStatus = (
  day: number,
  currentDay: number,
  completedDays: ReadonlyArray<number>,
): DayStatus => {
  if (completedDays.includes(day)) return 'completed'
  if (day === currentDay) return 'current'
  return 'locked'
}

// Subtle pulse animation for the current day
function PulsingCell({ children }: { readonly children: React.ReactNode }) {
  const scale = useSharedValue(1)

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.03, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    )
  }, [scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}

export function JourneyMap({ currentDay, completedDays, onDayPress }: JourneyMapProps) {
  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>旅程地图</Text>
        <Text style={styles.counter}>{completedDays.length}/29</Text>
      </View>

      {/* 7-column grid */}
      <View style={styles.grid}>
        {DAYS.map((day) => {
          const status = getDayStatus(day, currentDay, completedDays)
          const isInteractive = status !== 'locked'

          const cell = (
            <Pressable
              key={day}
              disabled={!isInteractive}
              onPress={() => onDayPress(day)}
              style={({ pressed }) => [
                styles.cell,
                status === 'completed' && styles.cellCompleted,
                status === 'current' && styles.cellCurrent,
                status === 'locked' && styles.cellLocked,
                pressed && isInteractive && styles.cellPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={
                status === 'completed' ? `第${day}天，已完成` :
                status === 'current' ? `第${day}天，当前任务` :
                `第${day}天，未解锁`
              }
              accessibilityState={{ disabled: !isInteractive }}
            >
              {status === 'completed' ? (
                <IconCheck size={14} color={COLORS.white} />
              ) : (
                <Text style={[
                  styles.cellText,
                  status === 'current' && styles.cellTextLight,
                  status === 'locked' && styles.cellTextLocked,
                ]}>{day}</Text>
              )}
            </Pressable>
          )

          if (status === 'current') {
            return <PulsingCell key={day}>{cell}</PulsingCell>
          }
          return cell
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  counter: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellCompleted: {
    backgroundColor: COLORS.primary,
  },
  cellCurrent: {
    backgroundColor: COLORS.accent,
  },
  cellLocked: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cellPressed: {
    opacity: 0.75,
  },
  cellText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  cellTextLight: {
    color: COLORS.white,
  },
  cellTextLocked: {
    color: COLORS.textTertiary,
  },
})
