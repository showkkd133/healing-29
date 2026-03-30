import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day19DecisionScreenProps {
  readonly finalDecision: string | null
  readonly onDecision: (decision: string) => void
  readonly onComplete: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day19DecisionScreen = React.memo(function Day19DecisionScreen({
  finalDecision,
  onDecision,
  onComplete,
}: Day19DecisionScreenProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.decisionContainer}>
        <Text style={styles.decisionTitle}>冷静期结束</Text>
        <Text style={styles.decisionSubtitle}>现在的感受如何？</Text>

        {!finalDecision ? (
          <View style={styles.decisionRow}>
            <TouchableOpacity
              style={[styles.decisionButton, styles.decisionStillWant]}
              onPress={() => onDecision('still_want')}
              activeOpacity={0.8}
            >
              <Text style={styles.decisionButtonText}>还想联系</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.decisionButton, styles.decisionPassed]}
              onPress={() => onDecision('passed')}
              activeOpacity={0.8}
            >
              <Text style={[styles.decisionButtonText, styles.decisionPassedText]}>
                冲动过去了
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View entering={SlideInDown.duration(400)} style={styles.decisionResult}>
            {finalDecision === 'still_want' ? (
              <>
                <Text style={styles.checklistTitle}>发送前检查清单：</Text>
                <Text style={styles.checklistItem}>☐ 这条消息能改变什么？</Text>
                <Text style={styles.checklistItem}>☐ 发完会更难受吗？</Text>
                <Text style={styles.checklistItem}>☐ 建议先发给自己</Text>
              </>
            ) : (
              <Text style={styles.praiseText}>这个冲动过去了，你很棒 ✨</Text>
            )}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>完成</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decisionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  decisionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  decisionSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING['3xl'],
  },
  decisionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  decisionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS['2xl'],
    alignItems: 'center',
  },
  decisionStillWant: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  decisionPassed: {
    backgroundColor: COLORS.primary,
  },
  decisionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  decisionPassedText: {
    color: COLORS.card,
  },
  decisionResult: {
    width: '100%',
    alignItems: 'center',
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  checklistItem: {
    fontSize: 15,
    color: COLORS.textSecondary,
    alignSelf: 'flex-start',
    lineHeight: 28,
  },
  praiseText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    width: '100%',
    marginTop: SPACING['2xl'],
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day19DecisionScreen
