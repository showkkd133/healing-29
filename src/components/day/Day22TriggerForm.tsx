import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'
import {
  TRIGGER_TYPES,
  BODY_RESPONSES,
  COPING_STRATEGIES,
  type TriggerEntry,
} from './Day22Constants'
import Day22EffectivenessPicker from './Day22EffectivenessPicker'

// ─── Props ────────────────────────────────────────────────────────

interface Day22TriggerFormProps {
  readonly onAdd: (trigger: TriggerEntry) => void
}

// ─── Component ────────────────────────────────────────────────────

const Day22TriggerForm = React.memo(function Day22TriggerForm({
  onAdd,
}: Day22TriggerFormProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [triggerName, setTriggerName] = useState('')
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null)
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
  const [effectiveness, setEffectiveness] = useState(3)

  const canAddTrigger =
    selectedType !== null &&
    triggerName.trim().length > 0 &&
    selectedResponse !== null &&
    selectedStrategy !== null

  const resetForm = useCallback(() => {
    setSelectedType(null)
    setTriggerName('')
    setSelectedResponse(null)
    setSelectedStrategy(null)
    setEffectiveness(3)
  }, [])

  const handleAddTrigger = useCallback(async () => {
    if (!canAddTrigger || !selectedType || !selectedResponse || !selectedStrategy) return

    const newTrigger: TriggerEntry = {
      type: selectedType,
      name: triggerName.trim(),
      response: selectedResponse,
      strategy: selectedStrategy,
      effectiveness,
    }
    onAdd(newTrigger)
    resetForm()

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
  }, [canAddTrigger, selectedType, triggerName, selectedResponse, selectedStrategy, effectiveness, resetForm, onAdd])

  const handleSelectType = useCallback(async (typeId: string) => {
    setSelectedType(typeId)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleSelectResponse = useCallback(async (responseId: string) => {
    setSelectedResponse(responseId)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleSelectStrategy = useCallback(async (strategyId: string) => {
    setSelectedStrategy(strategyId)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.formSection}>
      {/* Trigger type */}
      <Text style={styles.sectionLabel}>触发类型</Text>
      <View style={styles.typeGrid}>
        {TRIGGER_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeButton,
              selectedType === type.id && styles.typeButtonActive,
            ]}
            onPress={() => handleSelectType(type.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.typeEmoji}>{type.emoji}</Text>
            <Text
              style={[
                styles.typeLabel,
                selectedType === type.id && styles.typeLabelActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trigger name */}
      <Text style={styles.sectionLabel}>给这个触发点起个名字</Text>
      <TextInput
        style={styles.textInput}
        value={triggerName}
        onChangeText={setTriggerName}
        placeholder={'如"地铁站陷阱""雨天模式"'}
        placeholderTextColor={COLORS.textTertiary}
        maxLength={30}
      />

      {/* Body response */}
      <Text style={styles.sectionLabel}>生理反应</Text>
      <View style={styles.optionGrid}>
        {BODY_RESPONSES.map((resp) => (
          <TouchableOpacity
            key={resp.id}
            style={[
              styles.optionButton,
              selectedResponse === resp.id && styles.optionButtonActive,
            ]}
            onPress={() => handleSelectResponse(resp.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionEmoji}>{resp.emoji}</Text>
            <Text
              style={[
                styles.optionLabel,
                selectedResponse === resp.id && styles.optionLabelActive,
              ]}
            >
              {resp.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Coping strategy */}
      <Text style={styles.sectionLabel}>应对策略</Text>
      <View style={styles.optionGrid}>
        {COPING_STRATEGIES.map((strat) => (
          <TouchableOpacity
            key={strat.id}
            style={[
              styles.optionButton,
              selectedStrategy === strat.id && styles.optionButtonActive,
            ]}
            onPress={() => handleSelectStrategy(strat.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionEmoji}>{strat.emoji}</Text>
            <Text
              style={[
                styles.optionLabel,
                selectedStrategy === strat.id && styles.optionLabelActive,
              ]}
            >
              {strat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Effectiveness */}
      <Day22EffectivenessPicker value={effectiveness} onChange={setEffectiveness} />

      {/* Add button */}
      <TouchableOpacity
        style={[styles.addButton, !canAddTrigger && styles.addButtonDisabled]}
        onPress={handleAddTrigger}
        disabled={!canAddTrigger}
        activeOpacity={0.8}
      >
        <Text style={[styles.addButtonText, !canAddTrigger && styles.addButtonTextDisabled]}>
          添加触发点
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  formSection: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },

  // Trigger type grid
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  typeButton: {
    width: '30%',
    flexGrow: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  typeLabelActive: {
    color: COLORS.card,
  },

  // Text input
  textInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Option grid (body responses + coping strategies)
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionEmoji: {
    fontSize: 16,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  optionLabelActive: {
    color: COLORS.card,
  },

  // Add button
  addButton: {
    marginTop: SPACING['3xl'],
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  addButtonTextDisabled: {
    color: COLORS.textTertiary,
  },
})

export default Day22TriggerForm
