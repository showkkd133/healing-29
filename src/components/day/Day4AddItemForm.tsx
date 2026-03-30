import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { CATEGORIES } from './Day4Types'

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
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryChip,
              itemCategory === cat.key && styles.categoryChipActive,
            ]}
            onPress={() => onCategoryChange(cat.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryChipText,
                itemCategory === cat.key && styles.categoryChipTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !isValid && styles.confirmButtonDisabled,
          ]}
          onPress={onConfirm}
          disabled={!isValid}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>确认</Text>
        </TouchableOpacity>
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
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background,
  },
  categoryChipActive: {
    backgroundColor: COLORS.secondary,
  },
  categoryChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  cancelButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  confirmButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day4AddItemForm
