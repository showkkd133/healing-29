import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { COLORS, SPACING } from '@/constants/theme'
import { ZenButton } from '@/components/ui/ZenButton'
import { useHaptic } from '@/hooks/useHaptic'

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
  const haptic = useHaptic();

  const handleSelect = (cat: Category) => {
    haptic.light();
    onChange(cat);
  };

  return (
    <View style={pickerStyles.outerContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={pickerStyles.container}
      >
        {CATEGORIES.map((cat) => (
          <View key={cat} style={pickerStyles.pillWrapper}>
            <ZenButton
              title={cat}
              variant={value === cat ? 'primary' : 'outline'}
              size="sm"
              onPress={() => handleSelect(cat)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const pickerStyles = StyleSheet.create({
  outerContainer: {
    marginVertical: SPACING.md,
  },
  container: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  pillWrapper: {
    minWidth: 80,
  },
})

export default CategoryPicker
