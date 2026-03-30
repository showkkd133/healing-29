import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native'
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day24CompareStepProps {
  readonly oldNarrative: string
  readonly newNarrative: string
  readonly insightGained: string
  readonly setAsDefault: boolean
  readonly onChangeInsight: (text: string) => void
  readonly onToggleDefault: (value: boolean) => void
  readonly onComplete: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day24CompareStep = React.memo(function Day24CompareStep({
  oldNarrative,
  newNarrative,
  insightGained,
  setAsDefault,
  onChangeInsight,
  onToggleDefault,
  onComplete,
}: Day24CompareStepProps) {
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
        <Animated.Text entering={FadeIn.duration(400)} style={styles.sectionTitle}>
          记忆对比
        </Animated.Text>

        {/* Old version */}
        <Animated.View entering={SlideInDown.delay(200).duration(400)} style={styles.compareCard}>
          <Text style={styles.compareLabel}>旧版本</Text>
          <View style={styles.oldNarrativeBox}>
            <Text style={styles.narrativeText}>{oldNarrative}</Text>
          </View>
        </Animated.View>

        {/* New version */}
        <Animated.View entering={SlideInDown.delay(400).duration(400)} style={styles.compareCard}>
          <Text style={styles.compareLabel}>新版本</Text>
          <View style={styles.newNarrativeBox}>
            <Text style={styles.narrativeText}>{newNarrative}</Text>
          </View>
        </Animated.View>

        {/* Insight */}
        <Animated.View entering={FadeIn.delay(600).duration(400)}>
          <Text style={styles.sectionLabel}>你从中获得了什么领悟？</Text>
          <TextInput
            style={styles.textInput}
            value={insightGained}
            onChangeText={onChangeInsight}
            placeholder="写下你的感悟..."
            placeholderTextColor={COLORS.textTertiary}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
        </Animated.View>

        {/* Set as default toggle */}
        <Animated.View entering={FadeIn.delay(700).duration(300)} style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>设为默认记忆</Text>
          <Switch
            value={setAsDefault}
            onValueChange={onToggleDefault}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.card}
          />
        </Animated.View>

        {/* Complete button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>完成重写</Text>
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  compareCard: {
    marginBottom: SPACING.lg,
  },
  compareLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  oldNarrativeBox: {
    backgroundColor: COLORS.backgroundMuted,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  newNarrativeBox: {
    backgroundColor: COLORS.backgroundPositive,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  narrativeText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
  },
  textInput: {
    minHeight: 100,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
    ...SHADOWS.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  primaryButton: {
    marginTop: SPACING['3xl'],
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day24CompareStep
