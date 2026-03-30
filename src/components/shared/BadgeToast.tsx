// Global badge unlock toast — refined card that slides in from top

import { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import Animated, {
  FadeOut,
  SlideInUp,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { useBadgeStore } from '@/stores/badgeStore'
import { BADGES } from '@/constants/badges'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme'
import type { Badge } from '@/types'

const AUTO_DISMISS_MS = 3000
const ACCENT = COLORS.accent
const ACCENT_BG = 'rgba(244,185,66,0.12)' // subtle amber tint for icon circle

export default function BadgeToast() {
  const insets = useSafeAreaInsets()
  const [visible, setVisible] = useState(false)
  const [badge, setBadge] = useState<Badge | null>(null)
  const prevCountRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const earnedBadges = useBadgeStore((s) => s.earnedBadges)

  // Shimmer / glow pulse animation
  const shimmer = useSharedValue(0)
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + shimmer.value * 0.35,
  }))

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

        // Start shimmer pulse
        shimmer.value = 0
        shimmer.value = withDelay(
          200,
          withRepeat(withTiming(1, { duration: 900 }), 3, true),
        )

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setVisible(false), AUTO_DISMISS_MS)
      }
    }
    prevCountRef.current = earnedBadges.length
  }, [earnedBadges, shimmer])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!visible || !badge) return null

  return (
    <Animated.View
      entering={SlideInUp.springify().damping(18)}
      exiting={FadeOut.duration(200).withInitialValues({ transform: [{ translateY: 0 }] })}
      style={[styles.wrapper, { top: insets.top + SPACING.sm }]}
      pointerEvents="box-none"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Pressable onPress={dismiss} style={styles.card}>
        {/* Left accent bar */}
        <View style={styles.accentBar} />

        {/* Shimmer overlay */}
        <Animated.View style={[styles.shimmer, shimmerStyle]} pointerEvents="none" />

        {/* Icon in circular background */}
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>{badge.icon}</Text>
        </View>

        {/* Text content */}
        <View style={styles.content}>
          <Text style={styles.label}>解锁新徽章</Text>
          <Text style={styles.title}>{badge.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {badge.description}
          </Text>
        </View>

        {/* Close button */}
        <Pressable
          onPress={dismiss}
          style={styles.closeBtn}
          hitSlop={8}
          accessibilityLabel="关闭"
        >
          <Text style={styles.closeIcon}>×</Text>
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
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    paddingLeft: SPACING.lg + 4, // room for accent bar
    gap: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.xl,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: ACCENT,
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderBottomLeftRadius: BORDER_RADIUS['2xl'],
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ACCENT,
    opacity: 0,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: ACCENT_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 40,
    lineHeight: 48,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: ACCENT,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    marginBottom: SPACING['2xs'],
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
  closeBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.md,
  },
  closeIcon: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textTertiary,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    lineHeight: TYPOGRAPHY.lineHeight.lg,
  },
})
