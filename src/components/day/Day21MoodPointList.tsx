import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { type MoodPoint, NORMAL_LOW, formatHour } from './Day21ChartConstants'

interface Day21MoodPointListProps {
  readonly sortedPoints: readonly MoodPoint[]
  readonly onPointTap: (pointId: string) => void
}

const Day21MoodPointList = React.memo(function Day21MoodPointList({
  sortedPoints,
  onPointTap,
}: Day21MoodPointListProps) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.pointList}>
      <Text style={styles.sectionTitle}>心情记录</Text>
      {sortedPoints.map((point) => (
        <TouchableOpacity
          key={point.id}
          style={styles.pointItem}
          onPress={() => onPointTap(point.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.pointTime}>{formatHour(point.hour)}</Text>
          <View style={[styles.pointScore, point.score < NORMAL_LOW && styles.pointScoreLow]}>
            <Text style={styles.pointScoreText}>{point.score}</Text>
          </View>
          <Text style={styles.pointTrigger} numberOfLines={1}>
            {point.trigger || '点击添加原因'}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  pointList: {
    marginBottom: SPACING['2xl'],
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  pointTime: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    width: 50,
  },
  pointScore: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  pointScoreLow: {
    backgroundColor: COLORS.warning,
  },
  pointScoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.card,
  },
  pointTrigger: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
  },
})

export default Day21MoodPointList
