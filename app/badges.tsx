// Minimal badge gallery — flat grid, no categories

import { useState, useMemo } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useBadgeStore } from '@/stores/badgeStore'
import { BADGES } from '@/constants/badges'
import type { Badge } from '@/types'
import { IconBack, IconClose } from '@/components/icons'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/constants/theme'

function BadgeIcon({ badge, size, color }: { badge: Badge; size: number; color: string }) {
  if (badge.iconProvider === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={badge.icon as any} size={size} color={color} />
  }
  return <Feather name={badge.icon as any} size={size} color={color} />
}

// Detail modal — white card with emoji, name, description
function BadgeDetailModal({
  badge,
  onClose,
}: {
  readonly badge: Badge | null
  readonly onClose: () => void
}) {
  if (!badge) return null

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalCard}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={onClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="关闭"
          >
            <IconClose size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <View style={styles.modalIconWrap}>
            <BadgeIcon badge={badge} size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.modalName}>{badge.name}</Text>
          <Text style={styles.modalDesc}>{badge.description}</Text>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default function BadgesScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const earnedBadges = useBadgeStore((s) => s.earnedBadges)
  const earnedIds = useMemo(
    () => new Set(earnedBadges.map((b) => b.badgeId)),
    [earnedBadges],
  )

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)

  // Sort: earned first, then locked
  const sortedBadges = useMemo(
    () => [...BADGES].sort((a, b) => (earnedIds.has(a.id) ? 0 : 1) - (earnedIds.has(b.id) ? 0 : 1)),
    [earnedIds],
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="返回"
          style={styles.backBtn}
        >
          <IconBack size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>徽章</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats line */}
        <Text style={styles.statsText}>
          已获得 {earnedIds.size} 枚徽章
        </Text>

        {/* 3-column grid */}
        <View style={styles.grid}>
          {sortedBadges.map((badge) => {
            const isEarned = earnedIds.has(badge.id)

            const label = isEarned ? `${badge.name}徽章，已获得` : `${badge.name}徽章，未解锁`
            const card = (
              <View style={[styles.card, isEarned ? styles.cardEarned : styles.cardLocked]} accessibilityLabel={label}>
                <View style={[styles.cardIconWrap, !isEarned && styles.cardIconLocked]}>
                  <BadgeIcon badge={badge} size={28} color={isEarned ? COLORS.primary : COLORS.textTertiary} />
                </View>
                <Text style={[styles.cardName, !isEarned && styles.cardNameLocked]} numberOfLines={1}>{badge.name}</Text>
              </View>
            )

            if (isEarned) {
              return (
                <TouchableOpacity
                  key={badge.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedBadge(badge)}
                  style={styles.cellWrapper}
                >
                  {card}
                </TouchableOpacity>
              )
            }

            return (
              <View key={badge.id} style={styles.cellWrapper}>
                {card}
              </View>
            )
          })}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Detail modal */}
      {selectedBadge && (
        <BadgeDetailModal
          badge={selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: SPACING.lg, height: 56,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: TYPOGRAPHY.fontSize.md, fontWeight: TYPOGRAPHY.fontWeight.semibold, color: COLORS.text },
  headerSpacer: { width: 36 },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  statsText: {
    fontSize: TYPOGRAPHY.fontSize.md, fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text, textAlign: 'center', marginBottom: SPACING['2xl'],
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  cellWrapper: { width: '31%' },
  card: {
    width: '100%', borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm, paddingVertical: SPACING.md, alignItems: 'center',
  },
  cardEarned: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  cardLocked: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed' },
  cardIconWrap: { marginBottom: SPACING.xs, height: 36, alignItems: 'center', justifyContent: 'center' },
  cardIconLocked: { opacity: 0.2 },
  cardName: {
    fontSize: TYPOGRAPHY.fontSize.xs, fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text, textAlign: 'center',
  },
  cardNameLocked: { color: COLORS.textTertiary },
  bottomSpacer: { height: SPACING['5xl'] },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalCard: {
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'], alignItems: 'center', width: '72%',
  },
  modalCloseBtn: { position: 'absolute', top: SPACING.md, right: SPACING.md },
  modalIconWrap: { marginBottom: SPACING.md, alignItems: 'center', justifyContent: 'center' },
  modalName: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text, marginBottom: SPACING.xs,
  },
  modalDesc: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, textAlign: 'center' },
})
