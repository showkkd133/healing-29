import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import Day10CompletedView from './Day10CompletedView'
import Day10LetterPaper from './Day10LetterPaper'
import Day10DeliverySelector, {
  type DeliveryOption,
  getDeliveryDate,
} from './Day10DeliverySelector'

// ─── Props ─────────────────────────────────────────────────────────

interface Day10FutureLetterProps {
  readonly onComplete: (data: {
    readonly letterContent: string
    readonly deliveryDate: string
    readonly wordCount: number
    readonly email: string
  }) => void
}

// ─── Constants ─────────────────────────────────────────────────────

const MIN_WORD_COUNT = 100

// ─── Main component ────────────────────────────────────────────────

const Day10FutureLetter = React.memo(function Day10FutureLetter({
  onComplete,
}: Day10FutureLetterProps) {
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption | null>(null)
  const [customDate, setCustomDate] = useState('')
  const [letterContent, setLetterContent] = useState('')
  const [email, setEmail] = useState('')
  const [sealed, setSealed] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Ref for seal timer cleanup to prevent state updates on unmounted component
  const sealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (sealTimerRef.current !== null) {
        clearTimeout(sealTimerRef.current)
      }
    }
  }, [])

  const wordCount = useMemo(() => letterContent.trim().length, [letterContent])
  const canSeal = wordCount >= MIN_WORD_COUNT && deliveryOption !== null && email.trim().length > 0

  const handleSelectDelivery = useCallback(async (option: DeliveryOption) => {
    setDeliveryOption(option)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleSeal = useCallback(async () => {
    if (!canSeal || !deliveryOption) return
    setSealed(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }

    // Complete after animation, store ref for cleanup
    sealTimerRef.current = setTimeout(() => {
      sealTimerRef.current = null
      setCompleted(true)
      onComplete({
        letterContent,
        deliveryDate: getDeliveryDate(deliveryOption, customDate),
        wordCount,
        email,
      })
    }, 1500)
  }, [canSeal, deliveryOption, letterContent, customDate, wordCount, email, onComplete])

  if (completed) {
    return (
      <View style={styles.container}>
        <Day10CompletedView variant="completed" />
      </View>
    )
  }

  if (sealed) {
    return (
      <View style={styles.container}>
        <Day10CompletedView variant="sealing" />
      </View>
    )
  }

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
        <Day10DeliverySelector
          deliveryOption={deliveryOption}
          onSelectDelivery={handleSelectDelivery}
          customDate={customDate}
          onCustomDateChange={setCustomDate}
        />

        <Day10LetterPaper
          letterContent={letterContent}
          onLetterChange={setLetterContent}
          wordCount={wordCount}
          minWordCount={MIN_WORD_COUNT}
        />

        {/* Email input */}
        <Animated.View entering={FadeIn.delay(600).duration(400)}>
          <Text style={styles.sectionLabel}>邮箱（到期发送）</Text>
          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={COLORS.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Animated.View>

        {/* Seal button */}
        <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.sealButtonWrapper}>
          <TouchableOpacity
            style={[styles.sealButton, !canSeal && styles.sealButtonDisabled]}
            onPress={handleSeal}
            disabled={!canSeal}
            activeOpacity={0.8}
          >
            <Text style={[styles.sealButtonText, !canSeal && styles.sealButtonTextDisabled]}>
              封存这封信
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: SPACING['5xl'] },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  emailInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sealButtonWrapper: { marginTop: SPACING['3xl'], alignItems: 'center' },
  sealButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['4xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: '#C0392B',
    ...SHADOWS.md,
  },
  sealButtonDisabled: { backgroundColor: COLORS.border },
  sealButtonText: { fontSize: 16, fontWeight: '600', color: COLORS.card },
  sealButtonTextDisabled: { color: COLORS.textTertiary },
})

export default Day10FutureLetter
