// Day 12 – Share toggle and complete button sub-component

import React from 'react'
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

interface Day12BottomSectionProps {
  readonly storyShared: boolean
  readonly canComplete: boolean
  readonly onToggleShare: (value: boolean) => void
  readonly onComplete: () => void
}

const Day12BottomSection = React.memo(function Day12BottomSection({
  storyShared,
  canComplete,
  onToggleShare,
  onComplete,
}: Day12BottomSectionProps) {
  return (
    <Animated.View entering={FadeIn.delay(400).duration(400)} style={styles.bottomSection}>
      <View style={styles.shareRow}>
        <Text style={styles.shareLabel}>匿名分享这个故事</Text>
        <Switch
          value={storyShared}
          onValueChange={onToggleShare}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.card}
        />
      </View>

      <TouchableOpacity
        style={[styles.completeButton, !canComplete && styles.completeButtonDisabled]}
        onPress={onComplete}
        disabled={!canComplete}
        activeOpacity={0.8}
      >
        <Text style={styles.completeButtonText}>完成实验</Text>
      </TouchableOpacity>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  bottomSection: {
    marginTop: SPACING['2xl'],
  },
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  shareLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  completeButton: {
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  completeButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day12BottomSection
