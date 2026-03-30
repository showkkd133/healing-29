import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  SlideInDown,
  FadeInLeft,
  FadeInRight,
} from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import type { Evidence } from './Day14CategoryPicker'

// ─── ReportView component ─────────────────────────────────────────

interface ReportViewProps {
  readonly mismatches: readonly Evidence[]
  readonly learnings: readonly Evidence[]
}

const ReportView = React.memo(function ReportView({
  mismatches,
  learnings,
}: ReportViewProps) {
  const validMismatches = mismatches.filter((e) => e.text.trim().length > 0)
  const validLearnings = learnings.filter((e) => e.text.trim().length > 0)

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={reportStyles.content}>
      <Animated.View entering={FadeIn.duration(600)} style={reportStyles.header}>
        <View style={reportStyles.headerLine} />
        <Text style={reportStyles.headerTitle}>关系尸检报告</Text>
        <View style={reportStyles.headerLine} />
      </Animated.View>

      <Animated.View entering={SlideInDown.delay(300).duration(500)} style={reportStyles.table}>
        {/* Table header */}
        <View style={reportStyles.tableRow}>
          <View style={[reportStyles.tableCell, reportStyles.tableCellLeft]}>
            <Text style={reportStyles.tableHeader}>不适合的证据</Text>
          </View>
          <View style={[reportStyles.tableCell, reportStyles.tableCellRight]}>
            <Text style={reportStyles.tableHeader}>关于自己的发现</Text>
          </View>
        </View>

        {/* Table rows */}
        {Array.from({ length: Math.max(validMismatches.length, validLearnings.length, 1) }, (_, i) => (
          <View key={i} style={reportStyles.tableRow}>
            <View style={[reportStyles.tableCell, reportStyles.tableCellLeft]}>
              {validMismatches[i] && (
                <Animated.View entering={FadeInLeft.delay(400 + i * 150).duration(400)}>
                  <Text style={reportStyles.categoryTag}>{validMismatches[i].category}</Text>
                  <Text style={reportStyles.cellText}>{validMismatches[i].text}</Text>
                </Animated.View>
              )}
            </View>
            <View style={[reportStyles.tableCell, reportStyles.tableCellRight]}>
              {validLearnings[i] && (
                <Animated.View entering={FadeInRight.delay(400 + i * 150).duration(400)}>
                  <Text style={reportStyles.categoryTag}>{validLearnings[i].category}</Text>
                  <Text style={reportStyles.cellText}>{validLearnings[i].text}</Text>
                </Animated.View>
              )}
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Conclusion */}
      <Animated.View entering={FadeIn.delay(800).duration(600)} style={reportStyles.conclusion}>
        <Text style={reportStyles.conclusionLabel}>结论</Text>
        <Text style={reportStyles.conclusionText}>死因：不适合。</Text>
        <Text style={reportStyles.conclusionText}>结论：无过错方。</Text>
      </Animated.View>
    </ScrollView>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const reportStyles = StyleSheet.create({
  content: {
    paddingBottom: SPACING['5xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING['2xl'],
    gap: SPACING.md,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 2,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  tableCell: {
    flex: 1,
    padding: SPACING.md,
    minHeight: 60,
  },
  tableCellLeft: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: COLORS.border,
  },
  tableCellRight: {},
  tableHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    backgroundColor: '#F0F5FA',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xs,
    overflow: 'hidden',
  },
  cellText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
  conclusion: {
    marginTop: SPACING['3xl'],
    padding: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  conclusionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    letterSpacing: 1,
  },
  conclusionText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 30,
  },
})

export default ReportView
