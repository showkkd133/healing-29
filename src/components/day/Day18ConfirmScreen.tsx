import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'

interface Day18ConfirmScreenProps {
  readonly onConfirm: () => void
}

// Confirmation screen shown before starting digital silence
const Day18ConfirmScreen = React.memo(function Day18ConfirmScreen({
  onConfirm,
}: Day18ConfirmScreenProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.content}>
        <Text style={styles.emoji}>🔇</Text>
        <Text style={styles.title}>进入数字静默模式？</Text>
        <Text style={styles.desc}>
          暂时远离社交媒体的噪音，专注于自己
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>确认开启</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING['3xl'],
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  desc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING['3xl'],
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day18ConfirmScreen
