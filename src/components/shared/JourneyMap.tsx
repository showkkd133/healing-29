// Constellation-style 29-day journey map (Organic Constellation refactor)
import { useMemo, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from 'react-native-svg'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { IconCheck } from '@/components/icons'
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme'

interface JourneyMapProps {
  readonly currentDay: number
  readonly completedDays: ReadonlyArray<number>
  readonly onDayPress: (day: number) => void
  readonly justCompletedDay?: number
  readonly activeColor?: string
}

type DayStatus = 'completed' | 'current' | 'locked'

const CELL_SIZE = 36 
const CELL_GAP = 12
const COLS = 7
const DAYS = Array.from({ length: 29 }, (_, i) => i + 1)
const ROWS = Math.ceil(DAYS.length / COLS)

const GRID_WIDTH = COLS * CELL_SIZE + (COLS - 1) * CELL_GAP
const GRID_HEIGHT = ROWS * CELL_SIZE + (ROWS - 1) * CELL_GAP

// Generate stable random offsets for each day to create an organic constellation feel
const OFFSETS = DAYS.map(() => ({
  x: (Math.random() - 0.5) * 8,
  y: (Math.random() - 0.5) * 8,
}))

const getCenter = (index: number) => {
  const offset = OFFSETS[index] || { x: 0, y: 0 }
  return {
    x: (index % COLS) * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2 + offset.x,
    y: Math.floor(index / COLS) * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2 + offset.y,
  }
}

const getDayStatus = (
  day: number,
  currentDay: number,
  completedDays: ReadonlyArray<number>,
): DayStatus => {
  if (completedDays.includes(day)) return 'completed'
  if (day === currentDay) return 'current'
  return 'locked'
}

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

function RippleEffect({ color }: { color: string }) {
  const scale1 = useSharedValue(0.5)
  const opacity1 = useSharedValue(0.6)

  useEffect(() => {
    scale1.value = withTiming(3, { duration: 1200 })
    opacity1.value = withTiming(0, { duration: 1200 })
  }, [scale1, opacity1])

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
    borderColor: color,
  }))

  return <Animated.View style={[styles.rippleRing, style]} pointerEvents="none" />
}

function PulsingCell({ children }: { readonly children: React.ReactNode }) {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(0.7)

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    )
    opacity.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    )
  }, [scale, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}

function ConstellationLayer({
  completedDays,
  activeColor = COLORS.primary,
}: {
  readonly completedDays: ReadonlyArray<number>
  readonly activeColor?: string
}) {
  const { pathData, glowCenters } = useMemo(() => ({
    pathData: buildConstellationPath(completedDays),
    glowCenters: [...completedDays]
      .sort((a, b) => a - b)
      .map(day => ({ day, ...getCenter(day - 1) })),
  }), [completedDays])

  if (completedDays.length === 0) return null

  return (
    <Svg width={GRID_WIDTH} height={GRID_HEIGHT} style={styles.svgLayer}>
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor={activeColor} stopOpacity="0.25" />
          <Stop offset="100%" stopColor={activeColor} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      {glowCenters.map(({ day, x, y }) => (
        <Circle
          key={`glow-${day}`}
          cx={x}
          cy={y}
          r={CELL_SIZE * 0.8}
          fill="url(#glow)"
        />
      ))}
      {pathData.length > 0 && (
        <Path
          d={pathData}
          stroke={activeColor}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.1}
          strokeDasharray="2,4"
        />
      )}
    </Svg>
  )
}

export function JourneyMap({ 
  currentDay, 
  completedDays, 
  onDayPress, 
  justCompletedDay,
  activeColor = COLORS.primary
}: JourneyMapProps) {
  return (
    <View style={styles.gridContainer}>
      <ConstellationLayer completedDays={completedDays} activeColor={activeColor} />
      <View style={styles.grid}>
        {DAYS.map((day, index) => {
          const status = getDayStatus(day, currentDay, completedDays)
          const isInteractive = status !== 'locked'
          const offset = OFFSETS[index]

          const cell = (
            <Pressable
              key={day}
              disabled={!isInteractive}
              onPress={() => onDayPress(day)}
              style={({ pressed }) => [
                styles.cell,
                status === 'completed' && { backgroundColor: activeColor + '40', borderColor: activeColor + '60' },
                status === 'current' && { backgroundColor: activeColor },
                status === 'locked' && styles.cellLocked,
                pressed && isInteractive && styles.cellPressed,
                { transform: [{ translateX: offset.x }, { translateY: offset.y }] }
              ]}
            >
              {status === 'completed' && <View style={styles.innerDot} />}
              <Text style={[
                styles.dayNum,
                status === 'current' && styles.dayNumCurrent,
                status === 'locked' && styles.dayNumLocked
              ]}>{day}</Text>
            </Pressable>
          )

          if (justCompletedDay === day) {
            return (
              <View key={day} style={[styles.cellWrapper, { transform: [{ translateX: offset.x }, { translateY: offset.y }] }]}>
                {cell}
                <RippleEffect color={activeColor} />
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
  )
}

const styles = StyleSheet.create({
  gridContainer: {
    position: 'relative',
    alignSelf: 'center',
    padding: SPACING.md,
  },
  svgLayer: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    zIndex: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CELL_GAP,
    zIndex: 1,
    width: GRID_WIDTH,
    justifyContent: 'center',
  },
  cellWrapper: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  innerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.white,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  cellLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cellPressed: {
    opacity: 0.6,
  },
  dayNum: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
  },
  dayNumCurrent: {
    color: COLORS.white,
  },
  dayNumLocked: {
    color: COLORS.textTertiary,
    opacity: 0.4,
  },
  rippleRing: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    borderWidth: 2,
  },
})
