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
import Animated, {
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Constants ─────────────────────────────────────────────────────

const MAX_REGRETS = 3

// ─── Props ─────────────────────────────────────────────────────────

interface Day25RegretInputProps {
  readonly currentStep: number
  readonly regretText: string
  readonly alternativeText: string
  readonly currentChoiceText: string
  readonly canProceed: boolean
  readonly onRegretChange: (text: string) => void
  readonly onAlternativeChange: (text: string) => void
  readonly onCurrentChoiceChange: (text: string) => void
  readonly onNext: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day25RegretInput = React.memo(function Day25RegretInput({
  currentStep,
  regretText,
  alternativeText,
  currentChoiceText,
  canProceed,
  onRegretChange,
  onAlternativeChange,
  onCurrentChoiceChange,
  onNext,
}: Day25RegretInputProps) {
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
        <Animated.Text entering={FadeIn.duration(400)} style={styles.guidanceText}>
          未完成清单
        </Animated.Text>

        <Animated.Text entering={FadeIn.delay(200).duration(300)} style={styles.stepIndicator}>
          第 {currentStep + 1} / {MAX_REGRETS} 个遗憾
        </Animated.Text>

        {/* Regret input */}
        <Animated.View entering={SlideInDown.delay(300).duration(400)}>
          <Text style={styles.sectionLabel}>我遗憾的是…</Text>
          <TextInput
            style={styles.textInput}
            value={regretText}
            onChangeText={onRegretChange}
            placeholder="写下一个遗憾"
            placeholderTextColor={COLORS.textTertiary}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
        </Animated.View>

        {/* Alternative input */}
        {regretText.trim().length > 0 && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.sectionLabel}>如果重来，我会…</Text>
            <TextInput
              style={styles.textInput}
              value={alternativeText}
              onChangeText={onAlternativeChange}
              placeholder="想象另一种可能"
              placeholderTextColor={COLORS.textTertiary}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </Animated.View>
        )}

        {/* Current choice input */}
        {alternativeText.trim().length > 0 && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.sectionLabel}>但现在，我选择…</Text>
            <TextInput
              style={[styles.textInput, styles.textInputHighlight]}
              value={currentChoiceText}
              onChangeText={onCurrentChoiceChange}
              placeholder="（必填）你现在的选择"
              placeholderTextColor={COLORS.textTertiary}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </Animated.View>
        )}

        {/* Next button */}
        <TouchableOpacity
          style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
          onPress={onNext}
          disabled={!canProceed}
          activeOpacity={0.8}
        >
          <Text style={[styles.nextButtonText, !canProceed && styles.nextButtonTextDisabled]}>
            {currentStep < MAX_REGRETS - 1 ? '下一个遗憾' : '查看转化表'}
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
    marginBottom: SPACING.lg,
  },
  stepIndicator: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING['3xl'],
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  textInput: {
    minHeight: 80,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
    ...SHADOWS.sm,
  },
  textInputHighlight: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  nextButton: {
    marginTop: SPACING['3xl'],
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  nextButtonTextDisabled: {
    color: COLORS.textTertiary,
  },
})

export default Day25RegretInput
