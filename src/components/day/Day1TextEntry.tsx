import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/constants/theme'
import PoetryInput from '@/components/shared/PoetryInput'

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
    <Animated.View entering={FadeIn.duration(800)} style={styles.textContainer}>
      <PoetryInput
        style={styles.textInput}
        value={textEntry}
        onChangeText={onChangeText}
        placeholder={PLACEHOLDER_TEXT}
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
    paddingTop: SPACING.xl,
  },
  textInput: {
    minHeight: 240,
    fontSize: 17,
    lineHeight: 30,
    color: COLORS.text,
  },
  textSubmit: {
    marginTop: SPACING['4xl'],
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    opacity: 0.9,
  },
  textSubmitDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.4,
  },
  textSubmitLabel: {
    fontSize: 16,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.card,
    letterSpacing: 1,
  },
})

export default Day1TextEntry

