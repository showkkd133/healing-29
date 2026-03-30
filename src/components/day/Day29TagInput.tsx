import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'

// ─── Props ────────────────────────────────────────────────────────

interface Day29TagInputProps {
  readonly tags: ReadonlyArray<string>
  readonly placeholder: string
  readonly onAdd: (tag: string) => void
  readonly onRemove: (index: number) => void
}

// ─── Component ────────────────────────────────────────────────────

const Day29TagInput = React.memo(function Day29TagInput({
  tags,
  placeholder,
  onAdd,
  onRemove,
}: Day29TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = useCallback(() => {
    const trimmed = inputValue.trim()
    if (trimmed.length === 0) return
    onAdd(trimmed)
    setInputValue('')
  }, [inputValue, onAdd])

  return (
    <View style={styles.container}>
      <View style={styles.tagsWrap}>
        {tags.map((tag, index) => (
          <Animated.View key={`${tag}-${index}`} entering={FadeIn.duration(200)} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => onRemove(index)} activeOpacity={0.7}>
              <Text style={styles.tagRemove}>x</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          maxLength={20}
        />
        <TouchableOpacity
          style={[styles.addBtn, inputValue.trim().length === 0 && styles.addBtnDisabled]}
          onPress={handleSubmit}
          disabled={inputValue.trim().length === 0}
          activeOpacity={0.7}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.secondary,
    gap: SPACING.sm,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  tagRemove: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  addBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day29TagInput
