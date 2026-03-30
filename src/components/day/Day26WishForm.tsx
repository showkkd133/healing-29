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
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { WISH_TYPES, PLAN_OPTIONS, SLIDER_LABELS, GUIDANCE_TEXT } from './Day26Constants'
import Day26SliderRow from './Day26SliderRow'

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
        <Animated.Text entering={FadeIn.delay(200).duration(500)} style={styles.guidanceText}>
          {GUIDANCE_TEXT}
        </Animated.Text>

        {/* Wish type tabs */}
        <Animated.View entering={FadeIn.delay(400).duration(400)} style={styles.tabRow}>
          {WISH_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.tab, selectedType === type.id && styles.tabActive]}
              onPress={() => onSelectType(type.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabEmoji}>{type.emoji}</Text>
              <Text style={[styles.tabLabel, selectedType === type.id && styles.tabLabelActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Wish input */}
        {selectedType !== null && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.sectionLabel}>你想做什么？</Text>
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
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.sectionLabel}>可行性评估</Text>
            <View style={styles.sliderCard}>
              {SLIDER_LABELS.map((slider) => (
                <Day26SliderRow
                  key={slider.id}
                  label={slider.label}
                  value={feasibility[slider.id as keyof typeof feasibility]}
                  onChange={(val) => onFeasibilityChange(slider.id, val)}
                />
              ))}
              <Text style={styles.avgText}>综合可行性：{avgFeasibility}/5</Text>
            </View>
          </Animated.View>
        )}

        {/* Plan selection */}
        {wish.trim().length > 0 && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.sectionLabel}>执行计划</Text>
            <View style={styles.planRow}>
              {PLAN_OPTIONS.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[styles.planButton, selectedPlan === plan.id && styles.planButtonActive]}
                  onPress={() => onSelectPlan(plan.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.planText, selectedPlan === plan.id && styles.planTextActive]}
                  >
                    {plan.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Execution record */}
        {selectedPlan !== null && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.sectionLabel}>执行记录（可选）</Text>
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

            {/* Photo placeholder */}
            <TouchableOpacity style={styles.photoButton} activeOpacity={0.7}>
              <Text style={styles.photoEmoji}>📷</Text>
              <Text style={styles.photoText}>拍照记录</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Generate certificate */}
        <TouchableOpacity
          style={[styles.primaryButton, !canComplete && styles.primaryButtonDisabled]}
          onPress={onShowCertificate}
          disabled={!canComplete}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.primaryButtonText, !canComplete && styles.primaryButtonTextDisabled]}
          >
            生成自我礼物证书
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING['5xl'],
  },
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: SPACING['3xl'],
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  tabRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabEmoji: {
    fontSize: 20,
    marginBottom: SPACING.xs,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
  },
  tabLabelActive: {
    color: COLORS.card,
  },
  textInput: {
    minHeight: 80,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
    ...SHADOWS.sm,
  },
  sliderCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  avgText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  planRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  planButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  planButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  planText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  planTextActive: {
    color: COLORS.card,
  },
  photoButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  photoEmoji: {
    fontSize: 20,
  },
  photoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  primaryButton: {
    marginTop: SPACING['3xl'],
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  primaryButtonTextDisabled: {
    color: COLORS.textTertiary,
  },
})

export default Day26WishForm
