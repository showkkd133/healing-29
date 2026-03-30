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
import FadeInView from '@/components/shared/FadeInView'
import type { DayNumber, DayCompletionPayload, EmotionIntensity, GenericDayTaskData } from '@/types'

const MAX_DAY = 29

// -- Component type --

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
      <View style={styles.titleUnderline} />
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

// -- Locked content placeholder --

function LockedContent({ dayId, daysUntilUnlock }: { dayId: number; daysUntilUnlock: number }) {
  return (
    <FadeInView style={styles.lockedContainer}>
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
    </FadeInView>
  )
}

// -- Already-completed placeholder --

function CompletedContent({ dayId }: { dayId: number }) {
  return (
    <FadeInView style={styles.lockedContainer}>
      <View style={styles.completedCircle}>
        <IconCheck size={28} color={COLORS.success} />
      </View>
      <Text style={styles.lockedTitle}>Day {dayId} 已完成</Text>
      <Text style={styles.lockedDescription}>
        你已经完成了这一天的任务，继续前行吧。
      </Text>
    </FadeInView>
  )
}

// -- Helpers --

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
  const theme = config?.theme ?? `Day ${dayId}`
  const guidanceText = config?.guidanceText ?? ''
  const isLocked = dayId > currentDay
  const isAlreadyCompleted = dayId in dailyLogs
  const daysUntilUnlock = isLocked ? dayId - currentDay : 0
  const DayComponent = DAY_COMPONENTS[dayId]

  useEffect(() => {
    if (!isLocked) {
      startDay(dayId as DayNumber)
    }
  }, [dayId, isLocked, startDay])

  const handleComplete = (data: DayCompletionPayload) => {
    const day = dayId as DayNumber
    const moodScore = extractMoodScore(data)
    const taskData = extractTaskData(data)
    recordEmotion(day, moodScore, [])
    updateDayData(taskData)
    completeDay(day, moodScore)
    checkAndAward(day, taskData)
    if (dayId < MAX_DAY) {
      advanceDay()
    }
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
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView delay={100}>
          <DayHeader dayId={dayId} theme={theme} />
        </FadeInView>

        {guidanceText.length > 0 && (
          <FadeInView delay={300}>
            <GuidanceBlock text={guidanceText} />
          </FadeInView>
        )}

        <FadeInView delay={500} style={styles.componentContainer}>
          {isLocked ? (
            <LockedContent dayId={dayId} daysUntilUnlock={daysUntilUnlock} />
          ) : isAlreadyCompleted ? (
            <CompletedContent dayId={dayId} />
          ) : (
            DayComponent && <DayComponent onComplete={handleComplete} />
          )}
        </FadeInView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING['3xl'], // More extreme whitespace
    paddingBottom: SPACING['6xl'],     // More extreme whitespace
  },
  header: {
    marginBottom: SPACING['3xl'],
    marginTop: SPACING.xl,
  },
  dayLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.textTertiary,
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  dayTheme: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.text,
    lineHeight: TYPOGRAPHY.lineHeight['3xl'],
  },
  titleUnderline: {
    height: 1,
    width: 40,
    backgroundColor: COLORS.accent,
    marginTop: SPACING.md,
    opacity: 0.3,
  },
  guidanceContainer: {
    marginBottom: SPACING['4xl'],
  },
  guidanceText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: 32, // Increased line height
    fontStyle: 'italic',
    opacity: 0.8,
  },
  componentContainer: {
    flex: 1,
  },
  lockedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['6xl'],
  },
  lockedIcon: {
    marginBottom: SPACING.lg,
    opacity: 0.5,
  },
  lockedTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  lockedDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING.xl,
  },
  unlockHint: {
    marginTop: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.accent,
    letterSpacing: 1,
  },
  completedCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.backgroundPositive,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
})

