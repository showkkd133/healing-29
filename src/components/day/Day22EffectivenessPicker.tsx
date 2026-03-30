import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Props ────────────────────────────────────────────────────────

interface EffectivenessPickerProps {
  readonly value: number
  readonly onChange: (val: number) => void
}

// ─── Component ────────────────────────────────────────────────────

const Day22EffectivenessPicker = React.memo(function Day22EffectivenessPicker({
  value,
  onChange,
}: EffectivenessPickerProps) {
  return (
    <View style={styles.starsRow}>
      <Text style={styles.starsLabel}>效果评分</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onChange(star)}
            activeOpacity={0.7}
          >
            <Text style={[styles.star, star <= value && styles.starActive]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  starsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  star: {
    fontSize: 28,
    color: COLORS.border,
  },
  starActive: {
    color: COLORS.accent,
  },
})

export default Day22EffectivenessPicker
