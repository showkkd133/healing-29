// Badge gallery page — displays all 24 badges grouped by category

import { useState, useEffect, useCallback } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useBadgeStore } from '@/stores/badgeStore'
import { BADGES } from '@/constants/badges'
import type { Badge } from '@/types'
import { IconBack, IconClose, IconLock } from '@/components/icons'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme'

const CATEGORY_LABELS: Record<string, { emoji: string; text: string }> = {
  milestone: { emoji: '🏅', text: '里程碑徽章' },
  streak: { emoji: '🔥', text: '连续打卡' },
  stage: { emoji: '🎯', text: '阶段完成' },
  special: { emoji: '✨', text: '特殊成就' },
}

const CATEGORY_ORDER = ['milestone', 'streak', 'stage', 'special'] as const

// Glow shadow style for earned badges (amber/gold)
const GLOW_SHADOW = {
  shadowColor: COLORS.accent,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.35,
  shadowRadius: 8,
  elevation: 6,
}

// Animated progress bar — fills from 0 to target width on mount
// Uses a gradient-like two-tone approach (primary -> accent)
function AnimatedProgressBar({ progress }: { readonly progress: number }) {
  const width = useSharedValue(0)

  useEffect(() => {
    width.value = withDelay(300, withTiming(progress * 100, { duration: 600 }))
  }, [progress, width])

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }))

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, animatedStyle]}>
        {/* Inner gradient layer — left half primary, right half accent */}
        <View style={styles.progressGradientLeft} />
        <View style={styles.progressGradientRight} />
      </Animated.View>
    </View>
  )
}

