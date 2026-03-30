import React, { useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ZenButton } from '../ui/ZenButton'
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
    (mode: CompanionMode) => {
      onSelect(mode)
    },
    [onSelect]
  )

  return (
    <Animated.View entering={FadeIn.delay(400).duration(500)} style={styles.modeRow}>
      <ZenButton
        variant="ghost"
        style={[styles.modeCard, selected === 'message' && styles.modeCardActive]}
        onPress={() => handleSelect('message')}
      >
        <View style={styles.cardContent}>
          <Feather 
            name="mail" 
            size={28} 
            color={selected === 'message' ? COLORS.primary : COLORS.textSecondary} 
            style={styles.modeIcon} 
          />
          <Text style={[styles.modeLabel, selected === 'message' && styles.modeLabelActive]}>
            A 给朋友的信
          </Text>
          <Text style={styles.modeDesc}>告诉TA你的状态</Text>
        </View>
      </ZenButton>
      <ZenButton
        variant="ghost"
        style={[styles.modeCard, selected === 'presence' && styles.modeCardActive]}
        onPress={() => handleSelect('presence')}
      >
        <View style={styles.cardContent}>
          <Ionicons 
            name="business-outline" 
            size={28} 
            color={selected === 'presence' ? COLORS.primary : COLORS.textSecondary} 
            style={styles.modeIcon} 
          />
          <Text style={[styles.modeLabel, selected === 'presence' && styles.modeLabelActive]}>
            B 无声陪伴
          </Text>
          <Text style={styles.modeDesc}>去一个公共场所坐坐</Text>
        </View>
      </ZenButton>
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
    height: 'auto',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  modeCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F5FA',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIcon: {
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
