import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { EXPERIMENTS } from './Day20Constants'

// ─── Props ─────────────────────────────────────────────────────────

interface Day20ExperimentSelectorProps {
  readonly onSelect: (type: string) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day20ExperimentSelector = React.memo(function Day20ExperimentSelector({
  onSelect,
}: Day20ExperimentSelectorProps) {
  return (
    <>
      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.guidanceText}>
        {'\u9009\u62E9\u4E00\u9879\u5B9E\u9A8C\u7C7B\u578B'}
      </Animated.Text>
      <View style={styles.cardRow}>
        {EXPERIMENTS.map((exp, index) => (
          <Animated.View
            key={exp.type}
            entering={FadeInDown.delay(400 + index * 150).duration(400)}
          >
            <TouchableOpacity
              style={styles.experimentCard}
              onPress={() => onSelect(exp.type)}
              activeOpacity={0.8}
            >
              <Text style={styles.experimentIcon}>{exp.icon}</Text>
              <Text style={styles.experimentLabel}>{exp.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  experimentCard: {
    width: 100,
    height: 120,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  experimentIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  experimentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
})

export default Day20ExperimentSelector
