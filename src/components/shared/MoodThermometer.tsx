// NOTE: Not currently imported by any component — candidate for integration or removal
import React, { useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { COLORS } from '../../constants/theme'

// Emoji and label mapping for each mood level
const MOOD_MAP: Record<number, { emoji: string; label: string }> = {
  1: { emoji: '🌧️', label: '暴风雨' },
  2: { emoji: '⛈️', label: '雷阵雨' },
  3: { emoji: '🌫️', label: '大雾' },
  4: { emoji: '🌥️', label: '阴天' },
  5: { emoji: '☁️', label: '多云' },
  6: { emoji: '⛅', label: '多云转晴' },
  7: { emoji: '🌤️', label: '晴间多云' },
  8: { emoji: '☀️', label: '晴朗' },
  9: { emoji: '🌈', label: '雨后彩虹' },
  10: { emoji: '✨', label: '晴空万里' },
}

interface MoodThermometerProps {
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}

// Horizontal mood slider with emoji indicators (1-10)
const MoodThermometer = React.memo(function MoodThermometer({
  value,
  onChange,
  disabled = false,
}: MoodThermometerProps) {
  const handleSelect = useCallback(
    (score: number) => {
      if (!disabled) {
        onChange(score)
      }
    },
    [disabled, onChange]
  )

  const currentMood = MOOD_MAP[value]

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => {
          const isSelected = score === value
          return (
            <TouchableOpacity
              key={score}
              style={[
                styles.scoreItem,
                isSelected && styles.scoreItemSelected,
                disabled && styles.scoreItemDisabled,
              ]}
              onPress={() => handleSelect(score)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{MOOD_MAP[score].emoji}</Text>
              <Text
                style={[
                  styles.scoreText,
                  isSelected && styles.scoreTextSelected,
                ]}
              >
                {score}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      {currentMood && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelEmoji}>{currentMood.emoji}</Text>
          <Text style={styles.labelText}>{currentMood.label}</Text>
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  scoreItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 72,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  scoreItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
  },
  scoreItemDisabled: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 24,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scoreTextSelected: {
    color: COLORS.primary,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  labelEmoji: {
    fontSize: 20,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
})

export default MoodThermometer
