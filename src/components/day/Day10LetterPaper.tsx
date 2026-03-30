import React, { useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Animated, { SlideInDown, FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Constants ─────────────────────────────────────────────────────

const TEMPLATES = [
  '那时的我，可能正在',
  '我希望自己已经',
] as const

// ─── Props ─────────────────────────────────────────────────────────

interface Day10LetterPaperProps {
  readonly letterContent: string
  readonly onLetterChange: (text: string) => void
  readonly wordCount: number
  readonly minWordCount: number
}

// ─── Component ─────────────────────────────────────────────────────

const Day10LetterPaper = React.memo(function Day10LetterPaper({
  letterContent,
  onLetterChange,
  wordCount,
  minWordCount,
}: Day10LetterPaperProps) {
  const handleTemplatePress = useCallback(async (template: string) => {
    onLetterChange(letterContent.length === 0 ? template : letterContent)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [letterContent, onLetterChange])

  return (
    <Animated.View entering={SlideInDown.delay(400).duration(500)} style={styles.letterPaper}>
      <Text style={styles.letterHint}>描述你希望拥有的生活状态</Text>

      {/* Template buttons */}
      <View style={styles.templateRow}>
        {TEMPLATES.map((template, index) => (
          <TouchableOpacity
            key={index}
            style={styles.templateButton}
            onPress={() => handleTemplatePress(template)}
            activeOpacity={0.7}
          >
            <Text style={styles.templateText}>"{template}"</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.letterInput}
        value={letterContent}
        onChangeText={onLetterChange}
        placeholder="亲爱的未来的我…"
        placeholderTextColor={COLORS.textTertiary}
        multiline
        textAlignVertical="top"
        maxLength={5000}
      />

      <Text style={styles.wordCount}>
        {wordCount} 字{wordCount < minWordCount ? ` (还需 ${minWordCount - wordCount} 字)` : ' ✓'}
      </Text>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  letterPaper: {
    marginTop: SPACING.xl,
    backgroundColor: '#FBF8F1',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  letterHint: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  templateRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  templateButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  templateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  letterInput: {
    minHeight: 200,
    fontSize: 16,
    lineHeight: 28,
    color: COLORS.text,
    fontFamily: 'Georgia',
  },
  wordCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.sm,
  },
})

export default Day10LetterPaper
