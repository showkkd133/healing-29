import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Svg, {
  Polyline, Line, Circle, Polygon,
  Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop,
} from 'react-native-svg'
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme'

interface MoodTrendProps {
  moods: number[]
}

// Mood trend line chart — minimal card with data points and gradient fill
export default function MoodTrend({ moods }: MoodTrendProps) {
  // Empty state
  if (moods.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>情绪趋势</Text>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyHint}>完成任务后查看趋势</Text>
          </View>
        </View>
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

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>情绪趋势</Text>

        <Svg width={width} height={height}>
          <Defs>
            <SvgLinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={COLORS.primary} stopOpacity="0.1" />
              <Stop offset="1" stopColor={COLORS.primary} stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>

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

          {/* Data point circles — solid fill, no stroke */}
          {coords.map(({ x, y }, i) => (
            <Circle
              key={`dot-${i}`} cx={x} cy={y} r={3}
              fill={COLORS.primary}
            />
          ))}

          {/* Max / min score labels — plain text, no background */}
          {coords.map(({ x, y, value }, i) => {
            if (i !== maxIdx && i !== minIdx) return null
            const isMax = i === maxIdx
            const color = isMax ? COLORS.accent : COLORS.textSecondary
            // Position above for max, below for min
            const labelY = isMax ? y - 6 : y + 14

            return (
              <SvgText
                key={`label-${i}`}
                x={x} y={labelY}
                fontSize={TYPOGRAPHY.fontSize.xs}
                fill={color}
                textAnchor="middle"
                fontWeight="600"
              >
                {value}
              </SvgText>
            )
          })}

          {/* X-axis day labels */}
          {coords.map(({ x }, i) => (
            <SvgText
              key={`day-${i}`} x={x} y={height - 2}
              fontSize={TYPOGRAPHY.fontSize.xs}
              fill={COLORS.textSecondary} textAnchor="middle"
            >
              {i + 1}
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
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardContent: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center' as const,
    paddingVertical: SPACING.xl,
  },
  emptyHint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
    textAlign: 'center' as const,
  },
})
