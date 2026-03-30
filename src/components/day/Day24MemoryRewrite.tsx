import React, { useCallback, useState } from 'react'
import * as Haptics from 'expo-haptics'
import Day24CompletedView from './Day24CompletedView'
import Day24InputStep from './Day24InputStep'
import Day24RewriteStep from './Day24RewriteStep'
import Day24CompareStep from './Day24CompareStep'

// ─── Props ─────────────────────────────────────────────────────────

interface Day24MemoryRewriteProps {
  readonly onComplete: (data: {
    readonly oldNarrative: string
    readonly newNarrative: string
    readonly insightGained: string
    readonly setAsDefault: boolean
  }) => void
}

// ─── Constants ─────────────────────────────────────────────────────

const TEMPLATES = [
  '那时的我以为…现在我知道…',
  '那件事让我学会了…',
] as const

const COMPLETION_TEXT = '记忆不是录像带，是每次播放都在改变的故事'

// ─── Main component ────────────────────────────────────────────────

const Day24MemoryRewrite = React.memo(function Day24MemoryRewrite({
  onComplete,
}: Day24MemoryRewriteProps) {
  const [step, setStep] = useState<'input' | 'rewrite' | 'compare'>('input')
  const [oldNarrative, setOldNarrative] = useState('')
  const [newNarrative, setNewNarrative] = useState('')
  const [insightGained, setInsightGained] = useState('')
  const [setAsDefault, setSetAsDefault] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleProceedToRewrite = useCallback(async () => {
    if (oldNarrative.trim().length === 0) return
    setStep('rewrite')
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [oldNarrative])

  const handleTemplatePress = useCallback(async (template: string) => {
    setNewNarrative((prev) => (prev.length === 0 ? template : prev))
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleProceedToCompare = useCallback(async () => {
    if (newNarrative.trim().length === 0) return
    setStep('compare')
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [newNarrative])

  const handleComplete = useCallback(async () => {
    setCompleted(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
    onComplete({
      oldNarrative: oldNarrative.trim(),
      newNarrative: newNarrative.trim(),
      insightGained: insightGained.trim(),
      setAsDefault,
    })
  }, [oldNarrative, newNarrative, insightGained, setAsDefault, onComplete])

  // ─── Render ───────────────────────────────────────────────────

  if (completed) {
    return <Day24CompletedView completionText={COMPLETION_TEXT} />
  }

  if (step === 'compare') {
    return (
      <Day24CompareStep
        oldNarrative={oldNarrative}
        newNarrative={newNarrative}
        insightGained={insightGained}
        setAsDefault={setAsDefault}
        onChangeInsight={setInsightGained}
        onToggleDefault={setSetAsDefault}
        onComplete={handleComplete}
      />
    )
  }

  if (step === 'rewrite') {
    return (
      <Day24RewriteStep
        oldNarrative={oldNarrative}
        newNarrative={newNarrative}
        templates={TEMPLATES}
        onChangeNewNarrative={setNewNarrative}
        onTemplatePress={handleTemplatePress}
        onProceed={handleProceedToCompare}
      />
    )
  }

  return (
    <Day24InputStep
      oldNarrative={oldNarrative}
      onChangeOldNarrative={setOldNarrative}
      onProceed={handleProceedToRewrite}
    />
  )
})

export default Day24MemoryRewrite
