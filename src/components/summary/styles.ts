import { StyleSheet, Dimensions } from 'react-native'
import {
  COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS,
} from '@/constants/theme'

// Chart layout constants
export const CHART_WIDTH = Dimensions.get('window').width - SPACING.lg * 4
export const CHART_HEIGHT = 160
export const CHART_PADDING = { top: 24, bottom: 28, left: 28, right: 16 }

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['5xl'],
  },

  // Celebration header
  celebrationContainer: {
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.secondary,
    opacity: 0.15,
    borderRadius: BORDER_RADIUS['2xl'],
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  celebrationTitle: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  celebrationSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.md,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  statsCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  statsValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statsLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },

  // Chart
  chartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING['2xl'],
    ...SHADOWS.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING['2xl'],
  },

  // Badge section
  badgeSection: {
    marginBottom: SPACING['2xl'],
  },
  badgeListContent: {
    gap: SPACING.md,
  },
  badgeItem: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    width: 80,
    ...SHADOWS.md,
  },
  badgeEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  badgeName: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  badgeOverflow: {
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  badgeOverflowText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textSecondary,
  },

  // Encouragement
  encouragementContainer: {
    backgroundColor: 'rgba(124, 156, 180, 0.08)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING['3xl'],
  },
  encouragementText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    lineHeight: TYPOGRAPHY.lineHeight.lg,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.fontFamily.serif,
  },

  // Action buttons
  actionContainer: {
    gap: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
})
