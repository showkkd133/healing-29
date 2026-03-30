import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day16ActionButtonsProps {
  readonly visible: boolean
  readonly emergencyKitUpdated: boolean
  readonly onSaveToKit: () => void
  readonly onComplete: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day16ActionButtons = React.memo(function Day16ActionButtons({
  visible,
  emergencyKitUpdated,
  onSaveToKit,
  onComplete,
}: Day16ActionButtonsProps) {
  if (!visible) return null

  return (
    <>
      <Animated.View entering={FadeIn.duration(400)} style={styles.kitSection}>
        {emergencyKitUpdated ? (
          <View style={styles.kitConfirm}>
            <Text style={styles.kitConfirmText}>✅ 已加入急救包</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.kitButton}
            onPress={onSaveToKit}
            activeOpacity={0.8}
          >
            <Text style={styles.kitButtonText}>保存到急救包</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400)} style={styles.completeSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>完成</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  kitSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  kitButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.accent,
    alignItems: 'center',
  },
  kitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  kitConfirm: {
    paddingVertical: SPACING.md,
  },
  kitConfirmText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.success,
  },
  completeSection: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day16ActionButtons
