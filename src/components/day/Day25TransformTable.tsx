import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import Animated, {
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import type { RegretEntry } from './Day25RegretList'

// ─── Props ─────────────────────────────────────────────────────────

interface Day25TransformTableProps {
  readonly regrets: ReadonlyArray<RegretEntry>
  readonly onSeal: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day25TransformTable = React.memo(function Day25TransformTable({
  regrets,
  onSeal,
}: Day25TransformTableProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.Text entering={FadeIn.duration(400)} style={styles.tableTitle}>
        遗憾转化表
      </Animated.Text>

      {/* Table header */}
      <Animated.View entering={FadeIn.delay(200).duration(300)} style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.tableCol]}>遗憾</Text>
        <Text style={[styles.tableHeaderText, styles.tableCol]}>如果重来</Text>
        <Text style={[styles.tableHeaderText, styles.tableCol]}>现在选择</Text>
      </Animated.View>

      {/* Table rows */}
      {regrets.map((entry, index) => (
        <Animated.View
          key={index}
          entering={SlideInDown.delay(300 + index * 150).duration(300)}
          style={styles.tableRow}
        >
          <Text style={[styles.tableCell, styles.tableCol]}>{entry.regret}</Text>
          <Text style={[styles.tableCell, styles.tableCol]}>{entry.alternative}</Text>
          <Text style={[styles.tableCellHighlight, styles.tableCol]}>{entry.currentChoice}</Text>
        </Animated.View>
      ))}

      {/* Seal button */}
      <TouchableOpacity
        style={styles.sealButton}
        onPress={onSeal}
        activeOpacity={0.8}
      >
        <Text style={styles.sealButtonText}>封存遗憾</Text>
      </TouchableOpacity>
    </ScrollView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING['5xl'],
  },
  tableTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableCol: {
    flex: 1,
    paddingHorizontal: SPACING.xs,
  },
  tableCell: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.text,
  },
  tableCellHighlight: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.primary,
    fontWeight: '600',
  },
  sealButton: {
    marginTop: SPACING['3xl'],
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.stageDeepHealing,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  sealButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.card,
  },
})

export default Day25TransformTable
