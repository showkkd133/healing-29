import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'
import WaxSeal from './Day10WaxSeal'

// ─── Props ─────────────────────────────────────────────────────────

interface Day10CompletedViewProps {
  readonly variant: 'sealing' | 'completed'
}

// ─── Component ─────────────────────────────────────────────────────

const Day10CompletedView = React.memo(function Day10CompletedView({
  variant,
}: Day10CompletedViewProps) {
  if (variant === 'completed') {
    return (
      <Animated.View entering={FadeIn.duration(800)} style={styles.centered}>
        <Text style={styles.emoji}>💌</Text>
        <Text style={styles.text}>未来的你会感谢现在的你</Text>
      </Animated.View>
    )
  }

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.centered}>
      <WaxSeal />
      <Text style={styles.sealingText}>正在封存你的信…</Text>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  centered: {
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
  sealingText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: SPACING.xl,
  },
})

export default Day10CompletedView