// Detail modal for an earned badge
function BadgeDetailModal({
  badge,
  earnedDate,
  onClose,
}: {
  readonly badge: Badge | null
  readonly earnedDate: string | null
  readonly onClose: () => void
}) {
  if (!badge) return null

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalCard}>
          <Text style={styles.modalIcon}>{badge.icon}</Text>
          <Text style={styles.modalName}>{badge.name}</Text>
          <Text style={styles.modalDesc}>{badge.description}</Text>
          {earnedDate && (
            <Text style={styles.modalDate}>获得于 {earnedDate}</Text>
          )}
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="关闭"
          >
            <IconClose size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default function BadgesScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const earnedBadges = useBadgeStore((s) => s.earnedBadges)
  const earnedIds = new Set(earnedBadges.map((b) => b.badgeId))
  const earnedCount = earnedIds.size
  const totalCount = BADGES.length
  const progress = totalCount > 0 ? earnedCount / totalCount : 0

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)

  // Group badges by category (immutable — new object each render)
  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof BADGES[number][]>>(
    (acc, cat) => ({ ...acc, [cat]: BADGES.filter((b) => b.category === cat) }),
    {},
  )

  // Look up earned date for a badge
  const getEarnedDate = useCallback(
    (badgeId: string): string | null => {
      const found = earnedBadges.find((b) => b.badgeId === badgeId)
      if (!found) return null
      try {
        return new Date(found.earnedAt).toLocaleDateString('zh-CN')
      } catch {
        return found.earnedAt
      }
    },
    [earnedBadges],
  )

  // Format earned date as short MM-DD
  const getShortDate = useCallback(
    (badgeId: string): string | null => {
      const found = earnedBadges.find((b) => b.badgeId === badgeId)
      if (!found) return null
      try {
        const d = new Date(found.earnedAt)
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${month}-${day}`
      } catch {
        return null
      }
    },
    [earnedBadges],
  )

  // Running counter for staggered earned-badge animation
  let earnedIndex = 0

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="返回"
          style={styles.backButton}
        >
          <IconBack size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>徽章画廊</Text>
        <Text style={styles.headerCount}>{earnedCount}/{totalCount}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats card with animated progress bar */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.statsCard}>
          <Text style={styles.statsNumber}>{earnedCount}</Text>
          <Text style={styles.statsLabel}>已获得 {earnedCount} / {totalCount} 枚徽章</Text>
          <AnimatedProgressBar progress={progress} />
        </Animated.View>

        {/* Badge groups */}
        {CATEGORY_ORDER.map((category) => (
          <Animated.View
            key={category}
            entering={FadeIn.duration(500).delay(200)}
            style={styles.section}
          >
            {/* Category title — large emoji + text with divider */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>
                {CATEGORY_LABELS[category].emoji}
              </Text>
              <Text style={styles.sectionTitle}>
                {CATEGORY_LABELS[category].text}
              </Text>
            </View>
            <View style={styles.sectionDivider} />

            <View style={styles.grid}>
              {(grouped[category] ?? []).map((badge) => {
                const isEarned = earnedIds.has(badge.id)
                const earnedDate = getShortDate(badge.id)
                // Staggered fade-in only for earned badges
                const delay = isEarned ? earnedIndex++ * 80 : 0

                const card = (
                  <View
                    style={[
                      styles.badgeCard,
                      isEarned ? styles.badgeEarned : styles.badgeLocked,
                    ]}
                    accessibilityLabel={
                      isEarned
                        ? `${badge.name}徽章，已获得`
                        : `${badge.name}徽章，未解锁`
                    }
                  >
                    {/* Lock badge in top-left corner for locked badges */}
                    {!isEarned && (
                      <View style={styles.lockIcon}>
                        <IconLock size={12} color={COLORS.textTertiary} />
                      </View>
                    )}
                    <Text style={[styles.badgeIcon, !isEarned && styles.badgeIconLocked]}>
                      {badge.icon}
                    </Text>
                    <Text
                      style={[styles.badgeName, !isEarned && styles.badgeNameLocked]}
                      numberOfLines={1}
                    >
                      {badge.name}
                    </Text>
                    {/* Date line: show earned date or ??? for locked */}
                    <Text style={styles.badgeDesc} numberOfLines={1}>
                      {isEarned && earnedDate ? `获得于 ${earnedDate}` : '???'}
                    </Text>
                  </View>
                )

                if (isEarned) {
                  return (
                    <Animated.View
                      key={badge.id}
                      entering={FadeIn.delay(delay).duration(300)}
                      style={styles.earnedWrapper}
                    >
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setSelectedBadge(badge)}
                      >
                        {card}
                      </TouchableOpacity>
                    </Animated.View>
                  )
                }

                return (
                  <View key={badge.id} style={styles.lockedWrapper}>
                    {card}
                  </View>
                )
              })}
            </View>
          </Animated.View>
        ))}

        {/* Bottom safe area spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Badge detail modal */}
      {selectedBadge && (
        <BadgeDetailModal
          badge={selectedBadge}
          earnedDate={getEarnedDate(selectedBadge.id)}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  // Circular back button — 44x44 tap target
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    height: 56,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  headerCount: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },

  // Stats card — oversized number + gradient progress bar
  statsCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'],
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
    ...SHADOWS.md,
  },
  statsNumber: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.accent,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
  },
  statsLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  // Simulated gradient: primary on left, accent on right
  progressGradientLeft: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  progressGradientRight: {
    flex: 1,
    backgroundColor: COLORS.accent,
  },

  // Sections — increased spacing between categories
  section: { marginBottom: SPACING['3xl'] },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionEmoji: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.lg,
  },

  // Badge grid — increased gap
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },

  // Badge card wrappers (3-column layout)
  earnedWrapper: { width: '31%' },
  lockedWrapper: { width: '31%' },
  badgeCard: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    alignItems: 'center',
    position: 'relative',
  },
  // Earned: gold glow shadow + solid accent border
  badgeEarned: {
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    ...GLOW_SHADOW,
  },
  // Locked: dashed-style border (RN doesn't support dashed easily, use dotted)
  badgeLocked: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  // Lock icon — top-left corner badge
  lockIcon: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.full,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Earned emoji larger (36px), locked emoji blurred via low opacity
  badgeIcon: { fontSize: 36, marginBottom: SPACING.xs },
  badgeIconLocked: { opacity: 0.3 },
  badgeName: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
    textAlign: 'center',
  },
  badgeNameLocked: { color: COLORS.textTertiary },
  badgeDesc: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },

  // Bottom safe area
  bottomSpacer: { height: SPACING['5xl'] },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'],
    alignItems: 'center',
    width: '75%',
    ...SHADOWS.md,
  },
  modalIcon: { fontSize: 48, marginBottom: SPACING.md },
  modalName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  modalDesc: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  modalDate: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    marginBottom: SPACING.lg,
  },
  // Circular close button — 36x36, positioned top-right of modal card
  modalCloseButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
