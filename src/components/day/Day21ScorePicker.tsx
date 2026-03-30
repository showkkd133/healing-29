import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { formatHour } from './Day21ChartConstants'

interface ScorePickerProps {
  readonly visible: boolean
  readonly hour: number
  readonly onSelect: (score: number) => void
  readonly onClose: () => void
}

const SCORES = Array.from({ length: 10 }, (_, i) => i + 1)

const Day21ScorePicker = React.memo(function Day21ScorePicker({
  visible,
  hour,
  onSelect,
  onClose,
}: ScorePickerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View entering={SlideInDown.duration(300)} style={styles.content}>
          <Text style={styles.title}>{formatHour(hour)} 的心情</Text>
          <Text style={styles.hint}>选择 1-10 分</Text>
          <View style={styles.scoreGrid}>
            {SCORES.map((score) => (
              <TouchableOpacity
                key={score}
                style={styles.scoreButton}
                onPress={() => onSelect(score)}
                activeOpacity={0.7}
              >
                <Text style={styles.scoreButtonText}>{score}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.cancel} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  content: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginBottom: SPACING.xl,
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  scoreButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  cancel: {
    paddingVertical: SPACING.sm,
  },
  cancelText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
})

export default Day21ScorePicker
