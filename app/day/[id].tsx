import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
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
import { useUserStore } from '@/stores/userStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useBadgeStore } from '@/stores/badgeStore'
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme'
import { IconLock, IconCheck } from '@/components/icons'
import TearTransition from '@/components/shared/TearTransition'
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

// -- Minimal day header: label + theme title --

function DayHeader({ dayId, theme }: { dayId: number; theme: string }) {
  return (
    <View style={styles.header} accessibilityRole="header">
      <Text style={styles.dayLabel}>Day {dayId}</Text>
      <Text style={styles.dayTheme}>{theme}</Text>
    </View>
  )
}

// -- Plain guidance text --

function GuidanceBlock({ text }: { text: string }) {
  return (
    <View style={styles.guidanceContainer} accessibilityRole="text">
      <Text style={styles.guidanceText}>{text}</Text>
    </View>
  )
}

// -- Locked content placeholder with unlock hint --

function LockedContent({ dayId, daysUntilUnlock }: { dayId: number; daysUntilUnlock: number }) {
  return (
    <View style={styles.lockedContainer} accessibilityLabel={`第${dayId}天尚未解锁`}>
      <View style={styles.lockedIcon}>
        <IconLock size={32} color={COLORS.textTertiary} />
      </View>
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
        <IconCheck size={28} color={COLORS.success} />
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

  const [showTear, setShowTear] = useState(false)

  const dayId = Number(id) || 1
  const config = getDayConfig(dayId)
  const theme = config?.theme ?? `第 ${dayId} 天`
  const guidanceText = config?.guidanceText ?? ''
  const isLocked = dayId > currentDay
  const isAlreadyCompleted = dayId in dailyLogs
  const daysUntilUnlock = isLocked ? dayId - currentDay : 0
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

    // Trigger tear-off animation instead of navigating immediately
    setShowTear(true)
  }

  const handleTearComplete = () => {
    if (dayId === MAX_DAY) {
      router.replace('/summary')
    } else {
      router.back()
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 44 }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DayHeader dayId={dayId} theme={theme} />

        {guidanceText.length > 0 && (
          <GuidanceBlock text={guidanceText} />
        )}

        {isLocked ? (
          <LockedContent dayId={dayId} daysUntilUnlock={daysUntilUnlock} />
        ) : isAlreadyCompleted ? (
          <CompletedContent dayId={dayId} />
        ) : (
          DayComponent && <DayComponent onComplete={handleComplete} />
        )}
      </ScrollView>

      {showTear && (
        <TearTransition
          visible={showTear}
          dayNumber={dayId}
          onComplete={handleTearComplete}
        />
      )}
    </View>
  )
}

// -- Styles --

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING['2xl'],
    paddingBottom: SPACING['4xl'],
  },
  // Header — minimal label + title
  header: {
    marginBottom: SPACING['2xl'],
  },
  dayLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dayTheme: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  // Guidance — plain text
  guidanceContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING['2xl'] + SPACING.sm,
  },
  guidanceText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: 29, // 17px * 1.7
  },
  // Locked / Completed — vertically centered
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['6xl'],
  },
  lockedIcon: {
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
  completedCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
})
