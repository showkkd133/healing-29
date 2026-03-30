import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { CATEGORIES } from './Day4Types'
import type { DeclutterItem } from './Day4Types'
import Day4AddItemForm from './Day4AddItemForm'

interface Day4ItemListProps {
  readonly items: readonly DeclutterItem[]
  readonly showAddForm: boolean
  readonly newItemName: string
  readonly newItemCategory: string | null
  readonly onShowAddForm: () => void
  readonly onItemNameChange: (name: string) => void
  readonly onItemCategoryChange: (key: string) => void
  readonly onAddItem: () => void
  readonly onCancelAdd: () => void
}

// Declutter item list with add-form toggle
const Day4ItemList = React.memo(function Day4ItemList({
  items,
  showAddForm,
  newItemName,
  newItemCategory,
  onShowAddForm,
  onItemNameChange,
  onItemCategoryChange,
  onAddItem,
  onCancelAdd,
}: Day4ItemListProps) {
  return (
    <Animated.View entering={FadeIn.delay(700).duration(400)} style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>收纳清单</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={onShowAddForm}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+ 添加物品</Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <Day4AddItemForm
          itemName={newItemName}
          itemCategory={newItemCategory}
          onNameChange={onItemNameChange}
          onCategoryChange={onItemCategoryChange}
          onConfirm={onAddItem}
          onCancel={onCancelAdd}
        />
      )}

      {items.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={SlideInUp.delay(index * 50).duration(400)}
          style={styles.itemRow}
        >
          <Text style={styles.itemCategory}>
            {CATEGORIES.find((c) => c.key === item.category)?.label.slice(0, 2)}
          </Text>
          <Text style={styles.itemName}>{item.name}</Text>
        </Animated.View>
      ))}

      {items.length === 0 && (
        <Text style={styles.emptyText}>点击"添加物品"开始收纳</Text>
      )}
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING['2xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  addButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.card,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  itemCategory: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  itemName: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING['2xl'],
  },
})

export default Day4ItemList
