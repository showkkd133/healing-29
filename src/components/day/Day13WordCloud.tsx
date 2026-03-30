import React from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Constants ────────────────────────────────────────────────────

const CLOUD_SIZES = [14, 18, 22, 26, 30, 16, 20, 24] as const
const CLOUD_COLORS = [
  COLORS.primary,
  COLORS.stageEmergency,
  COLORS.accent,
  COLORS.stageDeepHealing,
  COLORS.stageDisillusion,
  COLORS.stageRebuild,
] as const

// ─── Props ────────────────────────────────────────────────────────

interface WordCloudProps {
  readonly keywords: readonly string[]
}

// ─── Component ────────────────────────────────────────────────────

const WordCloud = React.memo(function WordCloud({ keywords }: WordCloudProps) {
  if (keywords.length === 0) return null

  return (
    <View style={styles.container}>
      <Text style={styles.title}>情感词云</Text>
      <View style={styles.cloud}>
        {keywords.map((word, index) => (
          <Animated.Text
            key={`${word}-${index}`}
            entering={FadeInUp.delay(index * 80).duration(400)}
            style={[
              styles.word,
              {
                fontSize: CLOUD_SIZES[index % CLOUD_SIZES.length],
                color: CLOUD_COLORS[index % CLOUD_COLORS.length],
              },
            ]}
          >
            {word}
          </Animated.Text>
        ))}
      </View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING['2xl'],
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  cloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  word: {
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING['2xs'],
  },
})

export default WordCloud
