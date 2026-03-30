// Day 11 — Completed phase: final message after meltdown ends

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { COLORS, SPACING } from '@/constants/theme'

const Day11CompletedPhase = React.memo(function Day11CompletedPhase() {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
        <Feather name="check-circle" size={48} color={COLORS.success} style={styles.icon} />
        <Text style={styles.text}>
          你允许自己崩溃了，也允许自己停止
        </Text>
      </Animated.View>
    </View>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  content: {
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

export default Day11CompletedPhase
