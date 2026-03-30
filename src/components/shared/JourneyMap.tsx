// Constellation-style 29-day journey map
// Completed days connect like stars in a night sky

import { useMemo, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { IconCheck } from '@/components/icons'
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme'

interface JourneyMapProps {
  readonly currentDay: number
  readonly completedDays: ReadonlyArray<number>
  readonly onDayPress: (day: number) => void
  readonly justCompletedDay?: number
}

type DayStatus = 'completed' | 'current' | 'locked'

const CELL_SIZE = 38
const CELL_GAP = 8
const COLS = 7
const DAYS = Array.from({ length: 29 }, (_, i) => i + 1)
const ROWS = Math.ceil(DAYS.length / COLS)

// Total grid dimensions for the SVG overlay
const GRID_WIDTH = COLS * CELL_SIZE + (COLS - 1) * CELL_GAP
const GRID_HEIGHT = ROWS * CELL_SIZE + (ROWS - 1) * CELL_GAP

// Glow radius around completed stars
const GLOW_RADIUS = CELL_SIZE / 2 + 4

// Compute the center point of a day cell by its 0-based index
const getCenter = (index: number) => ({
  x: (index % COLS) * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
  y: Math.floor(index / COLS) * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
})

const getDayStatus = (
  day: number,
  currentDay: number,
  completedDays: ReadonlyArray<number>,
): DayStatus => {
  if (completedDays.includes(day)) return 'completed'
  if (day === currentDay) return 'current'
  return 'locked'
}

// Build the SVG path string connecting completed days in order
const buildConstellationPath = (
  completedDays: ReadonlyArray<number>,
): string => {
  const sorted = [...completedDays].sort((a, b) => a - b)
  if (sorted.length < 2) return ''

  return sorted
    .map((day, i) => {
      const { x, y } = getCenter(day - 1)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}

// Ripple effect: 2 concentric circles expanding outward from the cell center
function RippleEffect() {
  const scale1 = useSharedValue(0.5)
  const scale2 = useSharedValue(0.5)
  const opacity1 = useSharedValue(0.6)
  const opacity2 = useSharedValue(0.6)

  useEffect(() => {
    scale1.value = withTiming(3, { duration: 800 })
    opacity1.value = withTiming(0, { duration: 800 })
    scale2.value = withDelay(200, withTiming(3, { duration: 800 }))
    opacity2.value = withDelay(200, withTiming(0, { duration: 800 }))
  }, [scale1, scale2, opacity1, opacity2])

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }))

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }))

  return (
    <>
      <Animated.View style={[styles.rippleRing, ring1Style]} pointerEvents="none" />
      <Animated.View style={[styles.rippleRing, ring2Style]} pointerEvents="none" />
    </>
  )
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

// SVG constellation overlay — connecting lines + glow halos beneath cells
function ConstellationLayer({
  completedDays,
}: {
  readonly completedDays: ReadonlyArray<number>
}) {
  const { pathData, glowCenters } = useMemo(() => ({
    pathData: buildConstellationPath(completedDays),
    glowCenters: [...completedDays]
      .sort((a, b) => a - b)
      .map(day => ({ day, ...getCenter(day - 1) })),
  }), [completedDays])

  if (completedDays.length === 0) return null

  return (
    <Svg
      width={GRID_WIDTH}
      height={GRID_HEIGHT}
      style={styles.svgLayer}
    >
      {/* Radial glow behind each completed star */}
      {glowCenters.map(({ day, x, y }) => (
        <Circle
          key={day}
          cx={x}
          cy={y}
          r={GLOW_RADIUS}
          fill={COLORS.primary}
          opacity={0.12}
        />
      ))}

      {/* Constellation connecting line */}
      {pathData.length > 0 && (
        <Path
          d={pathData}
          stroke={COLORS.primary}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.3}
        />
      )}
    </Svg>
  )
}

export function JourneyMap({ currentDay, completedDays, onDayPress, justCompletedDay }: JourneyMapProps) {
  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>旅程地图</Text>
        <Text style={styles.counter}>{completedDays.length}/29</Text>
      </View>

      {/* Grid container with constellation overlay */}
      <View style={styles.gridContainer}>
        {/* SVG layer sits behind the cells */}
        <ConstellationLayer completedDays={completedDays} />

        {/* 7-column cell grid */}
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

            // Wrap in ripple container when this day was just completed
            if (justCompletedDay === day) {
              return (
                <View key={day} style={styles.rippleContainer}>
                  {cell}
                  <RippleEffect />
                </View>
              )
            }

            if (status === 'current') {
              return <PulsingCell key={day}>{cell}</PulsingCell>
            }
            return cell
          })}
        </View>
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
  gridContainer: {
    position: 'relative',
  },
  svgLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    // Sit behind the cell grid; non-interactive
    zIndex: 0,
    pointerEvents: 'none',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CELL_GAP,
    // Float above the SVG layer
    zIndex: 1,
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
  // Ripple effect styles
  rippleContainer: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible' as const,
  },
  rippleRing: {
    position: 'absolute' as const,
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
})
