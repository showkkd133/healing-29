import React, { useCallback, useState } from 'react'
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { SPACING } from '@/constants/theme'
import { type LegacyEntry, LEGACY_CATEGORIES } from './Day27Types'
import ClaimAnimation from './Day27ClaimAnimation'
import Day27CompletedView from './Day27CompletedView'
import Day27LegacyForm from './Day27LegacyForm'

// ─── Props ─────────────────────────────────────────────────────────

interface Day27LegacyProps {
  readonly onComplete: (data: {
    readonly legacies: ReadonlyArray<{
      readonly item: string
      readonly category: string
      readonly ownership: string
      readonly transformation?: string
    }>
  }) => void
}

// ─── Haptics helper ────────────────────────────────────────────────

const tryHaptics = async (fn: () => Promise<void>) => {
  try {
    await fn()
  } catch {
    // Haptics not available
  }
}

// ─── Main component ────────────────────────────────────────────────

const Day27Legacy = React.memo(function Day27Legacy({
  onComplete,
}: Day27LegacyProps) {
  const [legacies, setLegacies] = useState<ReadonlyArray<LegacyEntry>>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(LEGACY_CATEGORIES[0].id)
  const [itemText, setItemText] = useState('')
  const [selectedOwnership, setSelectedOwnership] = useState<string | null>(null)
  const [transformationText, setTransformationText] = useState('')
  const [showTransform, setShowTransform] = useState(false)
  const [phase, setPhase] = useState<'input' | 'claim' | 'done'>('input')
  const [completed, setCompleted] = useState(false)

  const canAdd = itemText.trim().length > 0 && selectedOwnership !== null

  const resetForm = useCallback(() => {
    setItemText('')
    setSelectedOwnership(null)
    setTransformationText('')
    setShowTransform(false)
  }, [])

  const handleSelectCategory = useCallback(async (catId: string) => {
    setSelectedCategory(catId)
    await tryHaptics(() => Haptics.selectionAsync())
  }, [])

  const handleSelectOwnership = useCallback(async (ownershipId: string) => {
    setSelectedOwnership(ownershipId)
    setShowTransform(ownershipId === 'given')
    if (ownershipId !== 'given') {
      setTransformationText('')
    }
    await tryHaptics(() => Haptics.selectionAsync())
  }, [])

  const handleAddLegacy = useCallback(async () => {
    if (!canAdd || !selectedOwnership) return

    const newEntry: LegacyEntry = {
      item: itemText.trim(),
      category: selectedCategory,
      ownership: selectedOwnership,
      ...(selectedOwnership === 'given' && transformationText.trim().length > 0
        ? { transformation: transformationText.trim() }
        : {}),
    }
    setLegacies((prev) => [...prev, newEntry])
    resetForm()

    await tryHaptics(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light))
  }, [canAdd, itemText, selectedCategory, selectedOwnership, transformationText, resetForm])

  const handleClaim = useCallback(async () => {
    if (legacies.length === 0) return
    setPhase('claim')
    await tryHaptics(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy))
  }, [legacies])

  const handleClaimFinish = useCallback(async () => {
    setCompleted(true)
    await tryHaptics(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success))
    onComplete({ legacies: [...legacies] })
  }, [legacies, onComplete])

  // ─── Render: completed state ──────────────────────────────────

  if (completed) {
    return <Day27CompletedView />
  }

  // ─── Render: claim animation ──────────────────────────────────

  if (phase === 'claim') {
    return (
      <View style={styles.container}>
        <ClaimAnimation count={legacies.length} onFinish={handleClaimFinish} />
      </View>
    )
  }

  // ─── Render: main input phase ─────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Day27LegacyForm
          legacies={legacies}
          selectedCategory={selectedCategory}
          itemText={itemText}
          selectedOwnership={selectedOwnership}
          transformationText={transformationText}
          showTransform={showTransform}
          canAdd={canAdd}
          onSelectCategory={handleSelectCategory}
          onSelectOwnership={handleSelectOwnership}
          onChangeItemText={setItemText}
          onChangeTransformationText={setTransformationText}
          onAddLegacy={handleAddLegacy}
          onClaim={handleClaim}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING['5xl'],
  },
})

export default Day27Legacy
