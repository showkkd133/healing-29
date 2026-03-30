import React, { useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Types ─────────────────────────────────────────────────────────

interface BodyResponse {
  readonly key: string
  readonly emoji: string
  readonly label: string
}

interface Day9BodyResponsePhaseProps {
  readonly onSelectResponse: (key: string) => void
}

// ─── Constants ─────────────────────────────────────────────────────

const BODY_RESPONSES: readonly BodyResponse[] = [
  { key: 'hot', emoji: '🔥', label: '热' },
  { key: 'tired', emoji: '💪', label: '累' },
  { key: 'great', emoji: '😎', label: '爽' },
  { key: 'other', emoji: '🤔', label: '其他' },
] as const

// ─── Component ─────────────────────────────────────────────────────

const Day9BodyResponsePhase = React.memo(function Day9BodyResponsePhase({
  onSelectResponse,
}: Day9BodyResponsePhaseProps) {
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null)

  const handleSelectResponse = useCallback(async (key: string) => {
    setSelectedResponse(key)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleComplete = useCallback(() => {
    if (!selectedResponse) return
    onSelectResponse(selectedResponse)
  }, [selectedResponse, onSelectResponse])

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeIn.duration(500)} style={styles.sectionTitle}>
        身体感受如何？
      </Animated.Text>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.responseRow}>
        {BODY_RESPONSES.map((response) => (
          <TouchableOpacity
            key={response.key}
            style={[
              styles.responseButton,
              selectedResponse === response.key && styles.responseButtonActive,
            ]}
            onPress={() => handleSelectResponse(response.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.responseEmoji}>{response.emoji}</Text>
            <Text
              style={[
                styles.responseLabel,
                selectedResponse === response.key && styles.responseLabelActive,
              ]}
            >
              {response.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {selectedResponse && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.completeSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>完成</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  responseRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['3xl'],
  },
  responseButton: {
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 72,
    ...SHADOWS.sm,
  },
  responseButtonActive: {
    borderColor: COLORS.primary,
  },
  responseEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  responseLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  responseLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  completeSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day9BodyResponsePhase
