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
import { Ionicons } from '@expo/vector-icons'
import { useBadgeStore } from '@/stores/badgeStore'
import { BADGES } from '@/constants/badges'
import type { Badge } from '@/types'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme'

const CATEGORY_LABELS: Record<string, string> = {
  milestone: '🏅 里程碑徽章',
  streak: '🔥 连续打卡',
  stage: '🎯 阶段完成',
  special: '✨ 特殊成就',
}

const CATEGORY_ORDER = ['milestone', 'streak', 'stage', 'special'] as const

// Animated progress bar — fills from 0 to target width on mount
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
      <Animated.View style={[styles.progressFill, animatedStyle]} />
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
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>关闭</Text>
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
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
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
            <Text style={styles.sectionTitle}>{CATEGORY_LABELS[category]}</Text>
            <View style={styles.grid}>
              {(grouped[category] ?? []).map((badge) => {
                const isEarned = earnedIds.has(badge.id)
                const earnedDate = getEarnedDate(badge.id)
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
                    {!isEarned && (
                      <View style={styles.lockIcon}>
                        <Ionicons name="lock-closed" size={12} color={COLORS.textTertiary} />
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
                    <Text style={styles.badgeDesc} numberOfLines={1}>
                      {isEarned ? earnedDate : '???'}
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
    paddingBottom: SPACING['4xl'],
  },
  // Stats card
  statsCard: {
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'], alignItems: 'center',
    marginBottom: SPACING['2xl'], ...SHADOWS.md,
  },
  statsNumber: { fontSize: TYPOGRAPHY.fontSize['4xl'], fontWeight: TYPOGRAPHY.fontWeight.bold, color: COLORS.accent },
  statsLabel: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, marginTop: SPACING.xs, marginBottom: SPACING.md },
  progressTrack: { width: '100%', height: 6, backgroundColor: COLORS.border, borderRadius: BORDER_RADIUS.full, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: BORDER_RADIUS.full },
  // Sections
  section: { marginBottom: SPACING['2xl'] },
  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.base, fontWeight: TYPOGRAPHY.fontWeight.semibold, color: COLORS.text, marginBottom: SPACING.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  // Badge card wrappers (3-column layout)
  earnedWrapper: { width: '31%' },
  lockedWrapper: { width: '31%' },
  badgeCard: {
    width: '100%', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md, alignItems: 'center', borderWidth: 1.5, position: 'relative',
  },
  badgeEarned: { borderColor: COLORS.accent, ...SHADOWS.sm },
  badgeLocked: { borderColor: COLORS.border, opacity: 0.5 },
  lockIcon: { position: 'absolute', top: SPACING.xs, right: SPACING.xs },
  badgeIcon: { fontSize: 32, marginBottom: SPACING.xs },
  badgeIconLocked: { opacity: 0.5 },
  badgeName: { fontSize: TYPOGRAPHY.fontSize.xs, fontWeight: TYPOGRAPHY.fontWeight.medium, color: COLORS.text, textAlign: 'center' },
  badgeNameLocked: { color: COLORS.textTertiary },
  badgeDesc: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.45)', justifyContent: 'center', alignItems: 'center' },
  modalCard: {
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'], alignItems: 'center', width: '75%', ...SHADOWS.md,
  },
  modalIcon: { fontSize: 48, marginBottom: SPACING.md },
  modalName: { fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: TYPOGRAPHY.fontWeight.bold, color: COLORS.text, marginBottom: SPACING.xs },
  modalDesc: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.sm },
  modalDate: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textTertiary, marginBottom: SPACING.lg },
  modalClose: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING['2xl'], backgroundColor: COLORS.accent, borderRadius: BORDER_RADIUS.lg },
  modalCloseText: { fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: TYPOGRAPHY.fontWeight.semibold, color: '#FFFFFF' },
})
