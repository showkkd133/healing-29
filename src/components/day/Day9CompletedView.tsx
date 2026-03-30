import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Constants ─────────────────────────────────────────────────────

const COMPLETION_TEXT = '多巴胺已到账，注意查收'

// ─── Component ─────────────────────────────────────────────────────

const Day9CompletedView = React.memo(function Day9CompletedView() {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>💊</Text>
        <Text style={styles.completedText}>{COMPLETION_TEXT}</Text>
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

export default Day9CompletedView
