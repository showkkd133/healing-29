import React, { useCallback, useState } from 'react'
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import WordCloud from './Day13WordCloud'

// ─── Props ────────────────────────────────────────────────────────

interface ReflectionSectionProps {
  readonly emotionKeywords: readonly string[]
  readonly onComplete: (reflectionAnswer: string) => void
}

// ─── Component ────────────────────────────────────────────────────

const ReflectionSection = React.memo(function ReflectionSection({
  emotionKeywords,
  onComplete,
}: ReflectionSectionProps) {
  const [reflectionAnswer, setReflectionAnswer] = useState('')

  const handleComplete = useCallback(async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
    onComplete(reflectionAnswer)
  }, [reflectionAnswer, onComplete])

  return (
    <Animated.View entering={FadeIn.duration(500)}>
      <WordCloud keywords={emotionKeywords} />

      {emotionKeywords.length === 0 && (
        <Text style={styles.noKeywordsText}>
          文本中未检测到预设情感词，这也没关系
        </Text>
      )}

      {/* Reflection question */}
      <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.reflectionCard}>
        <Text style={styles.reflectionQuestion}>
          如果朋友这样描述，你会怎么看？
        </Text>
        <TextInput
          style={styles.reflectionInput}
          value={reflectionAnswer}
          onChangeText={setReflectionAnswer}
          placeholder="我可能会对TA说…"
          placeholderTextColor={COLORS.textTertiary}
          multiline
          textAlignVertical="top"
          maxLength={1000}
        />
      </Animated.View>

      {/* Privacy note */}
      <Text style={styles.privacyNote}>内容仅存储在本地</Text>

      {/* Complete button */}
      <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.completeWrapper}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.completeButtonText}>完成</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  noKeywordsText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  reflectionCard: {
    marginTop: SPACING['3xl'],
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  reflectionQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  reflectionInput: {
    minHeight: 80,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
  },
  privacyNote: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  completeWrapper: {
    marginTop: SPACING['2xl'],
    alignItems: 'center',
  },
  completeButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['4xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default ReflectionSection
