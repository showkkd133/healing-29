import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day26SliderRowProps {
  readonly label: string
  readonly value: number
  readonly onChange: (val: number) => void
}

// ─── Component ─────────────────────────────────────────────────────

const DOTS = [1, 2, 3, 4, 5] as const

const Day26SliderRow = React.memo(function Day26SliderRow({
  label,
  value,
  onChange,
}: Day26SliderRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dotsRow}>
        {DOTS.map((dot) => (
          <TouchableOpacity
            key={dot}
            style={[styles.dot, dot <= value && styles.dotActive]}
            onPress={() => onChange(dot)}
            activeOpacity={0.7}
          />
        ))}
      </View>
      <Text style={styles.valueText}>{value}/5</Text>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    width: 40,
  },
  dotsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
  valueText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    width: 30,
    textAlign: 'right',
  },
})

export default Day26SliderRow
