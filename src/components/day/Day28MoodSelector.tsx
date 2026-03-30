import React, { useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING } from '@/constants/theme'
import { MOOD_OPTIONS } from './Day28FarewellConstants'

// ─── Props ─────────────────────────────────────────────────────────

interface Day28MoodSelectorProps {
  readonly onSelectMood: (moodId: string) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day28MoodSelector = React.memo(function Day28MoodSelector({
  onSelectMood,
}: Day28MoodSelectorProps) {
  const handlePress = useCallback(async (moodId: string) => {
    onSelectMood(moodId)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [onSelectMood])

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <Text style={styles.title}>释放后，你感觉…</Text>
      <View style={styles.grid}>
        {MOOD_OPTIONS.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={styles.button}
            onPress={() => handlePress(mood.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.label}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING['3xl'],
  },
  grid: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  button: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emoji: {
    fontSize: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
})

export default Day28MoodSelector
