import React, { useCallback, useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '@/constants/theme'
import { GUIDANCE_TEXT, TABS, TOTAL_SLOTS } from './Day7Constants'
import type { Day7SelfHuntProps } from './Day7Constants'
import Day7CompletedView from './Day7CompletedView'
import Day7PosterView from './Day7PosterView'
import Day7AppreciationSlots from './Day7AppreciationSlots'
import Day7InspirationPanel from './Day7InspirationPanel'
import { ZenButton } from '../ui/ZenButton'
import { ZenTypography } from '../ui/ZenTypography'
import { useHaptic } from '@/hooks/useHaptic'

// ─── Main component ────────────────────────────────────────────────

const Day7SelfHunt = React.memo(function Day7SelfHunt({
  onComplete,
}: Day7SelfHuntProps) {
  const haptic = useHaptic();
  const [activeTab, setActiveTab] = useState<string>('appearance')
  const [appreciations, setAppreciations] = useState<readonly string[]>([])
  const [categories, setCategories] = useState<readonly string[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [showPoster, setShowPoster] = useState(false)
  const [completed, setCompleted] = useState(false)

  const allFilled = appreciations.length >= TOTAL_SLOTS

  // ─── Tab switch ─────────────────────────────────────────────────

  const handleTabSwitch = (key: string) => {
    haptic.light();
    setActiveTab(key);
  };

  // ─── Submit one appreciation ─────────────────────────────────────

  const submitAppreciation = useCallback((text: string) => {
    if (!text.trim() || allFilled) return

    setAppreciations((prev) => [...prev, text.trim()])
    setCategories((prev) => [...prev, activeTab])
    setCurrentInput('')
    haptic.medium();
  }, [activeTab, allFilled, haptic])

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

  const handleShowPoster = useCallback(() => {
    haptic.success();
    setShowPoster(true);
  }, [haptic])

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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Guidance */}
      <Animated.View entering={FadeIn.delay(300).duration(600)}>
        <ZenTypography variant="medium" size="lg" color="text" align="center" style={styles.guidanceText}>
          {GUIDANCE_TEXT}
        </ZenTypography>
      </Animated.View>

      {/* Category tabs */}
      <Animated.View entering={FadeIn.delay(500).duration(400)} style={styles.tabRow}>
        {TABS.map((tab) => (
          <View key={tab.key} style={styles.tabWrapper}>
            <ZenButton
              title={tab.label}
              variant={activeTab === tab.key ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => handleTabSwitch(tab.key)}
              style={activeTab === tab.key ? SHADOWS.sm : undefined}
            />
          </View>
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
          <ZenTypography variant="bold" size="sm" color="primary" style={styles.generateHint}>
            3个优点已收集完毕！
          </ZenTypography>
          <ZenButton
            title="生成优点海报"
            variant="hero"
            size="md"
            onPress={handleShowPoster}
            style={styles.primaryButton}
          />
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
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING['6xl'],
  },
  guidanceText: {
    lineHeight: 32,
    marginBottom: SPACING['3xl'],
  },
  tabRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: COLORS.borderLight,
    borderRadius: 32,
    padding: 4,
    marginBottom: SPACING['2xl'],
    gap: 4,
  },
  tabWrapper: {
    minWidth: 80,
  },
  generateSection: {
    alignItems: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.xl,
  },
  generateHint: {
    letterSpacing: 1,
  },
  primaryButton: {
    minWidth: 200,
  },
})

export default Day7SelfHunt
