import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING } from '@/constants/theme'
import type { Day28FarewellProps, FarewellPhase } from './Day28FarewellConstants'
import { DEFAULT_FAREWELL, COMPLETION_TEXT } from './Day28FarewellConstants'
import Day28ReleaseAnimation from './Day28ReleaseAnimation'
import Day28MoodSelector from './Day28MoodSelector'
import Day28FarewellCertificate from './Day28FarewellCertificate'
import Day28FarewellInputForm from './Day28FarewellInputForm'

// ─── Main component ────────────────────────────────────────────────

const Day28Farewell = React.memo(function Day28Farewell({
  onComplete,
}: Day28FarewellProps) {
  const [method, setMethod] = useState<string | null>(null)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [itemDesc, setItemDesc] = useState('')
  const [farewellWords, setFarewellWords] = useState(DEFAULT_FAREWELL)
  const [phase, setPhase] = useState<FarewellPhase>('input')
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  const canRelease = method === 'virtual'
    ? selectedElement !== null && itemDesc.trim().length > 0
    : itemDesc.trim().length > 0

  const handleRelease = useCallback(async () => {
    if (!canRelease) return
    if (method === 'virtual') {
      setPhase('release')
    } else {
      // Reality mode skips animation
      setPhase('mood')
    }
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    } catch {
      // Haptics not available
    }
  }, [canRelease, method])

  const handleReleaseFinish = useCallback(() => {
    setPhase('mood')
  }, [])

  const handleSelectMood = useCallback((moodId: string) => {
    setSelectedMood(moodId)
    setPhase('certificate')
  }, [])

  const handleComplete = useCallback(async () => {
    setCompleted(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
    onComplete({
      method: method ?? '',
      ...(method === 'virtual' && selectedElement ? { element: selectedElement } : {}),
      item: itemDesc.trim(),
      farewellWords: farewellWords.trim(),
      mood: selectedMood ?? '',
    })
  }, [method, selectedElement, itemDesc, farewellWords, selectedMood, onComplete])

  // ─── Render: completed state ──────────────────────────────────

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🕊️</Text>
          <Text style={styles.completedText}>{COMPLETION_TEXT}</Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: certificate ──────────────────────────────────────

  if (phase === 'certificate') {
    return (
      <View style={styles.container}>
        <Day28FarewellCertificate
          method={method ?? ''}
          selectedElement={selectedElement}
          itemDesc={itemDesc}
          farewellWords={farewellWords}
          onComplete={handleComplete}
        />
      </View>
    )
  }

  // ─── Render: mood ─────────────────────────────────────────────

  if (phase === 'mood') {
    return (
      <View style={styles.container}>
        <Day28MoodSelector onSelectMood={handleSelectMood} />
      </View>
    )
  }

  // ─── Render: release animation ────────────────────────────────

  if (phase === 'release') {
    return (
      <View style={styles.container}>
        <Day28ReleaseAnimation
          element={selectedElement ?? 'water'}
          onFinish={handleReleaseFinish}
        />
      </View>
    )
  }

  // ─── Render: main input ───────────────────────────────────────

  return (
    <View style={styles.container}>
      <Day28FarewellInputForm
        method={method}
        selectedElement={selectedElement}
        itemDesc={itemDesc}
        farewellWords={farewellWords}
        onMethodChange={setMethod}
        onElementChange={setSelectedElement}
        onItemDescChange={setItemDesc}
        onFarewellWordsChange={setFarewellWords}
        onRelease={handleRelease}
        canRelease={canRelease}
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

export default Day28Farewell
