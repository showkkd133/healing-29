// Day 12 – Kindness Experiment main component
// Sub-components: Day12TargetSelector, Day12MethodSelector,
//   Day12ReactionSection, Day12KindnessEcho, Day12BottomSection

import React, { useCallback, useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING } from '@/constants/theme'
import Day12TargetSelector from './Day12TargetSelector'
import Day12MethodSelector from './Day12MethodSelector'
import Day12ReactionSection from './Day12ReactionSection'
import Day12KindnessEcho from './Day12KindnessEcho'
import Day12BottomSection from './Day12BottomSection'

// ─── Props ─────────────────────────────────────────────────────────

interface Day12KindnessExperimentProps {
  readonly onComplete: (data: {
    readonly target: string
    readonly method: string
    readonly reaction: string
    readonly storyShared: boolean
  }) => void
}

// ─── Main component ────────────────────────────────────────────────

const Day12KindnessExperiment = React.memo(function Day12KindnessExperiment({
  onComplete,
}: Day12KindnessExperimentProps) {
  const [showIntrovert, setShowIntrovert] = useState(false)
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [reactionDescription, setReactionDescription] = useState('')
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null)
  const [storyShared, setStoryShared] = useState(false)
  const [showEcho, setShowEcho] = useState(false)
  const [completed, setCompleted] = useState(false)

  const canComplete =
    selectedTarget !== null && selectedMethod !== null && selectedReaction !== null

  const handleToggleIntrovert = useCallback(() => {
    setShowIntrovert((prev) => !prev)
  }, [])

  const handleSelectTarget = useCallback(async (id: string) => {
    setSelectedTarget(id)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleSelectMethod = useCallback(async (id: string) => {
    setSelectedMethod(id)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleSelectReaction = useCallback(async (id: string) => {
    setSelectedReaction(id)
    setShowEcho(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
  }, [])

  const handleComplete = useCallback(() => {
    if (!canComplete || !selectedTarget || !selectedMethod || !selectedReaction) return
    setCompleted(true)
    onComplete({
      target: selectedTarget,
      method: selectedMethod,
      reaction: selectedReaction,
      storyShared,
    })
  }, [canComplete, selectedTarget, selectedMethod, selectedReaction, storyShared, onComplete])

  // ─── Render: completed ────────────────────────────────────────

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🤝</Text>
          <Text style={styles.completedText}>连接不需要深刻，瞬间就够了</Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: main ─────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Day12TargetSelector
          showIntrovert={showIntrovert}
          selectedTarget={selectedTarget}
          onToggleIntrovert={handleToggleIntrovert}
          onSelectTarget={handleSelectTarget}
        />

        {selectedTarget && (
          <Day12MethodSelector
            selectedMethod={selectedMethod}
            onSelectMethod={handleSelectMethod}
          />
        )}

        {selectedMethod && (
          <Day12ReactionSection
            reactionDescription={reactionDescription}
            selectedReaction={selectedReaction}
            onChangeDescription={setReactionDescription}
            onSelectReaction={handleSelectReaction}
          />
        )}

        <Day12KindnessEcho visible={showEcho} />

        {showEcho && (
          <Day12BottomSection
            storyShared={storyShared}
            canComplete={canComplete}
            onToggleShare={setStoryShared}
            onComplete={handleComplete}
          />
        )}
      </ScrollView>
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
  scrollContent: {
    paddingBottom: SPACING['5xl'],
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

export default Day12KindnessExperiment
