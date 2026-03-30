import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day16ComparisonCardsProps {
  readonly firstFlaw: string
}

// ─── Component ─────────────────────────────────────────────────────

const Day16ComparisonCards = React.memo(function Day16ComparisonCards({
  firstFlaw,
}: Day16ComparisonCardsProps) {
  const hasContent = firstFlaw.trim().length > 0

  return (
    <Animated.View entering={FadeInDown.delay(900).duration(400)} style={styles.section}>
      <Text style={styles.sectionTitle}>去滤镜版</Text>
      <View style={styles.comparisonRow}>
        <View style={[styles.comparisonCard, styles.comparisonBeautified]}>
          <Text style={styles.comparisonLabel}>美化版</Text>
          <Text style={styles.comparisonContent}>
            {hasContent ? `"TA只是${firstFlaw}而已"` : '"TA只是有点小脾气"'}
          </Text>
        </View>
        <View style={[styles.comparisonCard, styles.comparisonReal]}>
          <Text style={styles.comparisonLabel}>真实版</Text>
          <Text style={styles.comparisonContent}>
            {hasContent ? `"${firstFlaw}让我很难受"` : '"这让我很难受"'}
          </Text>
        </View>
      </View>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING['2xl'],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  comparisonCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  comparisonBeautified: {
    backgroundColor: COLORS.secondary,
  },
  comparisonReal: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  comparisonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  comparisonContent: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
})

export default Day16ComparisonCards
