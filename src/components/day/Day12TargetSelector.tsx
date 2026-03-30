// Day 12 – Target selection sub-component

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { useHaptic } from '@/hooks/useHaptic'
import { TARGET_TABS, INTROVERT_TARGETS } from './Day12Constants'

interface Day12TargetSelectorProps {
  readonly showIntrovert: boolean
  readonly selectedTarget: string | null
  readonly onToggleIntrovert: () => void
  readonly onSelectTarget: (id: string) => void
}

const Day12TargetSelector = React.memo(function Day12TargetSelector({
  showIntrovert,
  selectedTarget,
  onToggleIntrovert,
  onSelectTarget,
}: Day12TargetSelectorProps) {
  const haptic = useHaptic();
  const activeTargets = showIntrovert ? INTROVERT_TARGETS : TARGET_TABS

  const handleToggle = () => {
    haptic.light();
    onToggleIntrovert();
  }

  const handleSelect = (id: string) => {
    haptic.medium();
    onSelectTarget(id);
  }

  return (
    <Animated.View entering={FadeIn.delay(200).duration(500)}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>选择对象</Text>
        <TouchableOpacity
          style={styles.introvertToggle}
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          <Text style={styles.introvertText}>
            {showIntrovert ? '切换正常版' : '社恐版 →'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.targetRow}>
        {activeTargets.map((target) => (
          <TouchableOpacity
            key={target.id}
            style={[
              styles.targetCard,
              selectedTarget === target.id && styles.targetCardActive,
            ]}
            onPress={() => handleSelect(target.id)}
            activeOpacity={0.7}
          >
            {target.provider === 'Ionicons' ? (
              <Ionicons 
                name={target.iconName as any} 
                size={28} 
                color={selectedTarget === target.id ? COLORS.card : COLORS.text} 
                style={styles.targetIcon}
              />
            ) : (
              <Feather 
                name={target.iconName as any} 
                size={28} 
                color={selectedTarget === target.id ? COLORS.card : COLORS.text} 
                style={styles.targetIcon}
              />
            )}
            <Text
              style={[
                styles.targetLabel,
                selectedTarget === target.id && styles.targetLabelActive,
              ]}
            >
              {target.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  introvertToggle: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  introvertText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },
  targetRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  targetCard: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  targetCardActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.stageEmergency,
  },
  targetIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  targetLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  targetLabelActive: {
    fontWeight: '600',
  },
})

export default Day12TargetSelector
