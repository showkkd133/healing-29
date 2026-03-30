import React from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { WISH_TYPES, PLAN_OPTIONS, SLIDER_LABELS, GUIDANCE_TEXT } from './Day26Constants'
import Day26SliderRow from './Day26SliderRow'
import { ZenButton } from '../ui/ZenButton'
import { ZenIconButton } from '../ui/ZenIconButton'
import { ZenTypography } from '../ui/ZenTypography'
import { useHaptic } from '@/hooks/useHaptic'

// ─── Props ─────────────────────────────────────────────────────────

interface Day26WishFormProps {
  readonly selectedType: string | null
  readonly wish: string
  readonly feasibility: { readonly time: number; readonly money: number; readonly energy: number }
  readonly avgFeasibility: number
  readonly selectedPlan: string | null
  readonly executionNote: string
  readonly canComplete: boolean
  readonly onSelectType: (typeId: string) => void
  readonly onChangeWish: (text: string) => void
  readonly onFeasibilityChange: (key: string, value: number) => void
  readonly onSelectPlan: (planId: string) => void
  readonly onChangeExecutionNote: (text: string) => void
  readonly onShowCertificate: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day26WishForm = React.memo(function Day26WishForm({
  selectedType,
  wish,
  feasibility,
  avgFeasibility,
  selectedPlan,
  executionNote,
  canComplete,
  onSelectType,
  onChangeWish,
  onFeasibilityChange,
  onSelectPlan,
  onChangeExecutionNote,
  onShowCertificate,
}: Day26WishFormProps) {
  const haptic = useHaptic();

  const handleSelectType = (id: string) => {
    haptic.light();
    onSelectType(id);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeIn.delay(200).duration(600)}>
          <ZenTypography variant="medium" size="lg" color="text" align="center" style={styles.guidanceText}>
            {GUIDANCE_TEXT}
          </ZenTypography>
        </Animated.View>

        {/* Wish type tabs */}
        <Animated.View entering={FadeIn.delay(400).duration(400)} style={styles.tabRow}>
          {WISH_TYPES.map((type) => (
            <View key={type.id} style={styles.tabWrapper}>
              <ZenIconButton
                icon={type.icon}
                size={56}
                backgroundColor={selectedType === type.id ? COLORS.primary : COLORS.card}
                color={selectedType === type.id ? COLORS.white : COLORS.textTertiary}
                onPress={() => handleSelectType(type.id)}
                style={styles.iconTab}
              />
              <ZenTypography 
                size="xs" 
                variant={selectedType === type.id ? 'bold' : 'medium'}
                color={selectedType === type.id ? 'primary' : 'textTertiary'}
                style={styles.tabLabel}
              >
                {type.label}
              </ZenTypography>
            </View>
          ))}
        </Animated.View>

        {/* Wish input */}
        {selectedType !== null && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <ZenTypography variant="bold" size="sm" color="text" style={styles.sectionLabel}>
              你想做什么？
            </ZenTypography>
            <TextInput
              style={styles.textInput}
              value={wish}
              onChangeText={onChangeWish}
              placeholder="描述你的愿望..."
              placeholderTextColor={COLORS.textTertiary}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </Animated.View>
        )}

        {/* Feasibility sliders */}
        {wish.trim().length > 0 && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <ZenTypography variant="bold" size="sm" color="text" style={styles.sectionLabel}>
              可行性评估
            </ZenTypography>
            <View style={styles.sliderCard}>
              {SLIDER_LABELS.map((slider) => (
                <Day26SliderRow
                  key={slider.id}
                  label={slider.label}
                  value={feasibility[slider.id as keyof typeof feasibility]}
                  onChange={(val) => onFeasibilityChange(slider.id, val)}
                />
              ))}
              <View style={styles.avgContainer}>
                <ZenTypography variant="bold" size="sm" color="primary">
                  综合可行性：{avgFeasibility}/5
                </ZenTypography>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Plan selection */}
        {wish.trim().length > 0 && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <ZenTypography variant="bold" size="sm" color="text" style={styles.sectionLabel}>
              执行计划
            </ZenTypography>
            <View style={styles.planRow}>
              {PLAN_OPTIONS.map((plan) => (
                <View key={plan.id} style={styles.planButtonWrapper}>
                  <ZenButton
                    title={plan.label}
                    variant={selectedPlan === plan.id ? 'primary' : 'outline'}
                    size="sm"
                    fullWidth
                    onPress={() => onSelectPlan(plan.id)}
                  />
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Execution record */}
        {selectedPlan !== null && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <ZenTypography variant="bold" size="sm" color="text" style={styles.sectionLabel}>
              执行记录（可选）
            </ZenTypography>
            <TextInput
              style={styles.textInput}
              value={executionNote}
              onChangeText={onChangeExecutionNote}
              placeholder="记录你的执行过程..."
              placeholderTextColor={COLORS.textTertiary}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />

            <ZenButton
              title="拍照记录"
              variant="ghost"
              size="md"
              leftIcon="camera"
              style={styles.photoButton}
              onPress={() => haptic.light()}
            />
          </Animated.View>
        )}

        {/* Generate certificate */}
        <Animated.View entering={FadeIn.delay(200)}>
          <ZenButton
            title="生成自我礼物证书"
            variant="hero"
            size="lg"
            fullWidth
            onPress={onShowCertificate}
            disabled={!canComplete}
            style={styles.primaryButton}
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING['6xl'],
    paddingHorizontal: SPACING.xl,
  },
  guidanceText: {
    lineHeight: 32,
    marginBottom: SPACING['3xl'],
    marginTop: SPACING.lg,
  },
  sectionLabel: {
    marginBottom: SPACING.md,
    marginTop: SPACING['2xl'],
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
  },
  tabWrapper: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  iconTab: {
    ...SHADOWS.sm,
  },
  tabLabel: {
    marginTop: 2,
  },
  textInput: {
    minHeight: 120,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    ...SHADOWS.md,
  },
  sliderCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  avgContainer: {
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  planRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  planButtonWrapper: {
    flex: 1,
  },
  photoButton: {
    marginTop: SPACING.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryButton: {
    marginTop: SPACING['4xl'],
  },
})

export default Day26WishForm
