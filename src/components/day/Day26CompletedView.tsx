import React from 'react'
import { Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Constants ─────────────────────────────────────────────────────

const COMPLETION_TEXT = '你不需要等别人来满足你'

// ─── Component ─────────────────────────────────────────────────────

const Day26CompletedView = React.memo(function Day26CompletedView() {
  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
      <Text style={styles.emoji}>🎁</Text>
      <Text style={styles.text}>{COMPLETION_TEXT}</Text>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.xl,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day26CompletedView
