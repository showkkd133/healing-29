import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Constants ─────────────────────────────────────────────────────

const ENCOURAGEMENT_TEXT = '这段声音会等你，但不用急着听'

// ─── Component ─────────────────────────────────────────────────────

const Day1CompletedScreen = React.memo(function Day1CompletedScreen() {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
        <Text style={styles.encouragementEmoji}>🌙</Text>
        <Text style={styles.encouragementText}>{ENCOURAGEMENT_TEXT}</Text>
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
  encouragementEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xl,
  },
  encouragementText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day1CompletedScreen
