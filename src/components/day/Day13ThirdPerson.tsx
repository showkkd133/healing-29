import React, { useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import Animated, {
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ZenButton } from '@/components/ui/ZenButton'
import ReflectionSection from './Day13ReflectionSection'

interface Day13ThirdPersonProps {
  readonly onComplete: (data: {
    readonly narrativeLength: number
    readonly emotionKeywords: readonly string[]
    readonly reflectionAnswer: string
  }) => void
}

const EMOTION_DICTIONARY: readonly string[] = [
  '愤怒', '伤心', '失望', '委屈', '无奈', '心痛', '难过',
  '焦虑', '害怕', '孤独', '后悔', '内疚', '嫉妒', '不甘',
  '疲惫', '麻木', '冷漠', '挣扎', '纠结', '迷茫',
  '释然', '平静', '感激', '温暖', '思念', '不舍', '期待',
  '崩溃', '绝望', '压抑', '沉默', '哭', '吵', '冲突',
  '分手', '离开', '放手', '错过', '遗憾', '心寒',
] as const

const MIN_NARRATIVE_LENGTH = 50

const Day13ThirdPerson = React.memo(function Day13ThirdPerson({
  onComplete,
}: Day13ThirdPersonProps) {
  const [narrative, setNarrative] = useState('')
  const [showWordCloud, setShowWordCloud] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Extract emotion keywords from narrative text
  const emotionKeywords = useMemo(() => {
    if (narrative.length < MIN_NARRATIVE_LENGTH) return []
    return EMOTION_DICTIONARY.filter((word) => narrative.includes(word))
  }, [narrative])

  const wordCount = useMemo(() => narrative.trim().length, [narrative])
  const canShowCloud = wordCount >= MIN_NARRATIVE_LENGTH

  const handleAiAssist = useCallback(() => {
    Alert.alert('提示', 'AI功能即将上线', [{ text: '好的' }])
  }, [])

  const handleShowWordCloud = useCallback(() => {
    if (!canShowCloud) return
    setShowWordCloud(true)
  }, [canShowCloud])

  const handleReflectionComplete = useCallback((reflectionAnswer: string) => {
    setCompleted(true)
    onComplete({
      narrativeLength: wordCount,
      emotionKeywords,
      reflectionAnswer,
    })
  }, [wordCount, emotionKeywords, onComplete])

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Feather name="search" size={48} color={COLORS.primary} style={styles.completedIcon} />
          <Text style={styles.completedText}>
            距离产生的不只是美，还有 clarity
          </Text>
        </Animated.View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Guidance */}
        <Animated.Text entering={FadeIn.delay(200).duration(600)} style={styles.guidanceText}>
          像旁观者一样描述最后一次冲突
        </Animated.Text>
        <Animated.Text entering={FadeIn.delay(400).duration(400)} style={styles.guidanceSubtext}>
          用"TA"代替"我"和对方的名字，像在讲别人的故事
        </Animated.Text>

        {/* Narrative input */}
        <Animated.View entering={SlideInDown.delay(600).duration(500)}>
          <TextInput
            style={styles.narrativeInput}
            value={narrative}
            onChangeText={setNarrative}
            placeholder="TA说…然后另一个人…最后TA们…"
            placeholderTextColor={COLORS.textTertiary}
            multiline
            textAlignVertical="top"
            maxLength={5000}
          />

          <View style={styles.inputFooter}>
            <Text style={styles.wordCountText}>{wordCount} 字</Text>
            <ZenButton
              variant="outline"
              size="sm"
              title="帮我组织语言"
              rightIcon="zap"
              onPress={handleAiAssist}
            />
          </View>
        </Animated.View>

        {/* Show word cloud button */}
        {canShowCloud && !showWordCloud && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.showCloudWrapper}>
            <ZenButton
              title="完成叙事，查看情感词云"
              onPress={handleShowWordCloud}
              fullWidth
            />
          </Animated.View>
        )}

        {/* Word cloud + reflection */}
        {showWordCloud && (
          <ReflectionSection
            emotionKeywords={emotionKeywords}
            onComplete={handleReflectionComplete}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  scrollContent: {
    paddingBottom: SPACING['5xl'],
  },
  guidanceText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: SPACING.md,
  },
  guidanceSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING['3xl'],
  },
  narrativeInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    minHeight: 220,
    fontSize: 16,
    lineHeight: 28,
    color: COLORS.text,
    ...SHADOWS.sm,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  wordCountText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  showCloudWrapper: {
    marginTop: SPACING['2xl'],
    alignItems: 'center',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    marginBottom: SPACING.xl,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day13ThirdPerson
