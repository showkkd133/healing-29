import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Constants ─────────────────────────────────────────────────────

const COMPLETION_TEXT = '你的大脑刚建立了新的神经连接'

// ─── Component ─────────────────────────────────────────────────────

interface Day6CompletedViewProps {
  readonly containerStyle: object
}

const Day6CompletedView = React.memo(function Day6CompletedView({
  containerStyle,
}: Day6CompletedViewProps) {
  return (
    <View style={containerStyle}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>🧠</Text>
        <Text style={styles.completedText}>{COMPLETION_TEXT}</Text>
      </Animated.View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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

export default Day6CompletedView
