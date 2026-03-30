import React, { useCallback, useMemo, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { SPACING } from '@/constants/theme'
import Day26WishForm from './Day26WishForm'
import Day26Certificate from './Day26Certificate'
import Day26CompletedView from './Day26CompletedView'

// ─── Props ─────────────────────────────────────────────────────────

interface Day26SelfGiftProps {
  readonly onComplete: (data: {
    readonly type: string
    readonly wish: string
    readonly feasibility: number
    readonly plan: string
    readonly completed: boolean
  }) => void
}

// ─── Main component ────────────────────────────────────────────────

const Day26SelfGift = React.memo(function Day26SelfGift({
  onComplete,
}: Day26SelfGiftProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [wish, setWish] = useState('')
  const [feasibility, setFeasibility] = useState({ time: 3, money: 3, energy: 3 })
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [executionNote, setExecutionNote] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [done, setDone] = useState(false)

  const avgFeasibility = useMemo(
    () => Math.round(((feasibility.time + feasibility.money + feasibility.energy) / 3) * 10) / 10,
    [feasibility]
  )

  const canComplete = selectedType !== null && wish.trim().length > 0 && selectedPlan !== null

  // ─── Handlers ─────────────────────────────────────────────────

  const handleSelectType = useCallback(async (typeId: string) => {
    setSelectedType(typeId)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleSelectPlan = useCallback(async (planId: string) => {
    setSelectedPlan(planId)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleFeasibilityChange = useCallback((key: string, value: number) => {
    setFeasibility((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleShowCertificate = useCallback(async () => {
    if (!canComplete) return
    setShowCertificate(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
  }, [canComplete])

  const handleComplete = useCallback(async () => {
    setDone(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
    onComplete({
      type: selectedType ?? '',
      wish: wish.trim(),
      feasibility: avgFeasibility,
      plan: selectedPlan ?? '',
      completed: isCompleted,
    })
  }, [selectedType, wish, avgFeasibility, selectedPlan, isCompleted, onComplete])

  // ─── Render ───────────────────────────────────────────────────

  if (done) {
    return (
      <View style={styles.container}>
        <Day26CompletedView />
      </View>
    )
  }

  if (showCertificate) {
    return (
      <View style={styles.container}>
        <Day26Certificate
          selectedType={selectedType ?? ''}
          wish={wish}
          onComplete={handleComplete}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Day26WishForm
        selectedType={selectedType}
        wish={wish}
        feasibility={feasibility}
        avgFeasibility={avgFeasibility}
        selectedPlan={selectedPlan}
        executionNote={executionNote}
        canComplete={canComplete}
        onSelectType={handleSelectType}
        onChangeWish={setWish}
        onFeasibilityChange={handleFeasibilityChange}
        onSelectPlan={handleSelectPlan}
        onChangeExecutionNote={setExecutionNote}
        onShowCertificate={handleShowCertificate}
      />
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
})

export default Day26SelfGift
