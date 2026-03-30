import React, { useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Day1EmotionWeather, Day2SurvivalKit, Day3Companion, Day4Declutter,
  Day5NewRoute, Day6FreshExperience, Day7SelfHunt, Day8BlindBox,
  Day9BodyJoy, Day10FutureLetter, Day11MeltdownDay, Day12KindnessExperiment,
  Day13ThirdPerson, Day14RelationshipAutopsy, Day15RitualReplace,
  Day16BreakFilter, Day17Settlement, Day18DigitalSilence, Day19ImpulseLog,
  Day20CourageExperiment, Day21MoodCurve, Day22TriggerMap, Day23QuickDecision,
  Day24MemoryRewrite, Day25RegretList, Day26SelfGift, Day27Legacy,
  Day28Farewell, Day29Reborn,
} from '@/components/day'
import { getDayConfig } from '@/constants/days'
import { getStageByDay } from '@/constants/stages'
import { useUserStore } from '@/stores/userStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useBadgeStore } from '@/stores/badgeStore'
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme'
import type { DayNumber, DayCompletionPayload, EmotionIntensity, GenericDayTaskData } from '@/types'

const MAX_DAY = 29

// -- Component type --

// Each Day component has its own onComplete signature; we use DayCompletionPayload
// as a common index-signature type since the router handles all 29 variants uniformly.
type DayComponent = React.ComponentType<{ onComplete: (data: DayCompletionPayload) => void }>

// -- Component mapping for all 29 days --

const DAY_COMPONENTS: Record<number, DayComponent> = {
  1: Day1EmotionWeather as unknown as DayComponent,
  2: Day2SurvivalKit as unknown as DayComponent,
  3: Day3Companion as unknown as DayComponent,
  4: Day4Declutter as unknown as DayComponent,
  5: Day5NewRoute as unknown as DayComponent,
  6: Day6FreshExperience as unknown as DayComponent,
  7: Day7SelfHunt as unknown as DayComponent,
  8: Day8BlindBox as unknown as DayComponent,
  9: Day9BodyJoy as unknown as DayComponent,
  10: Day10FutureLetter as unknown as DayComponent,
  11: Day11MeltdownDay as unknown as DayComponent,
  12: Day12KindnessExperiment as unknown as DayComponent,
  13: Day13ThirdPerson as unknown as DayComponent,
  14: Day14RelationshipAutopsy as unknown as DayComponent,
  15: Day15RitualReplace as unknown as DayComponent,
  16: Day16BreakFilter as unknown as DayComponent,
  17: Day17Settlement as unknown as DayComponent,
  18: Day18DigitalSilence as unknown as DayComponent,
  19: Day19ImpulseLog as unknown as DayComponent,
  20: Day20CourageExperiment as unknown as DayComponent,
  21: Day21MoodCurve as unknown as DayComponent,
  22: Day22TriggerMap as unknown as DayComponent,
  23: Day23QuickDecision as unknown as DayComponent,
  24: Day24MemoryRewrite as unknown as DayComponent,
  25: Day25RegretList as unknown as DayComponent,
  26: Day26SelfGift as unknown as DayComponent,
  27: Day27Legacy as unknown as DayComponent,
  28: Day28Farewell as unknown as DayComponent,
  29: Day29Reborn as unknown as DayComponent,
}

// -- Header with pill-shaped badge and decorative line --

function DayHeader({ dayId, theme, stageColor }: { dayId: number; theme: string; stageColor: string }) {
  return (
    <View style={styles.header} accessibilityRole="header">
      <Text style={[styles.dayBadge, { backgroundColor: stageColor, color: COLORS.white }]}>
        Day {dayId}
      </Text>
      <Text style={styles.dayTheme}>{theme}</Text>
      <View style={[styles.themeDecorLine, { backgroundColor: stageColor }]} />
    </View>
  )
}

// -- Guidance text block with left accent border --

function GuidanceBlock({ text, stageColor }: { text: string; stageColor: string }) {
  return (
    <View
      style={[
        styles.guidanceContainer,
        { backgroundColor: `${stageColor}0A`, borderLeftColor: stageColor },
      ]}
      accessibilityRole="text"
    >
      <Text style={styles.guidanceText}>{text}</Text>
    </View>
  )
}

// -- Locked content placeholder with unlock hint --

function LockedContent({ dayId, daysUntilUnlock }: { dayId: number; daysUntilUnlock: number }) {
  return (
    <View style={styles.lockedContainer} accessibilityLabel={`第${dayId}天尚未解锁`}>
      <Text style={styles.lockedIconSmall}>🔒</Text>
      <Text style={styles.lockedTitle}>Day {dayId} 即将解锁</Text>
      <Text style={styles.lockedDescription}>
        请先完成之前的任务，这一天的内容会在合适的时候为你开启。
      </Text>
      {daysUntilUnlock > 0 && (
        <Text style={styles.unlockHint}>
          还有 {daysUntilUnlock} 天解锁
        </Text>
      )}
    </View>
  )
}

// -- Already-completed placeholder with elegant checkmark --

function CompletedContent({ dayId }: { dayId: number }) {
  return (
    <View style={styles.lockedContainer} accessibilityLabel={`第${dayId}天已完成`}>
      <View style={styles.completedCircle}>
        <Text style={styles.completedCheck}>✓</Text>
      </View>
      <Text style={styles.lockedTitle}>Day {dayId} 已完成</Text>
      <Text style={styles.lockedDescription}>
        你已经完成了这一天的任务，继续前行吧。
      </Text>
    </View>
  )
}

