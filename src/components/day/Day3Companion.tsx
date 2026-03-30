import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import type { Day3Data } from '@/types'
import { ZenButton } from '../ui/ZenButton'
import { BADGE_NAME } from './Day3Constants'
import type { CompanionMode } from './Day3Constants'
import Day3ModeSelector from './Day3ModeSelector'
import Day3MessagePanel from './Day3MessagePanel'
import Day3PresencePanel from './Day3PresencePanel'

// ─── Props ─────────────────────────────────────────────────────────

interface Day3CompanionProps {
  readonly onComplete: (data: Day3Data & { readonly badge: string }) => void
}

// ─── Main component ────────────────────────────────────────────────

const Day3Companion = React.memo(function Day3Companion({
  onComplete,
}: Day3CompanionProps) {
  const [mode, setMode] = useState<CompanionMode | null>(null)
  const [taskDone, setTaskDone] = useState(false)
  const [badgeShown, setBadgeShown] = useState(false)

  // Lifted from MessagePanel so switching modes preserves user input
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [customText, setCustomText] = useState('')

  const handleDone = useCallback(() => {
    setTaskDone(true)
  }, [])

  const handleBadgeClaim = useCallback(() => {
    setBadgeShown(true)
    if (mode) {
      onComplete({
        type: 'day3',
        companionMode: mode,
        messageSent: mode === 'message',
        badge: BADGE_NAME,
      })
    }
  }, [mode, onComplete])

  // ─── Render: badge claimed ────────────────────────────────────

  if (badgeShown) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.badgeContainer}>
          <Feather name="award" size={64} color={COLORS.accent} style={styles.badgeIcon} />
          <Text style={styles.badgeTitle}>解锁徽章</Text>
          <Text style={styles.badgeName}>{BADGE_NAME}</Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: task done, show badge unlock ─────────────────────

  if (taskDone) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.badgeContainer}>
          <ZenButton
            onPress={handleBadgeClaim}
            variant="hero"
            style={styles.badgeClaimButton}
          >
            <View style={styles.badgeClaimContent}>
              <Feather name="award" size={48} color={COLORS.white} style={styles.badgeClaimIcon} />
              <Text style={styles.badgeClaimText}>领取 "{BADGE_NAME}" 徽章</Text>
            </View>
          </ZenButton>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: main ─────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Guidance */}
      <Animated.Text entering={FadeIn.delay(200).duration(600)} style={styles.guidanceText}>
        今天不用一个人扛
      </Animated.Text>

      {/* Mode selection */}
      <Day3ModeSelector selected={mode} onSelect={setMode} />

      {/* Expanded panel */}
      {mode === 'message' && (
        <Day3MessagePanel
          onDone={handleDone}
          selectedId={selectedId}
          onSelectedIdChange={setSelectedId}
          customText={customText}
          onCustomTextChange={setCustomText}
        />
      )}
      {mode === 'presence' && <Day3PresencePanel onDone={handleDone} />}
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

  // Guidance
  guidanceText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
  },

  // Badge
  badgeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    marginBottom: SPACING.xl,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  badgeName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  badgeClaimButton: {
    paddingVertical: SPACING['3xl'],
    paddingHorizontal: SPACING['4xl'],
    height: 'auto',
  },
  badgeClaimContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeClaimIcon: {
    marginBottom: SPACING.lg,
  },
  badgeClaimText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
})

export default Day3Companion
