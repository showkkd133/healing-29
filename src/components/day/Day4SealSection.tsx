import React from 'react'
import { Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { getBoxEmoji, getBoxLabel } from './Day4Types'

interface Day4SealSectionProps {
  readonly itemCount: number
  readonly sealDate: string
  readonly onSealDateChange: (date: string) => void
  readonly onSeal: () => void
}

// Virtual box visualization and seal controls
const Day4SealSection = React.memo(function Day4SealSection({
  itemCount,
  sealDate,
  onSealDateChange,
  onSeal,
}: Day4SealSectionProps) {
  return (
    <>
      {/* Virtual box */}
      <Animated.View entering={FadeInDown.delay(900).duration(400)} style={styles.boxSection}>
        <Text style={styles.boxEmoji}>{getBoxEmoji(itemCount)}</Text>
        <Text style={styles.boxCount}>
          已收纳 {itemCount} 件 · {getBoxLabel(itemCount)}
        </Text>
      </Animated.View>

      {/* Seal controls (only visible when items exist) */}
      {itemCount > 0 && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.sealSection}>
          <Text style={styles.sealLabel}>封存日期</Text>
          <TextInput
            style={styles.sealDateInput}
            value={sealDate}
            onChangeText={onSealDateChange}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.textTertiary}
            maxLength={10}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={onSeal}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>🔒 封存</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  )
})

const styles = StyleSheet.create({
  boxSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING['2xl'],
  },
  boxEmoji: {
    fontSize: 64,
    marginBottom: SPACING.sm,
  },
  boxCount: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  sealSection: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  sealLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  sealDateInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    width: 200,
    ...SHADOWS.sm,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day4SealSection
