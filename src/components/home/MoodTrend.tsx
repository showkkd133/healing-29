import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Svg, {
  Polyline, Line, Circle, Polygon, Rect,
  Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop,
} from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme'

interface MoodTrendProps {
  moods: number[]
}

// Compute trend direction from mood data
const getTrendIndicator = (moods: readonly number[]): { label: string; symbol: string } => {
  if (moods.length < 2) return { label: '平稳', symbol: '→' }
  const mid = Math.floor(moods.length / 2)
  const firstHalf = moods.slice(0, mid)
  const secondHalf = moods.slice(mid)
  const avgFirst = firstHalf.reduce((s, v) => s + v, 0) / firstHalf.length
  const avgSecond = secondHalf.reduce((s, v) => s + v, 0) / secondHalf.length
  const diff = avgSecond - avgFirst
  if (diff > 0.3) return { label: '上升', symbol: '↗' }
  if (diff < -0.3) return { label: '下降', symbol: '↘' }
  return { label: '平稳', symbol: '→' }
}

// Soft red for min-score labels (gentler than COLORS.error)
const SOFT_RED = '#E8636C'

// Mood trend line chart with data points, min/max labels, and gradient fill
export default function MoodTrend({ moods }: MoodTrendProps) {
  // Defensive: empty state with illustrative design
  if (moods.length === 0) {
    return (
      <View style={styles.card}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBar}
        />
        <View style={styles.cardContent}>
          <Text style={styles.moodTrendTitle}>最近情绪趋势</Text>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyTitle}>还没有记录</Text>
            <Text style={styles.emptyHint}>
              完成每日任务后，你的情绪变化会在这里呈现
            </Text>
          </View>
        </View>
      </View>
    )
  }

  const width = Dimensions.get('window').width - 64
  const height = 100
  const padding = SPACING.lg
  const maxMood = 7
  const chartHeight = height - padding * 2

  // Compute coordinates for each data point
  const coords = moods.map((mood, i) => {
    const stepX = moods.length > 1
      ? (width - padding * 2) / (moods.length - 1)
      : 0
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
  const trend = getTrendIndicator(moods)

  // Horizontal grid line Y positions (3 lines at 25%, 50%, 75%)
  const gridYPositions = [0.25, 0.5, 0.75].map(
    (ratio) => height - padding - ratio * chartHeight
  )

  // Day label format: full when space allows, abbreviated otherwise
  const formatDayLabel = (index: number): string =>
    moods.length <= 7 ? `Day ${index + 1}` : `D${index + 1}`

  // Pill dimensions for max/min score badges
  const pillW = 28
  const pillH = 16
  const pillR = 8

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBar}
      />
      <View style={styles.cardContent}>
        {/* Title row with trend indicator */}
        <View style={styles.titleRow}>
          <Text style={styles.moodTrendTitle}>最近情绪趋势</Text>
          <Text style={styles.trendBadge}>
            {trend.symbol} {trend.label}
          </Text>
        </View>

        <Svg width={width} height={height}>
          <Defs>
            <SvgLinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={COLORS.primary} stopOpacity="0.2" />
              <Stop offset="1" stopColor={COLORS.primary} stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>

          {/* Horizontal grid lines (3 dashed) */}
          {gridYPositions.map((gy, i) => (
            <Line
              key={`grid-${i}`}
              x1={padding} y1={gy}
              x2={width - padding} y2={gy}
              stroke={COLORS.border} strokeWidth={0.5}
              strokeDasharray="4,4"
            />
          ))}

          {/* Baseline */}
          <Line
            x1={padding} y1={height - padding}
            x2={width - padding} y2={height - padding}
            stroke={COLORS.border} strokeWidth={1}
          />

          {/* Gradient fill area */}
          {!isSingle && (
            <Polygon points={fillPoints} fill="url(#areaGrad)" />
          )}

          {/* Trend line */}
          {!isSingle && (
            <Polyline
              points={points} fill="none"
              stroke={COLORS.primary} strokeWidth={2.5}
              strokeLinejoin="round" strokeLinecap="round"
            />
          )}

          {/* Data point circles with white stroke */}
          {coords.map(({ x, y }, i) => (
            <Circle
              key={`dot-${i}`} cx={x} cy={y} r={4}
              fill={COLORS.primary} stroke={COLORS.white} strokeWidth={2}
            />
          ))}

          {/* Max / min pill badges with triangle indicators */}
          {coords.map(({ x, y, value }, i) => {
            if (i !== maxIdx && i !== minIdx) return null
            const isMax = i === maxIdx
            const color = isMax ? COLORS.accent : SOFT_RED

            // Position pill above for max, below for min
            const pillY = isMax ? y - 22 : y + 8

            // Small triangle pointing toward the data point
            const triBase = isMax ? pillY + pillH + 1 : pillY - 5
            const triPoints = isMax
              ? `${x - 3},${triBase} ${x + 3},${triBase} ${x},${triBase + 4}`
              : `${x - 3},${triBase + 4} ${x + 3},${triBase + 4} ${x},${triBase}`

            return (
              <React.Fragment key={`label-${i}`}>
                {/* Pill background */}
                <Rect
                  x={x - pillW / 2} y={pillY}
                  width={pillW} height={pillH}
                  rx={pillR} ry={pillR}
                  fill={color}
                />
                {/* Score text */}
                <SvgText
                  x={x} y={pillY + pillH / 2 + 1}
                  fontSize={TYPOGRAPHY.fontSize.xs}
                  fill={COLORS.white}
                  textAnchor="middle"
                  fontWeight="700"
                  alignmentBaseline="central"
                >
                  {value}
                </SvgText>
                {/* Triangle indicator */}
                <Polygon points={triPoints} fill={color} />
              </React.Fragment>
            )
          })}

          {/* Day labels along the X axis */}
          {coords.map(({ x }, i) => (
            <SvgText
              key={`day-${i}`} x={x} y={height - 2}
              fontSize={TYPOGRAPHY.fontSize.xs}
              fill={COLORS.textSecondary} textAnchor="middle"
            >
              {formatDayLabel(i)}
            </SvgText>
          ))}
        </Svg>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  gradientBar: {
    height: 3,
  },
  cardContent: {
    padding: SPACING.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  moodTrendTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  trendBadge: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptyHint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
})
