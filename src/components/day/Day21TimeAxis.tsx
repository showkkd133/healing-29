import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'
import { type MoodPoint, TIME_START, TIME_RANGE } from './Day21ChartConstants'

const HOURS = Array.from({ length: TIME_RANGE + 1 }, (_, i) => TIME_START + i)

interface Day21TimeAxisProps {
  readonly moodPoints: readonly MoodPoint[]
  readonly onHourTap: (hour: number) => void
}

const Day21TimeAxis = React.memo(function Day21TimeAxis({
  moodPoints,
  onHourTap,
}: Day21TimeAxisProps) {
  return (
    <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.section}>
      <Text style={styles.sectionTitle}>点击时间添加心情点</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.row}>
          {HOURS.map((hour) => {
            const hasPoint = moodPoints.some((p) => p.hour === hour)
            return (
              <TouchableOpacity
                key={hour}
                style={[styles.slot, hasPoint && styles.slotActive]}
                onPress={() => onHourTap(hour)}
                activeOpacity={0.7}
              >
                <Text style={[styles.slotText, hasPoint && styles.slotTextActive]}>
                  {hour}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING['2xl'],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  scroll: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingRight: SPACING.lg,
  },
  slot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  slotText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  slotTextActive: {
    color: COLORS.card,
  },
})

export default Day21TimeAxis
