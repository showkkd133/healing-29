import React from 'react'
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day24InputStepProps {
  readonly oldNarrative: string
  readonly onChangeOldNarrative: (text: string) => void
  readonly onProceed: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day24InputStep = React.memo(function Day24InputStep({
  oldNarrative,
  onChangeOldNarrative,
  onProceed,
}: Day24InputStepProps) {
  const isDisabled = oldNarrative.trim().length === 0

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.Text entering={FadeIn.delay(200).duration(500)} style={styles.guidanceText}>
          选择一段回忆
        </Animated.Text>

        <Animated.View entering={SlideInDown.delay(400).duration(500)}>
          <Text style={styles.sectionLabel}>描述一段关键回忆</Text>
          <TextInput
            style={styles.memoryInput}
            value={oldNarrative}
            onChangeText={onChangeOldNarrative}
            placeholder="那是一个..."
            placeholderTextColor={COLORS.textTertiary}
            multiline
            textAlignVertical="top"
            maxLength={2000}
          />
        </Animated.View>

        <TouchableOpacity
          style={[styles.primaryButton, isDisabled && styles.primaryButtonDisabled]}
          onPress={onProceed}
          disabled={isDisabled}
          activeOpacity={0.8}
        >
          <Text style={[styles.primaryButtonText, isDisabled && styles.primaryButtonTextDisabled]}>
            开始重写
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

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
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: SPACING['3xl'],
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  memoryInput: {
    minHeight: 180,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.text,
    ...SHADOWS.sm,
  },
  primaryButton: {
    marginTop: SPACING['3xl'],
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  primaryButtonTextDisabled: {
    color: COLORS.textTertiary,
  },
})

export default Day24InputStep
