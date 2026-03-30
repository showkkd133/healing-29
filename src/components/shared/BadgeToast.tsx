// Global badge unlock toast — minimal card that slides in from top

import { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import Animated, { FadeOut, SlideInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { IconClose } from '@/components/icons'
import { useBadgeStore } from '@/stores/badgeStore'
import { BADGES } from '@/constants/badges'
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '@/constants/theme'
import type { Badge } from '@/types'

const AUTO_DISMISS_MS = 3000

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
      entering={SlideInUp.duration(200)}
      exiting={FadeOut.duration(200)}
      style={[styles.wrapper, { top: insets.top + SPACING.sm }]}
      pointerEvents="box-none"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Pressable onPress={dismiss} style={styles.card}>
        {/* Emoji icon */}
        <Text style={styles.icon}>{badge.icon}</Text>

        {/* Text content */}
        <View style={styles.content}>
          <Text style={styles.label}>获得新徽章</Text>
          <Text style={styles.name}>{badge.name}</Text>
        </View>

        {/* Close button */}
        <Pressable
          onPress={dismiss}
          style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
          hitSlop={8}
          accessibilityLabel="关闭"
        >
          <IconClose size={14} color={COLORS.textTertiary} />
        </Pressable>
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
    borderRadius: 16,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.md,
  },
  icon: {
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING['2xs'],
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  closeBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    opacity: 0.5,
  },
})
