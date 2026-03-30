import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { CATEGORIES } from './Day4Types'
import { ZenButton } from '../ui/ZenButton'

interface Day4AddItemFormProps {
  readonly itemName: string
  readonly itemCategory: string | null
  readonly onNameChange: (name: string) => void
  readonly onCategoryChange: (key: string) => void
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

// Form for adding a new item to the declutter box
const Day4AddItemForm = React.memo(function Day4AddItemForm({
  itemName,
  itemCategory,
  onNameChange,
  onCategoryChange,
  onConfirm,
  onCancel,
}: Day4AddItemFormProps) {
  const isValid = itemName.trim() && itemCategory

  return (
    <Animated.View entering={SlideInDown.duration(300)} style={styles.form}>
      <TextInput
        style={styles.input}
        value={itemName}
        onChangeText={onNameChange}
        placeholder="物品名称"
        placeholderTextColor={COLORS.textTertiary}
        maxLength={30}
      />
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <ZenButton
            key={cat.key}
            title={cat.label}
            leftIcon={cat.icon as any}
            variant={itemCategory === cat.key ? 'primary' : 'outline'}
            size="sm"
            onPress={() => onCategoryChange(cat.key)}
            style={styles.categoryChip}
          />
        ))}
      </View>
      <View style={styles.actions}>
        <ZenButton
          title="取消"
          variant="ghost"
          size="sm"
          onPress={onCancel}
        />
        <ZenButton
          title="确认"
          variant="primary"
          size="sm"
          onPress={onConfirm}
          disabled={!isValid}
        />
      </View>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  form: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  categoryChip: {
    paddingHorizontal: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
})

export default Day4AddItemForm
