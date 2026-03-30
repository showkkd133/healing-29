import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day24CompletedViewProps {
  readonly completionText: string
}

// ─── Component ─────────────────────────────────────────────────────

const Day24CompletedView = React.memo(function Day24CompletedView({
  completionText,
}: Day24CompletedViewProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>📖</Text>
        <Text style={styles.completedText}>{completionText}</Text>
      </Animated.View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
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

export default Day24CompletedView
