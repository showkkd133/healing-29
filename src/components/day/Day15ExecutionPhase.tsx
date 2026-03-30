import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { FEELINGS, type FeelingOption } from './Day15Constants'
import { sharedStyles } from './Day15Constants'
import Day15StickerPicker from './Day15StickerPicker'

// ─── Execution phase: perform the new ritual ──────────────────────

interface Day15ExecutionPhaseProps {
  readonly oldRitual: string
  readonly newRitualName: string
  readonly selectedRitual: string
  readonly selectedSticker: string | null
  readonly selectedFeeling: string | null
  readonly reminderSet: boolean
  readonly onSelectSticker: (sticker: string) => void
  readonly onSelectFeeling: (id: string) => void
  readonly onToggleReminder: (value: boolean) => void
  readonly onComplete: () => void
}

const Day15ExecutionPhase = React.memo(function Day15ExecutionPhase({
  oldRitual,
  newRitualName,
  selectedRitual,
  selectedSticker,
  selectedFeeling,
  reminderSet,
  onSelectSticker,
  onSelectFeeling,
  onToggleReminder,
  onComplete,
}: Day15ExecutionPhaseProps) {
  return (
    <KeyboardAvoidingView
      style={sharedStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={sharedStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={styles.executionTitle}>执行新仪式</Text>
          <View style={styles.ritualSwapCard}>
            <Text style={styles.swapOld}>{oldRitual}</Text>
            <Text style={styles.swapArrow}>→</Text>
            <Text style={styles.swapNew}>{newRitualName}</Text>
          </View>
        </Animated.View>

        {/* Execution assistance based on selection */}
        {selectedRitual === 'bestie' && (
          <Day15StickerPicker visible onSelect={onSelectSticker} />
        )}

        {selectedRitual === 'bestie' && selectedSticker && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.stickerSent}>
            <Text style={styles.stickerSentText}>
              已选择 {selectedSticker}，发给闺蜜吧！
            </Text>
          </Animated.View>
        )}

        {selectedRitual === 'journal' && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.journalHint}>
            <Text style={styles.journalHintText}>写下今天的三行日记：</Text>
            <TextInput
              style={styles.journalInput}
              placeholder="今天发生了…&#10;我感受到…&#10;明天我想…"
              placeholderTextColor={COLORS.textTertiary}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </Animated.View>
        )}

        {selectedRitual === 'podcast' && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.podcastHint}>
            <Text style={styles.podcastHintIcon}>🎧</Text>
            <Text style={styles.podcastHintText}>
              打开你喜欢的播客App，选一期感兴趣的内容，设定好睡眠定时器
            </Text>
          </Animated.View>
        )}

        {selectedRitual === 'custom' && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.customHint}>
            <Text style={styles.customHintText}>
              现在就去执行你的新仪式吧，完成后回来记录感受
            </Text>
          </Animated.View>
        )}

        {/* Feeling selection */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)}>
          <Text style={styles.feelingLabel}>执行感受</Text>
          <View style={styles.feelingRow}>
            {FEELINGS.map((feeling: FeelingOption) => (
              <TouchableOpacity
                key={feeling.id}
                style={[
                  styles.feelingButton,
                  selectedFeeling === feeling.id && styles.feelingButtonActive,
                ]}
                onPress={() => onSelectFeeling(feeling.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.feelingText,
                    selectedFeeling === feeling.id && styles.feelingTextActive,
                  ]}
                >
                  {feeling.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Reminder toggle */}
        <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.reminderRow}>
          <Text style={styles.reminderLabel}>设置每日提醒</Text>
          <Switch
            value={reminderSet}
            onValueChange={onToggleReminder}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.card}
          />
        </Animated.View>

        {/* Complete button */}
        {selectedFeeling && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.completeWrapper}>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={onComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>完成替代仪式</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

const styles = StyleSheet.create({
  executionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  ritualSwapCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.md,
  },
  swapOld: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    textDecorationLine: 'line-through',
  },
  swapArrow: {
    fontSize: 20,
    color: COLORS.accent,
    fontWeight: '700',
  },
  swapNew: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  stickerSent: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.success + '15',
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  stickerSentText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '500',
  },
  journalHint: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.sm,
  },
  journalHintText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  journalInput: {
    minHeight: 100,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
  },
  podcastHint: {
    marginTop: SPACING.lg,
    padding: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  podcastHintIcon: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  podcastHintText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  customHint: {
    marginTop: SPACING.lg,
    padding: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  customHintText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  feelingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING['2xl'],
    marginBottom: SPACING.md,
  },
  feelingRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  feelingButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  feelingButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  feelingText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  feelingTextActive: {
    color: COLORS.card,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
  },
  reminderLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  completeWrapper: {
    marginTop: SPACING['3xl'],
    alignItems: 'center',
  },
  completeButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['4xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day15ExecutionPhase
