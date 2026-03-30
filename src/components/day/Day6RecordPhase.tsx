import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Constants ─────────────────────────────────────────────────────

const RECORD_METHODS = [
  { key: 'photo', label: '📷 拍照' },
  { key: 'voice', label: '🎙 录音' },
  { key: 'text', label: '✏️ 文字' },
] as const

// ─── Props ─────────────────────────────────────────────────────────

interface Day6RecordPhaseProps {
  readonly containerStyle: object
  readonly recordMethod: string | null
  readonly reflection: string
  readonly onRecordMethodChange: (method: string) => void
  readonly onReflectionChange: (text: string) => void
  readonly onComplete: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day6RecordPhase = React.memo(function Day6RecordPhase({
  containerStyle,
  recordMethod,
  reflection,
  onRecordMethodChange,
  onReflectionChange,
  onComplete,
}: Day6RecordPhaseProps) {
  return (
    <View style={containerStyle}>
      <Animated.Text entering={FadeIn.duration(500)} style={styles.sectionTitle}>
        记录你的体验
      </Animated.Text>

      {/* Record method selection */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.methodRow}>
        {RECORD_METHODS.map((method) => (
          <TouchableOpacity
            key={method.key}
            style={[
              styles.methodChip,
              recordMethod === method.key && styles.methodChipActive,
            ]}
            onPress={() => onRecordMethodChange(method.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.methodChipText,
                recordMethod === method.key && styles.methodChipTextActive,
              ]}
            >
              {method.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Reflection input */}
      <Animated.View entering={FadeInDown.delay(400).duration(400)}>
        <TextInput
          style={styles.reflectionInput}
          value={reflection}
          onChangeText={onReflectionChange}
          placeholder="记录一下感受..."
          placeholderTextColor={COLORS.textTertiary}
          multiline
          textAlignVertical="top"
          maxLength={500}
        />
      </Animated.View>

      {/* Complete button */}
      {recordMethod && (
        <Animated.View entering={FadeIn.duration(300)}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>完成</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  methodChip: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  methodChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  methodChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  methodChipTextActive: {
    color: COLORS.card,
  },
  reflectionInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    minHeight: 120,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: SPACING['2xl'],
    ...SHADOWS.sm,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    alignSelf: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day6RecordPhase
