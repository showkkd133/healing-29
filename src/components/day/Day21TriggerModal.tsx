import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

interface Day21TriggerModalProps {
  readonly visible: boolean
  readonly value: string
  readonly onChangeText: (text: string) => void
  readonly onSubmit: () => void
  readonly onClose: () => void
}

const Day21TriggerModal = React.memo(function Day21TriggerModal({
  visible,
  value,
  onChangeText,
  onSubmit,
  onClose,
}: Day21TriggerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View entering={SlideInDown.duration(300)} style={styles.content}>
          <Text style={styles.title}>低点原因</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder="是什么触发了这个情绪？"
            placeholderTextColor={COLORS.textTertiary}
            maxLength={100}
            autoFocus
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onSubmit} activeOpacity={0.8}>
              <Text style={styles.confirmText}>保存</Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
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

export default Day21TriggerModal
