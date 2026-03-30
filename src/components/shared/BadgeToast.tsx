// Global badge unlock toast — slides in from top when a new badge is earned

import { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { useBadgeStore } from '@/stores/badgeStore'
import { BADGES } from '@/constants/badges'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme'
import type { Badge } from '@/types'

const AUTO_DISMISS_MS = 3000
const ACCENT_BORDER = COLORS.accent // #F4B942 amber yellow

export default function BadgeToast() {
  const insets = useSafeAreaInsets()
  const [visible, setVisible] = useState(false)
  const [badge, setBadge] = useState<Badge | null>(null)
  const prevCountRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const earnedBadges = useBadgeStore((s) => s.earnedBadges)

  // Sync initial count on mount without triggering toast
  useEffect(() => {
    prevCountRef.current = earnedBadges.length
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const dismiss = useCallback(() => {
    setVisible(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (earnedBadges.length > prevCountRef.current) {
      const latest = earnedBadges[earnedBadges.length - 1]
      const badgeInfo = BADGES.find((b) => b.id === latest.badgeId)

      if (badgeInfo) {
        setBadge(badgeInfo)
        setVisible(true)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setVisible(false), AUTO_DISMISS_MS)
      }
    }
    prevCountRef.current = earnedBadges.length
  }, [earnedBadges])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!visible || !badge) return null

  return (
    <Animated.View
      entering={SlideInUp.springify().damping(18)}
      exiting={SlideOutUp.duration(250)}
      style={[styles.wrapper, { top: insets.top + SPACING.sm }]}
      pointerEvents="box-none"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Pressable onPress={dismiss} style={styles.card}>
        <Text style={styles.icon}>{badge.icon}</Text>
        <View style={styles.content}>
          <Text style={styles.title}>🎉 {badge.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {badge.description}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 9999,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 2,
    borderColor: ACCENT_BORDER,
    padding: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS.lg,
  },
  icon: {
    fontSize: 36,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING['2xs'],
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
  },
})
