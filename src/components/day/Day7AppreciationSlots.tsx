// Day 7 — Appreciation input slots (filled / active / locked)

import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { ZoomIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { TOTAL_SLOTS } from './Day7Constants'

interface Day7AppreciationSlotsProps {
  readonly appreciations: readonly string[]
  readonly currentInput: string
  readonly onChangeInput: (text: string) => void
  readonly onSubmit: () => void
}

const Day7AppreciationSlots = React.memo(function Day7AppreciationSlots({
  appreciations,
  currentInput,
  onChangeInput,
  onSubmit,
}: Day7AppreciationSlotsProps) {
  const filledCount = appreciations.length
  const currentSlot = filledCount

  return (
    <View style={styles.slotsContainer}>
      {Array.from({ length: TOTAL_SLOTS }, (_, i) => {
        const filled = i < filledCount
        const isCurrent = i === currentSlot
        const locked = i > currentSlot

        return (
          <View key={`slot-${i}`} style={styles.slotWrapper}>
            {filled ? (
              <Animated.View entering={ZoomIn.duration(400)} style={styles.slotFilled}>
                <Text style={styles.slotFilledIcon}>✨</Text>
                <Text style={styles.slotFilledText}>{appreciations[i]}</Text>
              </Animated.View>
            ) : isCurrent ? (
              <View style={styles.slotActive}>
                <TextInput
                  style={styles.slotInput}
                  value={currentInput}
                  onChangeText={onChangeInput}
                  placeholder={`第 ${i + 1} 个优点`}
                  placeholderTextColor={COLORS.textTertiary}
                  onSubmitEditing={onSubmit}
                  returnKeyType="done"
                  maxLength={20}
                />
                <TouchableOpacity
                  style={[
                    styles.slotSubmit,
                    !currentInput.trim() && styles.slotSubmitDisabled,
                  ]}
                  onPress={onSubmit}
                  disabled={!currentInput.trim()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.slotSubmitText}>确认</Text>
                </TouchableOpacity>
              </View>
            ) : locked ? (
              <View style={styles.slotLocked}>
                <Text style={styles.slotLockedText}>🔒 第 {i + 1} 个</Text>
              </View>
            ) : null}
          </View>
        )
      })}
    </View>
  )
})

const styles = StyleSheet.create({
  slotsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  slotWrapper: {},
  slotFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F0',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  slotFilledIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  slotFilledText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  slotActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  slotInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  slotSubmit: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
  },
  slotSubmitDisabled: {
    backgroundColor: COLORS.border,
  },
  slotSubmitText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.card,
  },
  slotLocked: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    opacity: 0.5,
  },
  slotLockedText: {
    fontSize: 15,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
})

export default Day7AppreciationSlots
