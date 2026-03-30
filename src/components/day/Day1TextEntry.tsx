import React from 'react'
import { TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Constants ─────────────────────────────────────────────────────

const PLACEHOLDER_TEXT = '写下此刻的感受...'

// ─── Props ─────────────────────────────────────────────────────────

interface Day1TextEntryProps {
  readonly textEntry: string
  readonly onChangeText: (text: string) => void
  readonly onSubmit: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day1TextEntry = React.memo(function Day1TextEntry({
  textEntry,
  onChangeText,
  onSubmit,
}: Day1TextEntryProps) {
  const isEmpty = textEntry.trim().length === 0

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.textContainer}>
      <TextInput
        style={styles.textInput}
        value={textEntry}
        onChangeText={onChangeText}
        placeholder={PLACEHOLDER_TEXT}
        placeholderTextColor={COLORS.textTertiary}
        multiline
        textAlignVertical="top"
        maxLength={2000}
      />
      <TouchableOpacity
        style={[styles.textSubmit, isEmpty && styles.textSubmitDisabled]}
        onPress={onSubmit}
        disabled={isEmpty}
        activeOpacity={0.8}
      >
        <Text style={styles.textSubmitLabel}>完成</Text>
      </TouchableOpacity>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    minHeight: 200,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.text,
    ...SHADOWS.sm,
  },
  textSubmit: {
    marginTop: SPACING.lg,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  textSubmitDisabled: {
    backgroundColor: COLORS.border,
  },
  textSubmitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day1TextEntry
