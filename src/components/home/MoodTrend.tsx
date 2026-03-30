import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Svg, { Polyline, Line, Circle, Polygon, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg'
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme'

interface MoodTrendProps {
  moods: number[]
}

// Mood trend line chart with data points, min/max labels, and gradient fill
export default function MoodTrend({ moods }: MoodTrendProps) {
  // Defensive: empty state
  if (moods.length === 0) {
    return (
      <View style={styles.moodTrendContainer}>
        <Text style={styles.moodTrendTitle}>最近情绪趋势</Text>
        <Text style={styles.emptyHint}>完成任务后这里会显示情绪趋势</Text>
      </View>
    )
  }

  const width = Dimensions.get('window').width - 64
  const height = 80
  const padding = SPACING.lg
  const maxMood = 7
  const chartHeight = height - padding * 2

  // Compute coordinates for each data point
  const coords = moods.map((mood, i) => {
    const stepX = moods.length > 1 ? (width - padding * 2) / (moods.length - 1) : 0
    const x = padding + i * stepX
    const y = height - padding - (mood / maxMood) * chartHeight
    return { x, y, value: mood }
  })

  // Find indices of max and min scores
  const maxIdx = moods.reduce((mi, v, i, a) => (v > a[mi] ? i : mi), 0)
  const minIdx = moods.reduce((mi, v, i, a) => (v < a[mi] ? i : mi), 0)

  // Build polyline points string and polygon fill path
  const points = coords.map(({ x, y }) => `${x},${y}`).join(' ')
  const fillPoints = [
    ...coords.map(({ x, y }) => `${x},${y}`),
    `${coords[coords.length - 1].x},${height - padding}`,
    `${coords[0].x},${height - padding}`,
  ].join(' ')

  const isSingle = moods.length === 1

  return (
    <View style={styles.moodTrendContainer}>
      <Text style={styles.moodTrendTitle}>最近情绪趋势</Text>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={COLORS.primary} stopOpacity="0.25" />
            <Stop offset="1" stopColor={COLORS.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Grid baseline */}
        <Line
          x1={padding} y1={height - padding}
          x2={width - padding} y2={height - padding}
          stroke={COLORS.border} strokeWidth={1}
        />

        {/* Gradient fill area */}
        {!isSingle && (
          <Polygon points={fillPoints} fill="url(#areaGrad)" />
        )}

        {/* Trend line (skip for single point) */}
        {!isSingle && (
          <Polyline
            points={points} fill="none"
            stroke={COLORS.primary} strokeWidth={2}
            strokeLinejoin="round" strokeLinecap="round"
          />
        )}

        {/* Data point circles */}
        {coords.map(({ x, y }, i) => (
          <Circle key={`dot-${i}`} cx={x} cy={y} r={3} fill={COLORS.primary} />
        ))}

        {/* Max / min score labels */}
        {coords.map(({ x, y, value }, i) => {
          if (i !== maxIdx && i !== minIdx) return null
          // Offset label above for max, below for min
          const dy = i === maxIdx ? -8 : 12
          return (
            <SvgText
              key={`label-${i}`} x={x} y={y + dy}
              fontSize={TYPOGRAPHY.fontSize.xs}
              fill={i === maxIdx ? COLORS.accent : COLORS.error}
              textAnchor="middle" fontWeight="600"
            >
              {value}
            </SvgText>
          )
        })}

        {/* Day labels */}
        {coords.map(({ x }, i) => (
          <SvgText
            key={`day-${i}`} x={x} y={height - 2}
            fontSize={TYPOGRAPHY.fontSize.xs}
            fill={COLORS.textSecondary} textAnchor="middle"
          >
            {`D${i + 1}`}
          </SvgText>
        ))}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  moodTrendContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  moodTrendTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  emptyHint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
})
