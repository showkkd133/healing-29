import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SPACING } from '@/constants/theme'
import { CATEGORIES } from './Day4Types'
import { ZenButton } from '../ui/ZenButton'

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
      {CATEGORIES.map((cat) => {
        const isActive = selectedCategories.includes(cat.key);
        return (
          <ZenButton
            key={cat.key}
            title={cat.label}
            leftIcon={cat.icon as any}
            variant={isActive ? 'primary' : 'outline'}
            size="sm"
            onPress={() => onToggle(cat.key)}
            style={styles.chip}
          />
        );
      })}
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
    paddingHorizontal: SPACING.md,
  },
})

export default Day4CategoryFilter
