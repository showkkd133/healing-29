import React, { useCallback, useState } from 'react'
import { Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInRight,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import * as Clipboard from 'expo-clipboard'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { MESSAGE_TEMPLATES } from './Day3Constants'

// ─── Props ─────────────────────────────────────────────────────────

interface Day3MessagePanelProps {
  readonly onDone: () => void
  readonly selectedId: number | null
  readonly onSelectedIdChange: (id: number | null) => void
  readonly customText: string
  readonly onCustomTextChange: (text: string) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day3MessagePanel = React.memo(function Day3MessagePanel({
  onDone,
  selectedId,
  onSelectedIdChange,
  customText,
  onCustomTextChange,
}: Day3MessagePanelProps) {
  const [copied, setCopied] = useState(false)
  const [finished, setFinished] = useState(false)

  const activeText = selectedId === -1
    ? customText
    : MESSAGE_TEMPLATES.find((t) => t.id === selectedId)?.text ?? ''

  const handleCopy = useCallback(async () => {
    if (!activeText) return
    try {
      await Clipboard.setStringAsync(activeText)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Clipboard or haptics may not be available
    }
    setCopied(true)
  }, [activeText])

  const handleFinish = useCallback(() => {
    setFinished(true)
    onDone()
  }, [onDone])

  if (finished) {
    return (
      <Animated.View entering={FadeIn.duration(800)} style={styles.finishContainer}>
        <Text style={styles.finishEmoji}>💌</Text>
        <Text style={styles.finishText}>消息已发送，TA会懂的</Text>
      </Animated.View>
    )
  }

  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.panelContainer}>
      <Text style={styles.panelTitle}>选一个文案，或者自己写</Text>

      {/* Template cards */}
      {MESSAGE_TEMPLATES.map((template, index) => (
        <Animated.View key={template.id} entering={SlideInRight.delay(index * 100).duration(400)}>
          <TouchableOpacity
            style={[styles.templateCard, selectedId === template.id && styles.templateCardActive]}
            onPress={() => onSelectedIdChange(template.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.templateNumber}>#{template.id}</Text>
            <Text style={styles.templateText}>{template.text}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}

      {/* Custom input option */}
      <Animated.View entering={SlideInRight.delay(200).duration(400)}>
        <TouchableOpacity
          style={[styles.templateCard, selectedId === -1 && styles.templateCardActive]}
          onPress={() => onSelectedIdChange(-1)}
          activeOpacity={0.8}
        >
          <Text style={styles.templateNumber}>#3</Text>
          <Text style={styles.templateText}>自己写一段...</Text>
        </TouchableOpacity>
      </Animated.View>

      {selectedId === -1 && (
        <Animated.View entering={FadeIn.duration(300)}>
          <TextInput
            style={styles.customInput}
            value={customText}
            onChangeText={onCustomTextChange}
            placeholder="写下你想说的..."
            placeholderTextColor={COLORS.textTertiary}
            multiline
            maxLength={200}
          />
        </Animated.View>
      )}

      {/* Action buttons */}
      {activeText.length > 0 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.copyButton]}
            onPress={handleCopy}
            activeOpacity={0.8}
          >
            <Text style={styles.copyButtonText}>
              {copied ? '已复制 ✓' : '一键复制'}
            </Text>
          </TouchableOpacity>
          {copied && (
            <TouchableOpacity
              style={[styles.actionButton, styles.doneButton]}
              onPress={handleFinish}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>已发送给TA</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Panel shared
  panelContainer: {
    flex: 1,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },

  // Message templates
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  templateCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F5FA',
  },
  templateNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: SPACING.md,
    width: 24,
  },
  templateText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },

  // Custom input
  customInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    minHeight: 80,
    marginTop: SPACING.sm,
    ...SHADOWS.sm,
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: COLORS.primary,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  doneButton: {
    backgroundColor: COLORS.accent,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },

  // Finish state
  finishContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xl,
  },
  finishText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day3MessagePanel
