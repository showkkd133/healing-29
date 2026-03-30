import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'
import { sharedStyles } from './Day15Constants'

// ─── Completed state after ritual replacement ─────────────────────

const Day15CompletedView = React.memo(function Day15CompletedView() {
  return (
    <View style={sharedStyles.container}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
        <Text style={styles.emoji}>🔄</Text>
        <Text style={styles.text}>
          神经通路正在改写，需要21次重复
        </Text>
      </Animated.View>
    </View>
  )
})

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

export default Day15CompletedView
