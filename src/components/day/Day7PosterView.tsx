// Day 7 — Poster preview with appreciation list

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

interface Day7PosterViewProps {
  readonly appreciations: readonly string[]
  readonly onComplete: () => void
}

const Day7PosterView = React.memo(function Day7PosterView({
  appreciations,
  onComplete,
}: Day7PosterViewProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn.duration(600)} style={styles.posterCard}>
        <Text style={styles.posterTitle}>我的优点</Text>
        {appreciations.map((text, index) => (
          <Animated.Text
            key={`poster-${index}`}
            entering={FadeIn.delay(index * 300).duration(500)}
            style={styles.posterItem}
          >
            {text}
          </Animated.Text>
        ))}
      </Animated.View>

      <Animated.View entering={FadeIn.delay(1200).duration(400)} style={styles.posterActions}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => {
            // Placeholder for download
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.downloadButtonText}>下载壁纸</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>完成</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  posterCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING['3xl'],
    marginHorizontal: SPACING.lg,
    marginTop: SPACING['4xl'],
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  posterTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: SPACING['2xl'],
  },
  posterItem: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: SPACING.md,
  },
  posterActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING['3xl'],
    paddingHorizontal: SPACING.lg,
  },
  downloadButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  downloadButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day7PosterView
