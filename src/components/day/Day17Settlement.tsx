import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'
import BalanceScale from './Day17BalanceScale'
import TearAnimation from './Day17TearAnimation'
import Day17TagSection from './Day17TagSection'
import Day17QuestionCard from './Day17QuestionCard'
import type { SelfLoveAnswer } from './Day17QuestionCard'

// ─── Props ─────────────────────────────────────────────────────────

interface Day17SettlementProps {
  readonly onComplete: (data: {
    readonly givingTags: string[]
    readonly receivingTags: string[]
    readonly selfLoveChange: string
  }) => void
}

// ─── Constants ─────────────────────────────────────────────────────

const GUIDANCE_TEXT = '不计算金钱，只计算：我是否更喜欢自己了？'
const COMPLETION_TEXT = '账目已清，不欠亦不念'

const GIVING_PRESETS = ['时间', '精力', '改变', '妥协', '等待'] as const
const RECEIVING_PRESETS = ['成长', '体验', '认知', '朋友', '技能'] as const

// ─── Main component ────────────────────────────────────────────────

const Day17Settlement = React.memo(function Day17Settlement({
  onComplete,
}: Day17SettlementProps) {
  const [givingTags, setGivingTags] = useState<readonly string[]>([])
  const [receivingTags, setReceivingTags] = useState<readonly string[]>([])
  const [selfLoveAnswer, setSelfLoveAnswer] = useState<SelfLoveAnswer | null>(null)
  const [showTear, setShowTear] = useState(false)
  const [showSaveCert, setShowSaveCert] = useState(false)
  const [completed, setCompleted] = useState(false)

  // ─── Answer selection ────────────────────────────────────────────

  const handleAnswer = useCallback((answer: SelfLoveAnswer) => {
    setSelfLoveAnswer(answer)
    setShowTear(true)
    setShowSaveCert(true)
  }, [])

  // ─── Complete ────────────────────────────────────────────────────

  const handleComplete = useCallback(() => {
    if (!selfLoveAnswer) return
    setCompleted(true)
    onComplete({
      givingTags: [...givingTags],
      receivingTags: [...receivingTags],
      selfLoveChange: selfLoveAnswer,
    })
  }, [givingTags, receivingTags, selfLoveAnswer, onComplete])

  // ─── Render: completed state ─────────────────────────────────────

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>⚖️</Text>
          <Text style={styles.completedText}>{COMPLETION_TEXT}</Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: main ────────────────────────────────────────────────

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Guidance */}
      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.guidanceText}>
        {GUIDANCE_TEXT}
      </Animated.Text>

      {/* Balance scale */}
      <Animated.View entering={FadeIn.delay(500).duration(400)}>
        <BalanceScale leftCount={givingTags.length} rightCount={receivingTags.length} />
      </Animated.View>

      {/* Giving tags */}
      <Animated.View entering={FadeInDown.delay(600).duration(400)}>
        <Day17TagSection
          title="我的付出"
          presets={[...GIVING_PRESETS]}
          selectedTags={givingTags}
          onTagsChange={setGivingTags}
        />
      </Animated.View>

      {/* Receiving tags */}
      <Animated.View entering={FadeInDown.delay(800).duration(400)}>
        <Day17TagSection
          title="我的收获"
          presets={[...RECEIVING_PRESETS]}
          selectedTags={receivingTags}
          onTagsChange={setReceivingTags}
        />
      </Animated.View>

      {/* Core question */}
      <Animated.View entering={FadeInDown.delay(1000).duration(400)}>
        <Day17QuestionCard selectedAnswer={selfLoveAnswer} onAnswer={handleAnswer} />
      </Animated.View>

      {/* Tear animation */}
      {showTear && <TearAnimation />}

      {/* Save cert / Complete */}
      {showSaveCert && (
        <Animated.View entering={FadeIn.delay(1200).duration(400)} style={styles.completeSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>保存为"已结清凭证"</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING['4xl'],
  },
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  completeSection: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedEmoji: {
    fontSize: 48,
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

export default Day17Settlement
