import React, { useCallback, useState } from 'react'
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'

// ─── Constants ────────────────────────────────────────────────────

const DISCOVERY_TAGS = [
  { key: 'interesting', label: '有趣的' },
  { key: 'boring', label: '无聊的' },
  { key: 'weird', label: '奇怪的' },
] as const

// ─── Props ────────────────────────────────────────────────────────

interface CheckinViewProps {
  readonly scrollContentStyle: object
  readonly onComplete: (tag: string, photoTaken: boolean) => void
}

// ─── Component ────────────────────────────────────────────────────

const CheckinView = React.memo(function CheckinView({
  scrollContentStyle,
  onComplete,
}: CheckinViewProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [photoTaken, setPhotoTaken] = useState(false)

  const handleSelectTag = useCallback(async (tag: string) => {
    setSelectedTag(tag)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handlePhotoPress = useCallback(async () => {
    setPhotoTaken(true)
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {
      // Haptics not available
    }
  }, [])

  const handleComplete = useCallback(() => {
    if (!selectedTag) return
    onComplete(selectedTag, photoTaken)
  }, [selectedTag, photoTaken, onComplete])

  return (
    <ScrollView style={styles.container} contentContainerStyle={scrollContentStyle}>
      <Animated.Text entering={FadeIn.duration(500)} style={styles.sectionTitle}>
        到达打卡
      </Animated.Text>

      <Animated.Text entering={FadeIn.delay(200).duration(400)} style={styles.sectionSubtitle}>
        这次探索感觉如何？
      </Animated.Text>

      {/* Discovery tags */}
      <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.tagRow}>
        {DISCOVERY_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag.key}
            style={[
              styles.tagChip,
              selectedTag === tag.key && styles.tagChipActive,
            ]}
            onPress={() => handleSelectTag(tag.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tagChipText,
                selectedTag === tag.key && styles.tagChipTextActive,
              ]}
            >
              {tag.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Photo upload placeholder */}
      <Animated.View entering={FadeInDown.delay(600).duration(400)}>
        <TouchableOpacity
          style={[styles.photoButton, photoTaken && styles.photoButtonTaken]}
          onPress={handlePhotoPress}
          activeOpacity={0.7}
        >
          <Text style={styles.photoIcon}>{photoTaken ? '✅' : '📷'}</Text>
          <Text style={styles.photoText}>
            {photoTaken ? '照片已记录' : '拍一张照片（可选）'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Complete button */}
      {selectedTag && (
        <Animated.View entering={FadeIn.duration(300)}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>完成</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  tagChip: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagChipText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tagChipTextActive: {
    color: COLORS.card,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING['2xl'],
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  photoButtonTaken: {
    borderColor: COLORS.success,
    borderStyle: 'solid',
  },
  photoIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  photoText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    alignSelf: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default CheckinView