// -- Helpers: extract fields from onComplete data --

function extractMoodScore(data: DayCompletionPayload): EmotionIntensity {
  if (typeof data.moodScore === 'number') {
    const raw = data.moodScore
    if (raw >= 1 && raw <= 10) return raw as EmotionIntensity
  }
  return 5 as EmotionIntensity
}

function extractTaskData(data: DayCompletionPayload): GenericDayTaskData {
  const record = data as Record<string, unknown>
  return {
    journalEntry: typeof record.journalEntry === 'string' ? record.journalEntry : '',
    exerciseCompleted: typeof record.exerciseCompleted === 'boolean' ? record.exerciseCompleted : false,
    meditationMinutes: typeof record.meditationMinutes === 'number' ? record.meditationMinutes : 0,
    gratitudeItems: Array.isArray(record.gratitudeItems) ? record.gratitudeItems as ReadonlyArray<string> : [],
    reflectionNotes: typeof record.reflectionNotes === 'string' ? record.reflectionNotes : '',
  }
}

// -- Main screen --

export default function DayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const currentDay = useUserStore((s) => s.currentDay)
  const advanceDay = useUserStore((s) => s.advanceDay)
  const recordEmotion = useEmotionStore((s) => s.recordEmotion)
  const startDay = useJourneyStore((s) => s.startDay)
  const updateDayData = useJourneyStore((s) => s.updateDayData)
  const completeDay = useJourneyStore((s) => s.completeDay)
  const dailyLogs = useJourneyStore((s) => s.dailyLogs)
  const checkAndAward = useBadgeStore((s) => s.checkAndAward)

  const dayId = Number(id) || 1
  const config = getDayConfig(dayId)
  const theme = config?.theme ?? `第 ${dayId} 天`
  const guidanceText = config?.guidanceText ?? ''
  const isLocked = dayId > currentDay
  const isAlreadyCompleted = dayId in dailyLogs
  const daysUntilUnlock = isLocked ? dayId - currentDay : 0

  // Resolve stage color for visual theming
  const stageColor = useMemo(() => {
    const stage = getStageByDay(dayId)
    return stage?.color ?? COLORS.primary
  }, [dayId])

  const DayComponent = DAY_COMPONENTS[dayId]

  // Mark day as started when page loads
  useEffect(() => {
    if (!isLocked) {
      startDay(dayId as DayNumber)
    }
  }, [dayId, isLocked, startDay])

  const handleComplete = (data: DayCompletionPayload) => {
    const day = dayId as DayNumber
    const moodScore = extractMoodScore(data)
    const taskData = extractTaskData(data)

    // 1. Record emotion entry
    recordEmotion(day, moodScore, [])

    // 2. Update day data with actual user input BEFORE completing
    updateDayData(taskData)

    // 3. Complete day in journey store (saves currentDayData which now has real data)
    completeDay(day, moodScore)

    // 4. Check and award badges based on task data
    checkAndAward(day, taskData)

    // 5. Advance user to next day (skip on final day — no Day 30)
    if (dayId < MAX_DAY) {
      advanceDay()
    }

    // Navigate to summary on final day, otherwise go back
    if (dayId === MAX_DAY) {
      router.replace('/summary')
    } else {
      router.back()
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 44 }]}>
      {/* Top decorative gradient using stage color */}
      <LinearGradient
        colors={[`${stageColor}18`, 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DayHeader dayId={dayId} theme={theme} stageColor={stageColor} />

        {guidanceText.length > 0 && (
          <GuidanceBlock text={guidanceText} stageColor={stageColor} />
        )}

        {isLocked ? (
          <LockedContent dayId={dayId} daysUntilUnlock={daysUntilUnlock} />
        ) : isAlreadyCompleted ? (
          <CompletedContent dayId={dayId} />
        ) : (
          DayComponent && <DayComponent onComplete={handleComplete} />
        )}
      </ScrollView>
    </View>
  )
}

// -- Styles --

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Top decorative gradient overlay
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 0,
  },
  scrollContent: {
    paddingHorizontal: SPACING['2xl'],
    paddingBottom: SPACING['4xl'],
  },
  // Header
  header: {
    marginBottom: SPACING['2xl'],
  },
  dayBadge: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  dayTheme: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  themeDecorLine: {
    width: 24,
    height: 2,
    borderRadius: 1,
    marginTop: SPACING.sm,
  },
  // Guidance — quote-block style with left border
  guidanceContainer: {
    marginBottom: SPACING['2xl'],
    borderLeftWidth: 3,
    borderRadius: BORDER_RADIUS.sm,
    paddingLeft: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.md,
  },
  guidanceText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: 29, // 17px * 1.7
  },
  // Locked / Completed shared container
  lockedContainer: {
    alignItems: 'center',
    paddingVertical: SPACING['6xl'],
  },
  lockedIconSmall: {
    fontSize: 32,
    marginBottom: SPACING.lg,
  },
  lockedTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  lockedDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm + 1,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
    paddingHorizontal: SPACING.xl,
  },
  unlockHint: {
    marginTop: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Completed state — elegant circle with checkmark
  completedCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  completedCheck: {
    fontSize: 28,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
})
