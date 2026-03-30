import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { COLORS, SPACING } from '@/constants/theme'
import { COMPLETION_TEXT } from './Day4Types'

// Rendered after the user finishes the declutter flow
const Day4CompletedView = React.memo(function Day4CompletedView() {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
        <Feather name="home" size={48} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.text}>{COMPLETION_TEXT}</Text>
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
  },
  icon: {
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

export default Day4CompletedView
