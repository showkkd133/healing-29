// Day 12 – Method selection sub-component

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { SlideInDown, FadeInUp } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { useHaptic } from '@/hooks/useHaptic'
import { METHODS } from './Day12Constants'

interface Day12MethodSelectorProps {
  readonly selectedMethod: string | null
  readonly onSelectMethod: (id: string) => void
}

const Day12MethodSelector = React.memo(function Day12MethodSelector({
  selectedMethod,
  onSelectMethod,
}: Day12MethodSelectorProps) {
  const haptic = useHaptic();

  const handleSelect = (id: string) => {
    haptic.medium();
    onSelectMethod(id);
  }

  return (
    <Animated.View entering={SlideInDown.duration(400)}>
      <Text style={styles.sectionLabel}>善意方式</Text>
      <View style={styles.methodList}>
        {METHODS.map((method, index) => (
          <Animated.View
            key={method.id}
            entering={FadeInUp.delay(index * 100).duration(300)}
          >
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardActive,
              ]}
              onPress={() => handleSelect(method.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.methodTitle,
                  selectedMethod === method.id && styles.methodTitleActive,
                ]}
              >
                {method.title}
              </Text>
              <Text style={styles.methodDescription}>{method.description}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  methodList: {
    gap: SPACING.md,
  },
  methodCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  methodCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F5FA',
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  methodTitleActive: {
    color: COLORS.primary,
  },
  methodDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
})

export default Day12MethodSelector
