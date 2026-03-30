import React from 'react'
import { Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'

// ─── Types ────────────────────────────────────────────────────────

export const CATEGORIES = [
  '价值观',
  '生活习惯',
  '沟通方式',
  '未来规划',
  '其他',
] as const

export type Category = typeof CATEGORIES[number]

export interface Evidence {
  readonly text: string
  readonly category: Category
}

export const EMPTY_EVIDENCE: Evidence = { text: '', category: '价值观' }

export const createEmptyEvidences = (): readonly [Evidence, Evidence, Evidence] => [
  { ...EMPTY_EVIDENCE },
  { ...EMPTY_EVIDENCE },
  { ...EMPTY_EVIDENCE },
]

// ─── CategoryPicker component ─────────────────────────────────────

interface CategoryPickerProps {
  readonly value: Category
  readonly onChange: (category: Category) => void
}

const CategoryPicker = React.memo(function CategoryPicker({
  value,
  onChange,
}: CategoryPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={pickerStyles.container}
    >
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[
            pickerStyles.pill,
            value === cat && pickerStyles.pillActive,
          ]}
          onPress={() => onChange(cat)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              pickerStyles.pillText,
              value === cat && pickerStyles.pillTextActive,
            ]}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const pickerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  pill: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: COLORS.card,
  },
})

export default CategoryPicker
