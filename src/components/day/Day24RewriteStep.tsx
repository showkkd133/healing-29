import React from 'react'
import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ZenButton } from '@/components/ui/ZenButton'

// ─── Props ─────────────────────────────────────────────────────────

interface Day24RewriteStepProps {
  readonly oldNarrative: string
  readonly newNarrative: string
  readonly templates: readonly string[]
  readonly onChangeNewNarrative: (text: string) => void
  readonly onTemplatePress: (template: string) => void
  readonly onProceed: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day24RewriteStep = React.memo(function Day24RewriteStep({
  oldNarrative,
  newNarrative,
  templates,
  onChangeNewNarrative,
  onTemplatePress,
  onProceed,
}: Day24RewriteStepProps) {
  const isDisabled = newNarrative.trim().length === 0

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
        {/* Original memory display */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.originalCard}>
          <Text style={styles.originalLabel}>原始记忆</Text>
          <Text style={styles.originalText}>{oldNarrative}</Text>
        </Animated.View>

        {/* Rewrite guidance */}
        <Animated.Text entering={FadeIn.delay(300).duration(400)} style={styles.rewriteGuide}>
          用现在的你，重新讲述这个故事
        </Animated.Text>

        {/* Template buttons */}
        <Animated.View entering={FadeIn.delay(400).duration(300)} style={styles.templateRow}>
          {templates.map((template, index) => (
            <ZenButton
              key={index}
              variant="outline"
              size="sm"
              style={styles.templateButton}
              onPress={() => onTemplatePress(template)}
            >
              <Text style={styles.templateText}>"{template}"</Text>
            </ZenButton>
          ))}
        </Animated.View>

        {/* Rewrite input */}
        <TextInput
          style={styles.rewriteInput}
          value={newNarrative}
          onChangeText={onChangeNewNarrative}
          placeholder="重新讲述这段记忆..."
          placeholderTextColor={COLORS.textTertiary}
          multiline
          textAlignVertical="top"
          maxLength={2000}
        />

        <ZenButton
          title="查看对比"
          onPress={onProceed}
          disabled={isDisabled}
          style={styles.primaryButton}
        />
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
  originalCard: {
    backgroundColor: COLORS.backgroundMuted,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  originalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  originalText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  rewriteGuide: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 28,
  },
  templateRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  templateButton: {
    flex: 1,
    minHeight: 40,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  templateText: {
    fontSize: 11,
    color: COLORS.primary,
    textAlign: 'center',
  },
  rewriteInput: {
    minHeight: 200,
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
  },
})

export default Day24RewriteStep
