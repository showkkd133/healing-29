import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING } from '@/constants/theme'
import Day25SealAnimation from './Day25SealAnimation'
import Day25TransformTable from './Day25TransformTable'
import Day25RegretInput from './Day25RegretInput'

// ─── Types (exported for sub-components) ───────────────────────────

export interface RegretEntry {
  readonly regret: string
  readonly alternative: string
  readonly currentChoice: string
}

// ─── Props ─────────────────────────────────────────────────────────

interface Day25RegretListProps {
  readonly onComplete: (data: {
    readonly regrets: ReadonlyArray<RegretEntry>
  }) => void
}

// ─── Constants ─────────────────────────────────────────────────────

const MAX_REGRETS = 3
const COMPLETION_TEXT = '遗憾是未选择的路，但你已经在另一条路上'

// ─── Main component ────────────────────────────────────────────────

const Day25RegretList = React.memo(function Day25RegretList({
  onComplete,
}: Day25RegretListProps) {
  const [regrets, setRegrets] = useState<ReadonlyArray<RegretEntry>>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [regretText, setRegretText] = useState('')
  const [alternativeText, setAlternativeText] = useState('')
  const [currentChoiceText, setCurrentChoiceText] = useState('')
  const [phase, setPhase] = useState<'input' | 'table' | 'seal' | 'done'>('input')
  const [completed, setCompleted] = useState(false)

  const canProceed = regretText.trim().length > 0 &&
    alternativeText.trim().length > 0 &&
    currentChoiceText.trim().length > 0

  const handleNextRegret = useCallback(async () => {
    if (!canProceed) return

    const newEntry: RegretEntry = {
      regret: regretText.trim(),
      alternative: alternativeText.trim(),
      currentChoice: currentChoiceText.trim(),
    }
    const updatedRegrets = [...regrets, newEntry]
    setRegrets(updatedRegrets)

    // Reset form
    setRegretText('')
    setAlternativeText('')
    setCurrentChoiceText('')

    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }

    if (currentStep < MAX_REGRETS - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setPhase('table')
    }
  }, [canProceed, regretText, alternativeText, currentChoiceText, regrets, currentStep])

  const handleStartSeal = useCallback(async () => {
    setPhase('seal')
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    } catch {
      // Haptics not available
    }
  }, [])

  const handleSealFinish = useCallback(async () => {
    setCompleted(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
    onComplete({ regrets: [...regrets] })
  }, [regrets, onComplete])

  // ─── Render: completed state ──────────────────────────────────

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🛤️</Text>
          <Text style={styles.completedText}>{COMPLETION_TEXT}</Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: seal animation ───────────────────────────────────

  if (phase === 'seal') {
    return (
      <View style={styles.container}>
        <Day25SealAnimation itemCount={regrets.length} onFinish={handleSealFinish} />
      </View>
    )
  }

  // ─── Render: regret transformation table ──────────────────────

  if (phase === 'table') {
    return (
      <View style={styles.container}>
        <Day25TransformTable regrets={regrets} onSeal={handleStartSeal} />
      </View>
    )
  }

  // ─── Render: input view ───────────────────────────────────────

  return (
    <View style={styles.container}>
      <Day25RegretInput
        currentStep={currentStep}
        regretText={regretText}
        alternativeText={alternativeText}
        currentChoiceText={currentChoiceText}
        canProceed={canProceed}
        onRegretChange={setRegretText}
        onAlternativeChange={setAlternativeText}
        onCurrentChoiceChange={setCurrentChoiceText}
        onNext={handleNextRegret}
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
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xl,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day25RegretList
