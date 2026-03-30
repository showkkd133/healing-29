import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

interface Day18SlipModalProps {
  readonly visible: boolean
  readonly value: string
  readonly onChangeText: (text: string) => void
  readonly onCancel: () => void
  readonly onSubmit: () => void
}

// Modal for recording a slip trigger during digital silence
const Day18SlipModal = React.memo(function Day18SlipModal({
  visible,
  value,
  onChangeText,
  onCancel,
  onSubmit,
}: Day18SlipModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Animated.View entering={SlideInDown.duration(300)} style={styles.content}>
          <Text style={styles.title}>是什么触发了你？</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder="写下触发原因..."
            placeholderTextColor={COLORS.textTertiary}
            multiline
            maxLength={200}
            autoFocus
          />
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>记录</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  content: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: SPACING.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  cancelButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  cancelText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  confirmButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day18SlipModal
