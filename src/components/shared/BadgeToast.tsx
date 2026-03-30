// Global badge unlock toast — emoji assembles from scattered shards

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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

function ShardLayer({ visible, badge }: { visible: boolean; badge: Badge | null }) {
  const shards = useMemo(
    () =>
      SHARD_SEEDS.map((seed) => ({
        x: useSharedValue(seed.x),
        y: useSharedValue(seed.y),
        rotate: useSharedValue(seed.rotate),
        opacity: useSharedValue(1),
      })),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const emojiScale = useSharedValue(0.5)
  const emojiOpacity = useSharedValue(0)

  // Trigger assembly animation when toast becomes visible
  useEffect(() => {
    if (!visible || !badge) return

    // Reset all shards to starting positions
    shards.forEach((shard, i) => {
      shard.x.value = SHARD_SEEDS[i].x
      shard.y.value = SHARD_SEEDS[i].y
      shard.rotate.value = SHARD_SEEDS[i].rotate
      shard.opacity.value = 1
    })
    emojiScale.value = 0.5
    emojiOpacity.value = 0

    // Animate shards toward center with stagger
    shards.forEach((shard, i) => {
      const delay = i * SHARD_STAGGER
      shard.x.value = withDelay(delay, withTiming(0, { duration: ASSEMBLE_DURATION }))
      shard.y.value = withDelay(delay, withTiming(0, { duration: ASSEMBLE_DURATION }))
      shard.rotate.value = withDelay(delay, withTiming(0, { duration: ASSEMBLE_DURATION }))
      shard.opacity.value = withDelay(ASSEMBLE_DURATION, withTiming(0, { duration: 100 }))
    })

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
      {shards.map((shard, i) => {
        const animStyle = useAnimatedStyle(() => ({
          transform: [
            { translateX: shard.x.value },
            { translateY: shard.y.value },
            { rotate: `${shard.rotate.value}deg` },
          ],
          opacity: shard.opacity.value,
        }))

        return (
          <Animated.View
            key={i}
            style={[
              styles.shard,
              { backgroundColor: `rgba(244, 185, 66, ${SHARD_SEEDS[i].alphaFactor})` },
              animStyle,
            ]}
          />
        )
      })}
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
