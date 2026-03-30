import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/constants/theme'
import PoetryInput from '@/components/shared/PoetryInput'
import {
  type LegacyEntry,
  LEGACY_CATEGORIES,
  OWNERSHIP_OPTIONS,
  GUIDANCE_TEXT,
} from './Day27Types'

// ─── Props ─────────────────────────────────────────────────────────

interface Day27LegacyFormProps {
  readonly legacies: ReadonlyArray<LegacyEntry>
  readonly selectedCategory: string
  readonly itemText: string
  readonly selectedOwnership: string | null
  readonly transformationText: string
  readonly showTransform: boolean
  readonly canAdd: boolean
  readonly onSelectCategory: (catId: string) => void
  readonly onSelectOwnership: (ownershipId: string) => void
  readonly onChangeItemText: (text: string) => void
  readonly onChangeTransformationText: (text: string) => void
  readonly onAddLegacy: () => void
  readonly onClaim: () => void
}

// ─── Category tabs ─────────────────────────────────────────────────

const CategoryTabs = React.memo(function CategoryTabs({
  selectedCategory,
  onSelectCategory,
}: {
  readonly selectedCategory: string
  readonly onSelectCategory: (catId: string) => void
}) {
  return (
    <Animated.View entering={FadeIn.delay(400).duration(400)}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoryRow}>
          {LEGACY_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryTab, selectedCategory === cat.id && styles.categoryTabActive]}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === cat.id && styles.categoryTabTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  )
})

// ─── Legacy card list for selected category ────────────────────────

const LegacyCardList = React.memo(function LegacyCardList({
  legacies,
  selectedCategory,
}: {
  readonly legacies: ReadonlyArray<LegacyEntry>
  readonly selectedCategory: string
}) {
  const filtered = legacies.filter((l) => l.category === selectedCategory)
  if (filtered.length === 0) return null

  return (
    <View style={styles.legacyList}>
      {filtered.map((legacy, index) => (
        <Animated.View
          key={index}
          entering={FadeIn.duration(300)}
          style={styles.legacyCard}
        >
          <Text style={styles.legacyItem}>{legacy.item}</Text>
          <Text style={styles.legacyOwnership}>
            {OWNERSHIP_OPTIONS.find((o) => o.id === legacy.ownership)?.label ?? ''}
          </Text>
          {legacy.transformation && (
            <Text style={styles.legacyTransform}>
              内化：{legacy.transformation}
            </Text>
          )}
        </Animated.View>
      ))}
    </View>
  )
})

// ─── Main form component ───────────────────────────────────────────

const Day27LegacyForm = React.memo(function Day27LegacyForm({
  legacies,
  selectedCategory,
  itemText,
  selectedOwnership,
  transformationText,
  showTransform,
  canAdd,
  onSelectCategory,
  onSelectOwnership,
  onChangeItemText,
  onChangeTransformationText,
  onAddLegacy,
  onClaim,
}: Day27LegacyFormProps) {
  return (
    <>
      <Animated.Text entering={FadeIn.delay(200).duration(500)} style={styles.guidanceText}>
        {GUIDANCE_TEXT}
      </Animated.Text>

      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      <LegacyCardList legacies={legacies} selectedCategory={selectedCategory} />

      {/* Add new legacy form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>遗产描述</Text>
        <PoetryInput
          value={itemText}
          onChangeText={onChangeItemText}
          placeholder="这段关系让我获得了..."
          maxLength={200}
        />

        {/* Ownership selection */}
        {itemText.trim().length > 0 && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.sectionLabel}>归属确认</Text>
            <View style={styles.ownershipRow}>
              {OWNERSHIP_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.ownershipButton,
                    selectedOwnership === opt.id && styles.ownershipButtonActive,
                  ]}
                  onPress={() => onSelectOwnership(opt.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.ownershipText,
                      selectedOwnership === opt.id && styles.ownershipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Transformation input for "given" ownership */}
        {showTransform && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.sectionLabel}>如何内化为自己的？</Text>
            <PoetryInput
              value={transformationText}
              onChangeText={onChangeTransformationText}
              placeholder="我可以..."
              maxLength={200}
            />
          </Animated.View>
        )}

        {/* Add button */}
        <TouchableOpacity
          style={[styles.addButton, !canAdd && styles.addButtonDisabled]}
          onPress={onAddLegacy}
          disabled={!canAdd}
          activeOpacity={0.8}
        >
          <Text style={[styles.addButtonText, !canAdd && styles.addButtonTextDisabled]}>
            添加遗产
          </Text>
        </TouchableOpacity>
      </View>

      {/* Claim all button */}
      {legacies.length > 0 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.claimButtonContainer}>
          <TouchableOpacity
            style={styles.claimButton}
            onPress={onClaim}
            activeOpacity={0.8}
          >
            <Text style={styles.claimButtonText}>
              确权（{legacies.length}项遗产）
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  guidanceText: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: SPACING['4xl'],
    opacity: 0.9,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textTertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    marginTop: SPACING['2xl'],
  },
  categoryRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingBottom: SPACING.md,
  },
  categoryTab: {
    paddingVertical: SPACING.xs,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryTabActive: {
    borderBottomColor: COLORS.accent,
  },
  categoryTabText: {
    fontSize: 15,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.textSecondary,
  },
  categoryTabTextActive: {
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  legacyList: {
    marginTop: SPACING.lg,
    gap: SPACING.xl,
  },
  legacyCard: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  legacyItem: {
    fontSize: 17,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  legacyOwnership: {
    fontSize: 12,
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
  },
  legacyTransform: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  formSection: {
    marginTop: SPACING.xl,
  },
  ownershipRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  ownershipButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  ownershipButtonActive: {
    borderBottomColor: COLORS.primary,
  },
  ownershipText: {
    fontSize: 14,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.textTertiary,
  },
  ownershipTextActive: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  addButton: {
    marginTop: SPACING['2xl'],
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.3,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  addButtonTextDisabled: {
    color: COLORS.textTertiary,
  },
  claimButtonContainer: {
    marginTop: SPACING['4xl'],
    marginBottom: SPACING.xl,
  },
  claimButton: {
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    opacity: 0.9,
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.card,
    letterSpacing: 1,
  },
})

export default Day27LegacyForm

