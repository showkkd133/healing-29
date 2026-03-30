import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING } from '@/constants/theme'
import CrackOverlay from './Day16CrackOverlay'
import Day16FlawInputs from './Day16FlawInputs'
import Day16CompromiseTimeline, { type CompromiseEntry } from './Day16CompromiseTimeline'
import Day16ComparisonCards from './Day16ComparisonCards'
import Day16ActionButtons from './Day16ActionButtons'

// ─── Props ─────────────────────────────────────────────────────────

interface Day16BreakFilterProps {
  readonly onComplete: (data: {
    readonly flaws: string[]
    readonly compromises: string[]
    readonly emergencyKitUpdated: boolean
  }) => void
}

// ─── Constants ─────────────────────────────────────────────────────

const GUIDANCE_TEXT = '写下让你无法忍受的3个缺点'
const COMPLETION_TEXT = '完美是爱情的敌人，真实才是'

// ─── Main component ────────────────────────────────────────────────

const Day16BreakFilter = React.memo(function Day16BreakFilter({
  onComplete,
}: Day16BreakFilterProps) {
  const [flaws, setFlaws] = useState<readonly [string, string, string]>(['', '', ''])
  const [crackVisible, setCrackVisible] = useState<readonly [boolean, boolean, boolean]>([false, false, false])
  const [compromises, setCompromises] = useState<readonly CompromiseEntry[]>([
    { id: '1', time: '', description: '' },
    { id: '2', time: '', description: '' },
    { id: '3', time: '', description: '' },
  ])
  const [emergencyKitUpdated, setEmergencyKitUpdated] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleFlawChange = useCallback((index: number, value: string) => {
    setFlaws((prev) => {
      const next = [...prev] as [string, string, string]
      next[index] = value
      return next
    })
    // Reset crack when flaw text is cleared
    if (value.trim() === '') {
      setCrackVisible((prev) => {
        if (!prev[index]) return prev
        const next = [...prev] as [boolean, boolean, boolean]
        next[index] = false
        return next
      })
    }
  }, [])

  const handleFlawSubmit = useCallback(async (index: number) => {
    if (!flaws[index].trim()) return
    setCrackVisible((prev) => {
      const next = [...prev] as [boolean, boolean, boolean]
      next[index] = true
      return next
    })
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    } catch {
      // Haptics not available
    }
  }, [flaws])

  const handleCompromiseChange = useCallback(
    (id: string, field: 'time' | 'description', value: string) => {
      setCompromises((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        )
      )
    },
    []
  )

  const handleSaveToKit = useCallback(async () => {
    setEmergencyKitUpdated(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
  }, [])

  const handleComplete = useCallback(() => {
    setCompleted(true)
    onComplete({
      flaws: flaws.filter((f) => f.trim().length > 0),
      compromises: compromises
        .filter((c) => c.description.trim().length > 0)
        .map((c) => `${c.time}: ${c.description}`),
      emergencyKitUpdated,
    })
  }, [flaws, compromises, emergencyKitUpdated, onComplete])

  const hasContent = flaws.some((f) => f.trim().length > 0)

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🪞</Text>
          <Text style={styles.completedText}>{COMPLETION_TEXT}</Text>
        </Animated.View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {crackVisible.map((visible, i) => (
        <CrackOverlay key={i} visible={visible} index={i} />
      ))}

      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.guidanceText}>
        {GUIDANCE_TEXT}
      </Animated.Text>

      <Day16FlawInputs
        flaws={flaws}
        crackVisible={crackVisible}
        onFlawChange={handleFlawChange}
        onFlawSubmit={handleFlawSubmit}
      />

      <Day16CompromiseTimeline
        compromises={compromises}
        onCompromiseChange={handleCompromiseChange}
      />

      <Day16ComparisonCards firstFlaw={flaws[0]} />

      <Day16ActionButtons
        visible={hasContent}
        emergencyKitUpdated={emergencyKitUpdated}
        onSaveToKit={handleSaveToKit}
        onComplete={handleComplete}
      />
    </ScrollView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  completedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  completedEmoji: { fontSize: 48, marginBottom: SPACING.xl },
  completedText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day16BreakFilter
