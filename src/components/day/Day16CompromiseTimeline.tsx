import React, { useCallback } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Types ─────────────────────────────────────────────────────────

export interface CompromiseEntry {
  readonly id: string
  readonly time: string
  readonly description: string
}

// ─── Props ─────────────────────────────────────────────────────────

interface Day16CompromiseTimelineProps {
  readonly compromises: readonly CompromiseEntry[]
  readonly onCompromiseChange: (id: string, field: 'time' | 'description', value: string) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day16CompromiseTimeline = React.memo(function Day16CompromiseTimeline({
  compromises,
  onCompromiseChange,
}: Day16CompromiseTimelineProps) {
  return (
    <Animated.View entering={FadeInDown.delay(700).duration(400)} style={styles.section}>
      <Text style={styles.sectionTitle}>不舒服但忍了的时刻</Text>
      {compromises.map((entry, index) => (
        <View key={entry.id} style={styles.timelineEntry}>
          <View style={styles.timelineDot} />
          {index < compromises.length - 1 && <View style={styles.timelineLine} />}
          <View style={styles.timelineContent}>
            <TextInput
              style={styles.timeInput}
              value={entry.time}
              onChangeText={(v) => onCompromiseChange(entry.id, 'time', v)}
              placeholder="时间"
              placeholderTextColor={COLORS.textTertiary}
              maxLength={20}
            />
            <TextInput
              style={styles.descInput}
              value={entry.description}
              onChangeText={(v) => onCompromiseChange(entry.id, 'description', v)}
              placeholder="发生了什么"
              placeholderTextColor={COLORS.textTertiary}
              maxLength={100}
            />
          </View>
        </View>
      ))}
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

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
  timelineEntry: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    paddingLeft: SPACING.lg,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  timelineLine: {
    position: 'absolute',
    left: 4,
    top: 16,
    width: 2,
    height: '100%',
    backgroundColor: COLORS.border,
  },
  timelineContent: {
    flex: 1,
    gap: SPACING.sm,
  },
  timeInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    fontSize: 13,
    color: COLORS.textSecondary,
    width: 120,
    ...SHADOWS.sm,
  },
  descInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
    ...SHADOWS.sm,
  },
})

export default Day16CompromiseTimeline
