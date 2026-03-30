import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import type { ExperimentOption } from './Day20Constants'

// ─── Props ─────────────────────────────────────────────────────────

interface Day20TaskExecutionFormProps {
  readonly experiment: ExperimentOption
  readonly executionNote: string
  readonly feelingNote: string
  readonly onExecutionNoteChange: (text: string) => void
  readonly onFeelingNoteChange: (text: string) => void
  readonly onSubmit: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day20TaskExecutionForm = React.memo(function Day20TaskExecutionForm({
  experiment,
  executionNote,
  feelingNote,
  onExecutionNoteChange,
  onFeelingNoteChange,
  onSubmit,
}: Day20TaskExecutionFormProps) {
  const isSubmitDisabled = !executionNote.trim() || !feelingNote.trim()

  return (
    <Animated.View entering={SlideInDown.duration(400)}>
      <View style={styles.taskCard}>
        <Text style={styles.taskIcon}>{experiment.icon}</Text>
        <Text style={styles.taskLabel}>{experiment.label}{'\u5B9E\u9A8C'}</Text>
        <Text style={styles.taskDescription}>{experiment.task}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.inputLabel}>{'\u6267\u884C\u8BB0\u5F55'}</Text>
        <TextInput
          style={styles.textInput}
          value={executionNote}
          onChangeText={onExecutionNoteChange}
          placeholder={'\u7B80\u77ED\u63CF\u8FF0\u4F60\u505A\u4E86\u4EC0\u4E48...'}
          placeholderTextColor={COLORS.textTertiary}
          multiline
          textAlignVertical="top"
          maxLength={300}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.inputLabel}>{'\u611F\u53D7\u8BB0\u5F55'}</Text>
        <TextInput
          style={styles.textInput}
          value={feelingNote}
          onChangeText={onFeelingNoteChange}
          placeholder={'\u505A\u7684\u65F6\u5019\u611F\u89C9\u5982\u4F55...'}
          placeholderTextColor={COLORS.textTertiary}
          multiline
          textAlignVertical="top"
          maxLength={300}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          isSubmitDisabled && styles.primaryButtonDisabled,
        ]}
        onPress={onSubmit}
        disabled={isSubmitDisabled}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>{'\u63D0\u4EA4\u8BB0\u5F55'}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    ...SHADOWS.md,
  },
  taskIcon: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  taskLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  taskDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  textInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 80,
    lineHeight: 24,
    ...SHADOWS.sm,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day20TaskExecutionForm
