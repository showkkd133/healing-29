// Day 11 — Time's up phase: face wash check, extend, and finish

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { EXTEND_CONFIRMATIONS_NEEDED } from './Day11constants'

interface Day11TimeUpPhaseProps {
  readonly faceWashed: boolean
  readonly extendCount: number
  readonly onFaceWash: () => void
  readonly onExtend: () => void
  readonly onComplete: () => void
}

const Day11TimeUpPhase = React.memo(function Day11TimeUpPhase({
  faceWashed,
  extendCount,
  onFaceWash,
  onExtend,
  onComplete,
}: Day11TimeUpPhaseProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.card}>
          <Text style={styles.emoji}>⏰</Text>
          <Text style={styles.title}>时间到了，去洗把脸</Text>
          <Text style={styles.subtitle}>冷水会帮你回到当下</Text>

          <TouchableOpacity
            style={[styles.washButton, faceWashed && styles.washButtonDone]}
            onPress={onFaceWash}
            disabled={faceWashed}
            activeOpacity={0.8}
          >
            <Text style={styles.washButtonText}>
              {faceWashed ? '已洗脸 ✓' : '洗脸打卡 💧'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.extendButton}
            onPress={onExtend}
            activeOpacity={0.7}
          >
            <Text style={styles.extendButtonText}>
              延长崩溃{extendCount > 0 ? ` (${extendCount}/${EXTEND_CONFIRMATIONS_NEEDED})` : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.finishButton}
            onPress={onComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.finishButtonText}>结束崩溃</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    padding: SPACING['2xl'],
  },
  emoji: {
    fontSize: 56,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: SPACING['3xl'],
  },
  washButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  washButtonDone: {
    backgroundColor: COLORS.success,
  },
  washButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  extendButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  extendButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  finishButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.accent,
    ...SHADOWS.sm,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day11TimeUpPhase
