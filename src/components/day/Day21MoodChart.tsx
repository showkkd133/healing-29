import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import Svg, { Polyline, Rect, Circle, Text as SvgText, Line } from 'react-native-svg'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import {
  type MoodPoint,
  CHART_WIDTH,
  CHART_HEIGHT,
  CHART_PADDING_LEFT,
  CHART_PADDING_RIGHT,
  PLOT_WIDTH,
  NORMAL_LOW,
  NORMAL_HIGH,
  hourToX,
  scoreToY,
} from './Day21ChartConstants'

// Y-axis tick values
const Y_TICKS = [0, 2, 4, 6, 8, 10] as const
// X-axis tick hours
const X_TICKS = [6, 9, 12, 15, 18, 21] as const
// Grid line scores
const GRID_SCORES = [2, 4, 6, 8] as const

interface Day21MoodChartProps {
  readonly sortedPoints: readonly MoodPoint[]
  readonly onPointTap: (pointId: string) => void
}

const Day21MoodChart = React.memo(function Day21MoodChart({
  sortedPoints,
  onPointTap,
}: Day21MoodChartProps) {
  const polylinePoints = useMemo(
    () => sortedPoints.map((p) => `${hourToX(p.hour)},${scoreToY(p.score)}`).join(' '),
    [sortedPoints]
  )

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.chartSection}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT} style={styles.chart}>
        {/* Normal range band */}
        <Rect
          x={CHART_PADDING_LEFT}
          y={scoreToY(NORMAL_HIGH)}
          width={PLOT_WIDTH}
          height={scoreToY(NORMAL_LOW) - scoreToY(NORMAL_HIGH)}
          fill={COLORS.border}
          opacity={0.3}
        />

        {/* Y-axis labels */}
        {Y_TICKS.map((score) => (
          <SvgText
            key={score}
            x={CHART_PADDING_LEFT - 8}
            y={scoreToY(score) + 4}
            fontSize={10}
            fill={COLORS.textTertiary}
            textAnchor="end"
          >
            {score}
          </SvgText>
        ))}

        {/* X-axis labels */}
        {X_TICKS.map((hour) => (
          <SvgText
            key={hour}
            x={hourToX(hour)}
            y={CHART_HEIGHT - 5}
            fontSize={10}
            fill={COLORS.textTertiary}
            textAnchor="middle"
          >
            {hour}:00
          </SvgText>
        ))}

        {/* Grid lines */}
        {GRID_SCORES.map((score) => (
          <Line
            key={score}
            x1={CHART_PADDING_LEFT}
            y1={scoreToY(score)}
            x2={CHART_WIDTH - CHART_PADDING_RIGHT}
            y2={scoreToY(score)}
            stroke={COLORS.border}
            strokeWidth={0.5}
            strokeDasharray="3,3"
          />
        ))}

        {/* Polyline */}
        {sortedPoints.length >= 2 && (
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={COLORS.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data points */}
        {sortedPoints.map((point) => (
          <Circle
            key={point.id}
            cx={hourToX(point.hour)}
            cy={scoreToY(point.score)}
            r={point.trigger ? 6 : 4}
            fill={point.score < NORMAL_LOW ? COLORS.warning : COLORS.primary}
            onPress={() => onPointTap(point.id)}
          />
        ))}
      </Svg>

      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.border }]} />
          <Text style={styles.legendText}>正常波动范围 (4-7)</Text>
        </View>
      </View>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  chartSection: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  chart: {
    marginBottom: SPACING.md,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 8,
    borderRadius: 2,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
})

export default Day21MoodChart
