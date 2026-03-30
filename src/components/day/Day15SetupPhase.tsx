import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Animated, {
  FadeIn,
  SlideInDown,
  FadeInUp,
} from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { NEW_RITUALS } from './Day15Constants'
import { sharedStyles } from './Day15Constants'

// ─── Setup phase: choose old habit & new ritual ───────────────────

interface Day15SetupPhaseProps {
  readonly oldRitual: string
  readonly selectedRitual: string | null
  readonly customRitual: string
  readonly canStartExecution: boolean
  readonly onChangeOldRitual: (text: string) => void
  readonly onSelectRitual: (id: string) => void
  readonly onChangeCustomRitual: (text: string) => void
  readonly onStartExecution: () => void
}

const Day15SetupPhase = React.memo(function Day15SetupPhase({
  oldRitual,
  selectedRitual,
  customRitual,
  canStartExecution,
  onChangeOldRitual,
  onSelectRitual,
  onChangeCustomRitual,
  onStartExecution,
}: Day15SetupPhaseProps) {
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
        {/* Guidance */}
        <Animated.Text entering={FadeIn.delay(200).duration(600)} style={styles.guidanceText}>
          用新仪式替代旧习惯
        </Animated.Text>

        {/* Old ritual input */}
        <Animated.View entering={SlideInDown.delay(400).duration(500)}>
          <Text style={styles.sectionLabel}>要替代的旧习惯</Text>
          <TextInput
            style={styles.oldRitualInput}
            value={oldRitual}
            onChangeText={onChangeOldRitual}
            placeholder={'如"睡前给TA发晚安"'}
            placeholderTextColor={COLORS.textTertiary}
            maxLength={100}
          />
        </Animated.View>

        {/* New ritual selection */}
        <Animated.View entering={FadeIn.delay(600).duration(400)}>
          <Text style={styles.sectionLabel}>新仪式推荐</Text>
          <View style={styles.ritualGrid}>
            {NEW_RITUALS.map((ritual, index) => (
              <Animated.View key={ritual.id} entering={FadeInUp.delay(700 + index * 100).duration(400)}>
                <TouchableOpacity
                  style={[
                    styles.ritualCard,
                    selectedRitual === ritual.id && styles.ritualCardActive,
                  ]}
                  onPress={() => onSelectRitual(ritual.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.ritualIcon}>{ritual.icon}</Text>
                  <Text
                    style={[
                      styles.ritualTitle,
                      selectedRitual === ritual.id && styles.ritualTitleActive,
                    ]}
                  >
                    {ritual.title}
                  </Text>
                  <Text style={styles.ritualDescription}>{ritual.description}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Custom ritual input */}
        {selectedRitual === 'custom' && (
          <Animated.View entering={FadeIn.duration(300)}>
            <TextInput
              style={styles.customInput}
              value={customRitual}
              onChangeText={onChangeCustomRitual}
              placeholder="描述你的新仪式…"
              placeholderTextColor={COLORS.textTertiary}
              maxLength={100}
            />
          </Animated.View>
        )}

        {/* Start execution button */}
        {canStartExecution && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.startWrapper}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={onStartExecution}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>开始执行</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

const styles = StyleSheet.create({
  guidanceText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING['3xl'],
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  oldRitualInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  ritualGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  ritualCard: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  ritualCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F5FA',
  },
  ritualIcon: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  ritualTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  ritualTitleActive: {
    color: COLORS.primary,
  },
  ritualDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  customInput: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  startWrapper: {
    marginTop: SPACING['3xl'],
    alignItems: 'center',
  },
  startButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['4xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day15SetupPhase
