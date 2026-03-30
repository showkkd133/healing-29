import React, { useCallback, useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING } from '@/constants/theme'
import { EXPERIMENTS, COMPLETION_TEXT, COURAGE_POINTS } from './Day20Constants'
import Day20ExperimentSelector from './Day20ExperimentSelector'
import Day20TaskExecutionForm from './Day20TaskExecutionForm'
import Day20FeedbackSection from './Day20FeedbackSection'

// ─── Props ─────────────────────────────────────────────────────────

interface Day20CourageExperimentProps {
  readonly onComplete: (data: {
    readonly experimentType: string
    readonly couragePoints: number
    readonly comfortLevel: number
  }) => void
}

// ─── Main component ────────────────────────────────────────────────

const Day20CourageExperiment = React.memo(function Day20CourageExperiment({
  onComplete,
}: Day20CourageExperimentProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [executionNote, setExecutionNote] = useState('')
  const [feelingNote, setFeelingNote] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [comfortLevel, setComfortLevel] = useState(0)
  const [completed, setCompleted] = useState(false)

  // ─── Select experiment ──────────────────────────────────────────

  const handleSelect = useCallback(async (type: string) => {
    setSelectedType(type)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  // ─── Submit execution ───────────────────────────────────────────

  const handleSubmitExecution = useCallback(async () => {
    if (!executionNote.trim() || !feelingNote.trim()) return
    setShowFeedback(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
  }, [executionNote, feelingNote])

  // ─── Complete ────────────────────────────────────────────────────

  const handleComplete = useCallback(() => {
    if (!selectedType || comfortLevel === 0) return
    setCompleted(true)
    onComplete({
      experimentType: selectedType,
      couragePoints: COURAGE_POINTS,
      comfortLevel,
    })
  }, [selectedType, comfortLevel, onComplete])

  const selectedExperiment = EXPERIMENTS.find((e) => e.type === selectedType)

  // ─── Render: completed state ─────────────────────────────────────

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>{'\u{1F981}'}</Text>
          <Text style={styles.completedText}>{COMPLETION_TEXT}</Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: main ────────────────────────────────────────────────

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Experiment selection */}
      {!selectedType && (
        <Day20ExperimentSelector onSelect={handleSelect} />
      )}

      {/* Task details & execution */}
      {selectedType && !showFeedback && selectedExperiment && (
        <Day20TaskExecutionForm
          experiment={selectedExperiment}
          executionNote={executionNote}
          feelingNote={feelingNote}
          onExecutionNoteChange={setExecutionNote}
          onFeelingNoteChange={setFeelingNote}
          onSubmit={handleSubmitExecution}
        />
      )}

      {/* Feedback */}
      {showFeedback && (
        <Day20FeedbackSection
          comfortLevel={comfortLevel}
          onComfortChange={setComfortLevel}
          onComplete={handleComplete}
        />
      )}
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

export default Day20CourageExperiment
