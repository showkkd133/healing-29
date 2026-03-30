import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'
import { CATEGORIES } from './Day4Types'

interface Day4CategoryFilterProps {
  readonly selectedCategories: readonly string[]
  readonly onToggle: (key: string) => void
}

// Row of category chips for filtering declutter items
const Day4CategoryFilter = React.memo(function Day4CategoryFilter({
  selectedCategories,
  onToggle,
}: Day4CategoryFilterProps) {
  return (
    <Animated.View entering={FadeIn.delay(500).duration(400)} style={styles.row}>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.key}
          style={[
            styles.chip,
            selectedCategories.includes(cat.key) && styles.chipActive,
          ]}
          onPress={() => onToggle(cat.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              selectedCategories.includes(cat.key) && styles.chipTextActive,
            ]}
          >
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING['2xl'],
  },
  chip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.card,
  },
})

export default Day4CategoryFilter
