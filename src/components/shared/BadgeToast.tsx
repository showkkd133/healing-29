// Global badge unlock toast — emoji assembles from scattered shards

import { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import Animated, {
  FadeOut,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { IconClose } from '@/components/icons'
import { useBadgeStore } from '@/stores/badgeStore'
import { BADGES } from '@/constants/badges'
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '@/constants/theme'
import type { Badge } from '@/types'

const AUTO_DISMISS_MS = 3000
const SHARD_COUNT = 5
const SHARD_SIZE = 8
const ASSEMBLE_DURATION = 400
const SHARD_STAGGER = 30
const EMOJI_REVEAL_DELAY = 450

// Pre-computed random offsets for deterministic shard positions
const SHARD_SEEDS = Array.from({ length: SHARD_COUNT }, (_, i) => ({
  x: Math.cos(i * ((2 * Math.PI) / SHARD_COUNT)) * 40,
  y: Math.sin(i * ((2 * Math.PI) / SHARD_COUNT)) * 40,
  rotate: (i * 72) % 360,
  alphaFactor: 0.4 + (i / SHARD_COUNT) * 0.5,
}))

// Extracted component so each shard can call hooks at the top level
function Shard({ seed, index, visible, badge }: { seed: typeof SHARD_SEEDS[0]; index: number; visible: boolean; badge: Badge | null }) {
  const x = useSharedValue(seed.x)
  const y = useSharedValue(seed.y)
  const rotate = useSharedValue(seed.rotate)
  const opacity = useSharedValue(1)

  useEffect(() => {
    if (!visible || !badge) return
    // Reset to starting position
    x.value = seed.x
    y.value = seed.y
    rotate.value = seed.rotate
    opacity.value = 1
    // Animate toward center with stagger
    const delay = index * SHARD_STAGGER
    x.value = withDelay(delay, withTiming(0, { duration: ASSEMBLE_DURATION }))
    y.value = withDelay(delay, withTiming(0, { duration: ASSEMBLE_DURATION }))
    rotate.value = withDelay(delay, withTiming(0, { duration: ASSEMBLE_DURATION }))
    opacity.value = withDelay(ASSEMBLE_DURATION, withTiming(0, { duration: 100 }))
  }, [visible, badge]) // eslint-disable-line react-hooks/exhaustive-deps

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        styles.shard,
        { backgroundColor: `rgba(244, 185, 66, ${seed.alphaFactor})` },
        animStyle,
      ]}
    />
  )
}

function ShardLayer({ visible, badge }: { visible: boolean; badge: Badge | null }) {
  const emojiScale = useSharedValue(0.5)
  const emojiOpacity = useSharedValue(0)

  useEffect(() => {
    if (!visible || !badge) return
    emojiScale.value = 0.5
    emojiOpacity.value = 0
    // Reveal emoji after shards converge
    emojiScale.value = withDelay(EMOJI_REVEAL_DELAY, withTiming(1, { duration: 150 }))
    emojiOpacity.value = withDelay(EMOJI_REVEAL_DELAY, withTiming(1, { duration: 150 }))
  }, [visible, badge]) // eslint-disable-line react-hooks/exhaustive-deps

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
    opacity: emojiOpacity.value,
  }))

  return (
    <View style={styles.iconContainer}>
      {SHARD_SEEDS.map((seed, i) => (
        <Shard key={i} seed={seed} index={i} visible={visible} badge={badge} />
      ))}
      <Animated.Text style={[styles.icon, emojiStyle]}>
        {badge?.icon}
      </Animated.Text>
    </View>
  )
}

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
        <ShardLayer visible={visible} badge={badge} />

        <View style={styles.content}>
          <Text style={styles.label}>获得新徽章</Text>
          <Text style={styles.name}>{badge.name}</Text>
        </View>

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
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shard: {
    position: 'absolute',
    width: SHARD_SIZE,
    height: SHARD_SIZE,
    borderRadius: 2,
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
