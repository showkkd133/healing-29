// Day 7 — Self Hunt: find 3 things you appreciate about yourself

import React, { useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { GUIDANCE_TEXT, TABS, TOTAL_SLOTS } from './Day7Constants'
import type { Day7SelfHuntProps } from './Day7Constants'
import Day7CompletedView from './Day7CompletedView'
import Day7PosterView from './Day7PosterView'
import Day7AppreciationSlots from './Day7AppreciationSlots'
import Day7InspirationPanel from './Day7InspirationPanel'

// ─── Main component ────────────────────────────────────────────────

const Day7SelfHunt = React.memo(function Day7SelfHunt({
  onComplete,
}: Day7SelfHuntProps) {
  const [activeTab, setActiveTab] = useState<string>('appearance')
  const [appreciations, setAppreciations] = useState<readonly string[]>([])
  const [categories, setCategories] = useState<readonly string[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [showPoster, setShowPoster] = useState(false)
  const [completed, setCompleted] = useState(false)

  const allFilled = appreciations.length >= TOTAL_SLOTS

  // ─── Tab switch ─────────────────────────────────────────────────

  const handleTabSwitch = useCallback(async (key: string) => {
    setActiveTab(key)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  // ─── Submit one appreciation ─────────────────────────────────────

  const submitAppreciation = useCallback(async (text: string) => {
    if (!text.trim() || allFilled) return

    setAppreciations((prev) => [...prev, text.trim()])
    setCategories((prev) => [...prev, activeTab])
    setCurrentInput('')

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      // Haptics not available
    }
  }, [activeTab, allFilled])

  const handleInputSubmit = useCallback(() => {
    submitAppreciation(currentInput)
  }, [currentInput, submitAppreciation])

  // ─── Inspiration tag tap ────────────────────────────────────────

  const handleTagTap = useCallback((tag: string) => {
    if (allFilled) return
    setCurrentInput(tag)
    submitAppreciation(tag)
  }, [allFilled, submitAppreciation])

  // ─── Show poster ────────────────────────────────────────────────

  const handleShowPoster = useCallback(async () => {
    setShowPoster(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
  }, [])

  // ─── Complete ────────────────────────────────────────────────────

  const handleComplete = useCallback(() => {
    setCompleted(true)
    onComplete({
      appreciations: [...appreciations],
      category: [...categories],
    })
  }, [appreciations, categories, onComplete])

  // ─── Render: completed state ─────────────────────────────────────

  if (completed) {
    return <Day7CompletedView />
  }

  // ─── Render: poster preview ──────────────────────────────────────

  if (showPoster) {
    return (
      <Day7PosterView
        appreciations={appreciations}
        onComplete={handleComplete}
      />
    )
  }

  // ─── Render: main ────────────────────────────────────────────────

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Guidance */}
      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.guidanceText}>
        {GUIDANCE_TEXT}
      </Animated.Text>

      {/* Category tabs */}
      <Animated.View entering={FadeIn.delay(500).duration(400)} style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => handleTabSwitch(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Appreciation slots */}
      <Animated.View entering={FadeInDown.delay(700).duration(400)}>
        <Day7AppreciationSlots
          appreciations={appreciations}
          currentInput={currentInput}
          onChangeInput={setCurrentInput}
          onSubmit={handleInputSubmit}
        />
      </Animated.View>

      {/* Inspiration panel */}
      {!allFilled && (
        <Animated.View entering={FadeIn.delay(900).duration(400)}>
          <Day7InspirationPanel activeTab={activeTab} onTagTap={handleTagTap} />
        </Animated.View>
      )}

      {/* Generate poster button */}
      {allFilled && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.generateSection}>
          <Text style={styles.generateHint}>3个优点已收集完毕！</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleShowPoster}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>生成优点海报</Text>
          </TouchableOpacity>
        </Animated.View>
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
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
  tabRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.xl,
    padding: 3,
    marginBottom: SPACING['2xl'],
  },
  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  tabActive: {
    backgroundColor: COLORS.card,
    ...SHADOWS.sm,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.text,
  },
  generateSection: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  generateHint: {
    fontSize: 15,
    color: COLORS.success,
    fontWeight: '500',
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day7SelfHunt
