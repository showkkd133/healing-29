import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING } from '@/constants/theme'
import type { DeclutterItem } from './Day4Types'
import { GUIDANCE_TEXT, getDefaultSealDate } from './Day4Types'
import Day4CompletedView from './Day4CompletedView'
import Day4SealedView from './Day4SealedView'
import Day4CategoryFilter from './Day4CategoryFilter'
import Day4ItemList from './Day4ItemList'
import Day4SealSection from './Day4SealSection'

// ─── Props ─────────────────────────────────────────────────────────

interface Day4DeclutterProps {
  readonly onComplete: (data: {
    readonly items: string[]
    readonly categories: string[]
    readonly sealDate: string
  }) => void
}

// ─── Main component ────────────────────────────────────────────────

const Day4Declutter = React.memo(function Day4Declutter({
  onComplete,
}: Day4DeclutterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [items, setItems] = useState<readonly DeclutterItem[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemCategory, setNewItemCategory] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [sealDate, setSealDate] = useState(getDefaultSealDate)
  const [sealed, setSealed] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Unique categories used by items
  const usedCategories = useMemo(
    () => [...new Set(items.map((item) => item.category))],
    [items]
  )

  // ─── Category toggle ────────────────────────────────────────────

  const toggleCategory = useCallback(async (key: string) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    )
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  // ─── Add item ────────────────────────────────────────────────────

  const handleAddItem = useCallback(async () => {
    if (!newItemName.trim() || !newItemCategory) return

    const item: DeclutterItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: newItemName.trim(),
      category: newItemCategory,
    }

    setItems((prev) => [...prev, item])
    setNewItemName('')
    setNewItemCategory(null)
    setShowAddForm(false)

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {
      // Haptics not available
    }
  }, [newItemName, newItemCategory])

  const handleCancelAdd = useCallback(() => {
    setShowAddForm(false)
    setNewItemName('')
    setNewItemCategory(null)
  }, [])

  // ─── Seal ceremony ──────────────────────────────────────────────

  const handleSeal = useCallback(async () => {
    if (items.length === 0) return
    setSealed(true)

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
  }, [items])

  // ─── Complete ────────────────────────────────────────────────────

  const handleComplete = useCallback(() => {
    setCompleted(true)
    onComplete({
      items: items.map((i) => i.name),
      categories: usedCategories,
      sealDate,
    })
  }, [items, usedCategories, sealDate, onComplete])

  // ─── Render: completed state ─────────────────────────────────────

  if (completed) {
    return <Day4CompletedView />
  }

  // ─── Render: sealed state ────────────────────────────────────────

  if (sealed) {
    return (
      <Day4SealedView
        itemCount={items.length}
        sealDate={sealDate}
        onComplete={handleComplete}
      />
    )
  }

  // ─── Render: main ────────────────────────────────────────────────

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Guidance */}
      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.guidanceText}>
        {GUIDANCE_TEXT}
      </Animated.Text>

      {/* Category filters */}
      <Day4CategoryFilter
        selectedCategories={selectedCategories}
        onToggle={toggleCategory}
      />

      {/* Item list with add form */}
      <Day4ItemList
        items={items}
        showAddForm={showAddForm}
        newItemName={newItemName}
        newItemCategory={newItemCategory}
        onShowAddForm={() => setShowAddForm(true)}
        onItemNameChange={setNewItemName}
        onItemCategoryChange={setNewItemCategory}
        onAddItem={handleAddItem}
        onCancelAdd={handleCancelAdd}
      />

      {/* Virtual box + seal controls */}
      <Day4SealSection
        itemCount={items.length}
        sealDate={sealDate}
        onSealDateChange={setSealDate}
        onSeal={handleSeal}
      />
    </ScrollView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING['4xl'],
  },
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
})

export default Day4Declutter
