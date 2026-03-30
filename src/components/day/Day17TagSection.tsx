import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day17TagSectionProps {
  readonly title: string
  readonly presets: readonly string[]
  readonly selectedTags: readonly string[]
  readonly onTagsChange: (tags: readonly string[]) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day17TagSection = React.memo(function Day17TagSection({
  title,
  presets,
  selectedTags,
  onTagsChange,
}: Day17TagSectionProps) {
  const [customInput, setCustomInput] = useState('')

  const toggleTag = useCallback(
    async (tag: string) => {
      const next = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
      onTagsChange(next)
      try {
        await Haptics.selectionAsync()
      } catch {
        // Haptics not available
      }
    },
    [selectedTags, onTagsChange],
  )

  const addCustomTag = useCallback(() => {
    const trimmed = customInput.trim()
    if (!trimmed) return
    onTagsChange([...selectedTags, trimmed])
    setCustomInput('')
  }, [customInput, selectedTags, onTagsChange])

  // Separate custom tags from presets for rendering
  const customTags = selectedTags.filter(
    (t) => !presets.includes(t),
  )

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.tagRow}>
        {presets.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, selectedTags.includes(tag) && styles.tagActive]}
            onPress={() => toggleTag(tag)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tagText,
                selectedTags.includes(tag) && styles.tagTextActive,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
        {customTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, styles.tagActive]}
            onPress={() => toggleTag(tag)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tagText, styles.tagTextActive]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.customTagRow}>
        <TextInput
          style={styles.customTagInput}
          value={customInput}
          onChangeText={setCustomInput}
          placeholder="其他自定义..."
          placeholderTextColor={COLORS.textTertiary}
          maxLength={10}
          onSubmitEditing={addCustomTag}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[
            styles.customTagAdd,
            !customInput.trim() && styles.customTagAddDisabled,
          ]}
          onPress={addCustomTag}
          disabled={!customInput.trim()}
          activeOpacity={0.7}
        >
          <Text style={styles.customTagAddText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING['2xl'],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  tag: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tagTextActive: {
    color: COLORS.card,
  },
  customTagRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  customTagInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.text,
    ...SHADOWS.sm,
  },
  customTagAdd: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTagAddDisabled: {
    backgroundColor: COLORS.border,
  },
  customTagAddText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day17TagSection
