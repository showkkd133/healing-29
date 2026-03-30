import React, { useCallback } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import type { CompanionMode } from './Day3Constants'

// ─── Props ─────────────────────────────────────────────────────────

interface Day3ModeSelectorProps {
  readonly selected: CompanionMode | null
  readonly onSelect: (mode: CompanionMode) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day3ModeSelector = React.memo(function Day3ModeSelector({
  selected,
  onSelect,
}: Day3ModeSelectorProps) {
  const handleSelect = useCallback(
    async (mode: CompanionMode) => {
      try {
        await Haptics.selectionAsync()
      } catch {
        // Haptics not available
      }
      onSelect(mode)
    },
    [onSelect]
  )

  return (
    <Animated.View entering={FadeIn.delay(400).duration(500)} style={styles.modeRow}>
      <TouchableOpacity
        style={[styles.modeCard, selected === 'message' && styles.modeCardActive]}
        onPress={() => handleSelect('message')}
        activeOpacity={0.8}
      >
        <Text style={styles.modeIcon}>💌</Text>
        <Text style={[styles.modeLabel, selected === 'message' && styles.modeLabelActive]}>
          A 给朋友的信
        </Text>
        <Text style={styles.modeDesc}>告诉TA你的状态</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modeCard, selected === 'presence' && styles.modeCardActive]}
        onPress={() => handleSelect('presence')}
        activeOpacity={0.8}
      >
        <Text style={styles.modeIcon}>🏙</Text>
        <Text style={[styles.modeLabel, selected === 'presence' && styles.modeLabelActive]}>
          B 无声陪伴
        </Text>
        <Text style={styles.modeDesc}>去一个公共场所坐坐</Text>
      </TouchableOpacity>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  modeRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  modeCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  modeCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F5FA',
  },
  modeIcon: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  modeLabelActive: {
    color: COLORS.primary,
  },
  modeDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
})

export default Day3ModeSelector
