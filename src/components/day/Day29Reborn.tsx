import React, { useCallback, useState } from 'react'
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import type { ResumeSections, Day29Phase } from './Day29Types'
import { RESUME_SECTIONS } from './Day29Types'
import Day29Completed from './Day29Completed'
import Day29Review from './Day29Review'
import Day29ResumePreview from './Day29ResumePreview'
import Day29StyleSelection from './Day29StyleSelection'
import Day29ResumeInput from './Day29ResumeInput'

// ─── Props ────────────────────────────────────────────────────────

interface Day29RebornProps {
  readonly onComplete: (data: {
    readonly sections: {
      readonly identity: ReadonlyArray<string>
      readonly likes: ReadonlyArray<string>
      readonly experiences: ReadonlyArray<string>
      readonly possibilities: ReadonlyArray<string>
    }
    readonly style: string
    readonly day1Played: boolean
  }) => void
}

// ─── Main component ───────────────────────────────────────────────

const Day29Reborn = React.memo(function Day29Reborn({
  onComplete,
}: Day29RebornProps) {
  const [sections, setSections] = useState<ResumeSections>({
    identity: [],
    likes: [],
    experiences: [],
    possibilities: [],
  })
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [phase, setPhase] = useState<Day29Phase>('input')
  const [day1Played, setDay1Played] = useState(false)
  const [completed, setCompleted] = useState(false)

  // ─── Handlers ─────────────────────────────────────────────────

  const handleAddTag = useCallback((sectionId: string, tag: string) => {
    setSections((prev) => ({
      ...prev,
      [sectionId]: [...prev[sectionId as keyof ResumeSections], tag],
    }))
  }, [])

  const handleRemoveTag = useCallback((sectionId: string, index: number) => {
    setSections((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId as keyof ResumeSections].filter((_, i) => i !== index),
    }))
  }, [])

  const handleNextSection = useCallback(async () => {
    if (currentSectionIndex < RESUME_SECTIONS.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1)
    } else {
      setPhase('style')
    }
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [currentSectionIndex])

  const handleSelectStyle = useCallback(async (styleId: string) => {
    setSelectedStyle(styleId)
    setPhase('preview')
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleToReview = useCallback(async () => {
    setPhase('review')
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handlePlayDay1 = useCallback(async () => {
    setDay1Played(true)
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      // Haptics not available
    }
    // In a real app, this would play the Day 1 recording
  }, [])

  const handleSkipDay1 = useCallback(() => {
    setDay1Played(false)
  }, [])

  const handleComplete = useCallback(async (_nextAction: string) => {
    setCompleted(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
    onComplete({
      sections: {
        identity: [...sections.identity],
        likes: [...sections.likes],
        experiences: [...sections.experiences],
        possibilities: [...sections.possibilities],
      },
      style: selectedStyle ?? 'minimal',
      day1Played,
    })
  }, [sections, selectedStyle, day1Played, onComplete])

  // ─── Render by phase ──────────────────────────────────────────

  if (completed) {
    return <Day29Completed />
  }

  if (phase === 'review') {
    return (
      <Day29Review
        day1Played={day1Played}
        onPlayDay1={handlePlayDay1}
        onSkipDay1={handleSkipDay1}
        onComplete={handleComplete}
      />
    )
  }

  if (phase === 'preview') {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Day29ResumePreview sections={sections} style={selectedStyle ?? 'minimal'} />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleToReview}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>查看回顾礼包</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  if (phase === 'style') {
    return <Day29StyleSelection onSelectStyle={handleSelectStyle} />
  }

  return (
    <Day29ResumeInput
      sections={sections}
      currentSectionIndex={currentSectionIndex}
      onAddTag={handleAddTag}
      onRemoveTag={handleRemoveTag}
      onNextSection={handleNextSection}
    />
  )
})

// ─── Styles ───────────────────────────────────────────────────────

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
  primaryButton: {
    marginTop: SPACING['3xl'],
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day29Reborn
