import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day19CompletedScreenProps {
  readonly finalDecision: string | null
}

// ─── Component ─────────────────────────────────────────────────────

const Day19CompletedScreen = React.memo(function Day19CompletedScreen({
  finalDecision,
}: Day19CompletedScreenProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>🛡️</Text>
        <Text style={styles.completedText}>
          {finalDecision === 'passed'
            ? '这个冲动过去了，你很棒'
            : '建议先发给自己，等明天再决定'}
        </Text>
      </Animated.View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING['3xl'],
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
  },
})

export default Day19CompletedScreen
