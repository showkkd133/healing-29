import React, { useCallback, useState } from 'react'
import * as Haptics from 'expo-haptics'
import { NEW_RITUALS, type Day15RitualReplaceProps } from './Day15Constants'
import Day15CompletedView from './Day15CompletedView'
import Day15ExecutionPhase from './Day15ExecutionPhase'
import Day15SetupPhase from './Day15SetupPhase'

// ─── Main orchestrator for Day 15 ritual replacement ──────────────

const Day15RitualReplace = React.memo(function Day15RitualReplace({
  onComplete,
}: Day15RitualReplaceProps) {
  const [oldRitual, setOldRitual] = useState('')
  const [selectedRitual, setSelectedRitual] = useState<string | null>(null)
  const [customRitual, setCustomRitual] = useState('')
  const [inExecution, setInExecution] = useState(false)
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null)
  const [reminderSet, setReminderSet] = useState(false)
  const [completed, setCompleted] = useState(false)

  const newRitualName = selectedRitual === 'custom'
    ? customRitual
    : NEW_RITUALS.find((r) => r.id === selectedRitual)?.title ?? ''

  const canStartExecution = oldRitual.trim().length > 0 &&
    selectedRitual !== null &&
    (selectedRitual !== 'custom' || customRitual.trim().length > 0)

  const canComplete = inExecution && selectedFeeling !== null

  const handleSelectRitual = useCallback(async (id: string) => {
    setSelectedRitual(id)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleStartExecution = useCallback(async () => {
    if (!canStartExecution) return
    setInExecution(true)
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {
      // Haptics not available
    }
  }, [canStartExecution])

  const handleSelectSticker = useCallback(async (sticker: string) => {
    setSelectedSticker(sticker)
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {
      // Haptics not available
    }
  }, [])

  const handleSelectFeeling = useCallback(async (id: string) => {
    setSelectedFeeling(id)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleComplete = useCallback(async () => {
    if (!canComplete || !selectedFeeling) return
    setCompleted(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
    onComplete({
      oldRitual,
      newRitual: newRitualName,
      feeling: selectedFeeling,
      reminderSet,
    })
  }, [canComplete, oldRitual, newRitualName, selectedFeeling, reminderSet, onComplete])

  // ─── Phase routing ──────────────────────────────────────────

  if (completed) {
    return <Day15CompletedView />
  }

  if (inExecution) {
    return (
      <Day15ExecutionPhase
        oldRitual={oldRitual}
        newRitualName={newRitualName}
        selectedRitual={selectedRitual!}
        selectedSticker={selectedSticker}
        selectedFeeling={selectedFeeling}
        reminderSet={reminderSet}
        onSelectSticker={handleSelectSticker}
        onSelectFeeling={handleSelectFeeling}
        onToggleReminder={setReminderSet}
        onComplete={handleComplete}
      />
    )
  }

  return (
    <Day15SetupPhase
      oldRitual={oldRitual}
      selectedRitual={selectedRitual}
      customRitual={customRitual}
      canStartExecution={canStartExecution}
      onChangeOldRitual={setOldRitual}
      onSelectRitual={handleSelectRitual}
      onChangeCustomRitual={setCustomRitual}
      onStartExecution={handleStartExecution}
    />
  )
})

export default Day15RitualReplace
