import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { NEXT_OPTIONS } from './Day29Types'

// ─── Props ────────────────────────────────────────────────────────

interface Day29ReviewProps {
  readonly day1Played: boolean
  readonly onPlayDay1: () => void
  readonly onSkipDay1: () => void
  readonly onComplete: (nextAction: string) => void
}

// ─── Component ────────────────────────────────────────────────────

const Day29Review = React.memo(function Day29Review({
  day1Played,
  onPlayDay1,
  onSkipDay1,
  onComplete,
}: Day29ReviewProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text entering={FadeIn.duration(400)} style={styles.title}>
          回顾礼包
        </Animated.Text>

        {/* Day 1 recording */}
        <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>Day 1 录音</Text>
          {day1Played ? (
            <Text style={styles.cardNote}>已播放 ✓</Text>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={onPlayDay1}
                activeOpacity={0.8}
              >
                <Text style={styles.playText}>播放 Day 1 录音</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={onSkipDay1}
                activeOpacity={0.7}
              >
                <Text style={styles.skipText}>我还不想听</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Emotion curve placeholder */}
        <Animated.View entering={FadeIn.delay(400).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>情绪曲线</Text>
          <View style={styles.curvePlaceholder}>
            <Text style={styles.curvePlaceholderText}>📈 情绪变化趋势</Text>
          </View>
        </Animated.View>

        {/* Badge grid placeholder */}
        <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>成就徽章</Text>
          <View style={styles.badgeGrid}>
            {['🌱', '💪', '🦋', '🌟', '🎯', '❤️‍🩹'].map((badge, i) => (
              <View key={i} style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>{badge}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Growth report placeholder */}
        <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>成长报告摘要</Text>
          <Text style={styles.reportText}>
            29天，你走过了最难的部分。你学会了面对、接受、放下、重建。这些都是你自己做到的。
          </Text>
        </Animated.View>

        {/* Next options */}
        <Animated.View entering={SlideInDown.delay(1000).duration(400)} style={styles.nextSection}>
          <Text style={styles.nextTitle}>接下来…</Text>
          {NEXT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={styles.nextButton}
              onPress={() => onComplete(opt.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING['5xl'],
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  cardNote: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '500',
  },
  buttonRow: {
    gap: SPACING.sm,
  },
  playButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  playText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.card,
  },
  skipButton: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  curvePlaceholder: {
    height: 80,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  curvePlaceholderText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  badgeItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: {
    fontSize: 22,
  },
  reportText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  nextSection: {
    marginTop: SPACING.xl,
  },
  nextTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  nextButton: {
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
})

export default Day29Review
