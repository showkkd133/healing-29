import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day20ComfortSliderProps {
  readonly value: number
  readonly onChange: (value: number) => void
}

// ─── Constants ─────────────────────────────────────────────────────

const COMFORT_LABELS = [
  '\u5F88\u4E0D\u8212\u670D',
  '\u4E0D\u592A\u8212\u670D',
  '\u4E00\u822C',
  '\u8FD8\u597D',
  '\u5F88\u8212\u670D',
] as const

const COMFORT_LEVELS = [1, 2, 3, 4, 5] as const

// ─── Component ─────────────────────────────────────────────────────

const Day20ComfortSlider = React.memo(function Day20ComfortSlider({
  value,
  onChange,
}: Day20ComfortSliderProps) {
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{'\u8212\u9002\u5EA6\u8BC4\u5206'}</Text>
      <View style={styles.sliderRow}>
        {COMFORT_LEVELS.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.sliderDot,
              level <= value && styles.sliderDotActive,
            ]}
            onPress={() => onChange(level)}
            activeOpacity={0.7}
          >
            <Text style={[styles.sliderDotText, level <= value && styles.sliderDotTextActive]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sliderDesc}>
        {value > 0 ? COMFORT_LABELS[value - 1] : '\u9009\u62E9 1-5'}
      </Text>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sliderContainer: {
    marginBottom: SPACING['2xl'],
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  sliderRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  sliderDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderDotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sliderDotText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  sliderDotTextActive: {
    color: COLORS.card,
  },
  sliderDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
})

export default Day20ComfortSlider
