// Day 12 – Reaction description and tags sub-component

import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'
import { REACTIONS } from './Day12Constants'

interface Day12ReactionSectionProps {
  readonly reactionDescription: string
  readonly selectedReaction: string | null
  readonly onChangeDescription: (text: string) => void
  readonly onSelectReaction: (id: string) => void
}

const Day12ReactionSection = React.memo(function Day12ReactionSection({
  reactionDescription,
  selectedReaction,
  onChangeDescription,
  onSelectReaction,
}: Day12ReactionSectionProps) {
  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <Text style={styles.sectionLabel}>描述TA的反应</Text>
      <TextInput
        style={styles.descriptionInput}
        value={reactionDescription}
        onChangeText={onChangeDescription}
        placeholder="TA当时的表情、动作、或说的话…"
        placeholderTextColor={COLORS.textTertiary}
        multiline
        textAlignVertical="top"
        maxLength={500}
      />

      <Text style={styles.sectionLabel}>反应标签</Text>
      <View style={styles.reactionRow}>
        {REACTIONS.map((reaction) => (
          <TouchableOpacity
            key={reaction.id}
            style={[
              styles.reactionTag,
              selectedReaction === reaction.id && styles.reactionTagActive,
            ]}
            onPress={() => onSelectReaction(reaction.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
            <Text
              style={[
                styles.reactionLabel,
                selectedReaction === reaction.id && styles.reactionLabelActive,
              ]}
            >
              {reaction.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  descriptionInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    minHeight: 80,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reactionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  reactionTag: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reactionTagActive: {
    borderColor: COLORS.accent,
    backgroundColor: '#FFF8E7',
  },
  reactionEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  reactionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  reactionLabelActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
})

export default Day12ReactionSection
