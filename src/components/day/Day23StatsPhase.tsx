import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ZenButton } from '@/components/ui/ZenButton'
import {
  DECISION_PAIRS,
  SATISFACTION_OPTIONS,
  type DecisionEntry,
} from './Day23Types'

// ─── Props ─────────────────────────────────────────────────────────

interface Day23StatsPhaseProps {
  readonly decisions: ReadonlyArray<DecisionEntry>
  readonly onComplete: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day23StatsPhase = React.memo(function Day23StatsPhase({
  decisions,
  onComplete,
}: Day23StatsPhaseProps) {
  const totalTime = decisions.reduce((sum, d) => sum + d.time, 0)
  const avgTime = decisions.length > 0
    ? Math.round((totalTime / decisions.length) * 10) / 10
    : 0

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.statsContainer}>
      <Text style={styles.statsTitle}>决策统计</Text>
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{decisions.length}</Text>
          <Text style={styles.statLabel}>个决定</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{avgTime}</Text>
          <Text style={styles.statLabel}>秒/平均</Text>
        </View>
      </View>

      {/* Decision history */}
      {decisions.map((d, i) => {
        const option = SATISFACTION_OPTIONS.find((s) => s.id === d.satisfaction)
        return (
          <Animated.View
            key={i}
            entering={FadeIn.delay(200 + i * 100).duration(300)}
            style={styles.historyRow}
          >
            <Text style={styles.historyQuestion}>
              {DECISION_PAIRS[i % DECISION_PAIRS.length].question}
            </Text>
            <Text style={styles.historyChoice}>{d.choice}</Text>
            <Text style={styles.historyTime}>{d.time}s</Text>
            <View style={styles.historySatisfaction}>
              <Feather
                name={(option?.icon as any) ?? 'minus-circle'}
                size={18}
                color={option?.id === 'happy' ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
          </Animated.View>
        )
      })}

      <ZenButton
        title="完成练习"
        onPress={onComplete}
        style={styles.completeButton}
      />
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  statsContainer: {
    flex: 1,
    paddingTop: SPACING.xl,
  },
  statsTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
    marginBottom: SPACING.xl,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  historyQuestion: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  historyChoice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: SPACING.md,
  },
  historyTime: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginRight: SPACING.md,
  },
  historySatisfaction: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    marginTop: SPACING['3xl'],
  },
})

export default Day23StatsPhase
