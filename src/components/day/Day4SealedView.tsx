import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'

interface Day4SealedViewProps {
  readonly itemCount: number
  readonly sealDate: string
  readonly onComplete: () => void
}

// Shown after items are sealed into the virtual box
const Day4SealedView = React.memo(function Day4SealedView({
  itemCount,
  sealDate,
  onComplete,
}: Day4SealedViewProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
        <Text style={styles.emoji}>🔒</Text>
        <Text style={styles.title}>已封存</Text>
        <Text style={styles.info}>
          {itemCount} 件物品已收好{'\n'}封存至 {sealDate}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>完成</Text>
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
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  info: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING['3xl'],
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day4SealedView
