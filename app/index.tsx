import { useState, useCallback, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { useUserStore } from '@/stores/userStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useBadgeStore } from '@/stores/badgeStore'
import { JourneyMap } from '@/components/shared/JourneyMap'
import { BreathingView } from '@/components/shared/BreathingView'
import { COLORS, SPACING, SHADOWS, GRADIENTS, TYPOGRAPHY } from '@/constants/theme'
import { getStageByDay } from '@/constants/stages'
import { DAILY_QUOTES } from '@/constants/quotes'
import WelcomeOverlay from '@/components/home/WelcomeOverlay'
import WeatherParticles from '@/components/home/WeatherParticles'
import { IconBadge, IconSettings } from '@/components/icons'
import { ZenButton, ZenTypography } from '@/components/ui'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const JOURNEY_EXPANDED_HEIGHT = 450

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { userId, currentDay, initUser } = useUserStore()
  const scoreHistory = useEmotionStore((s) => s.getScoreHistory())
  const dailyLogs = useJourneyStore((s) => s.dailyLogs)
  const completedDays = Object.keys(dailyLogs).map(Number)

  const earnedCount = useBadgeStore((s) => s.earnedBadges.length)

  const [justCompleted, setJustCompleted] = useState<number | undefined>()
  const prevCompletedCountRef = useRef(completedDays.length)

  useEffect(() => {
    if (completedDays.length > prevCompletedCountRef.current) {
      const newest = Math.max(...completedDays)
      setJustCompleted(newest)
      const timer = setTimeout(() => setJustCompleted(undefined), 1500)
      return () => clearTimeout(timer)
    }
    prevCompletedCountRef.current = completedDays.length
  }, [completedDays])

  const isFirstTime = userId === null
  const moods = scoreHistory.length > 0
    ? scoreHistory.map((h) => h.score as number)
    : []

  const avgMood = moods.length > 0
    ? Math.round(moods.reduce((a, b) => a + b, 0) / moods.length)
    : 0

  const stage = getStageByDay(currentDay)

  const [journeyExpanded, setJourneyExpanded] = useState(false)
  const journeyHeight = useSharedValue(0)

  const animatedJourneyStyle = useAnimatedStyle(() => ({
    height: journeyHeight.value === 0 ? 0 : journeyHeight.value,
    overflow: 'hidden' as const,
    opacity: journeyHeight.value === 0 ? 0 : 1,
  }))

  const toggleJourney = useCallback(() => {
    setJourneyExpanded((prev) => {
      const next = !prev
      journeyHeight.value = withTiming(
        next ? JOURNEY_EXPANDED_HEIGHT : 0,
        { duration: 500 },
      )
      return next
    })
  }, [journeyHeight])

  const handleDismissWelcome = () => {
    initUser()
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={GRADIENTS.healing as any}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <WeatherParticles moodScore={avgMood} />
      
      {/* Dynamic Animated Blobs - Softened for better contrast */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BreathingView 
          duration={8000} 
          range={[1, 1.4]} 
          style={[styles.blob, styles.blob1]} 
        />
        <BreathingView 
          duration={10000} 
          range={[1, 1.6]} 
          style={[styles.blob, styles.blob2]} 
        />
        <BreathingView 
          duration={12000} 
          range={[1, 1.3]} 
          style={[styles.blob, styles.blob3]} 
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent, 
          { 
            paddingTop: Math.max(insets.top, SPACING.lg),
            paddingBottom: Math.max(insets.bottom, SPACING['6xl']) 
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ZenButton
            onPress={() => router.push('/badges')}
            variant="ghost"
            style={styles.iconButton}
          >
            <IconBadge size={22} color={COLORS.textSecondary} />
            {earnedCount > 0 && (
              <View style={styles.badgeCount}>
                <ZenTypography size="xs" variant="bold" color="white">
                  {earnedCount}
                </ZenTypography>
              </View>
            )}
          </ZenButton>

          <ZenButton
            onPress={() => router.push('/settings')}
            variant="ghost"
            style={styles.iconButton}
          >
            <IconSettings size={22} color={COLORS.textSecondary} />
          </ZenButton>
        </View>

        {/* Main Title Section */}
        <Animated.View entering={FadeInDown.duration(1000).springify()} style={styles.titleSection}>
          <ZenTypography 
            type="serif" 
            size="3xl" 
            variant="bold" 
            align="center"
            style={styles.appTitle}
          >
            29天疗愈
          </ZenTypography>
          
          <View style={styles.stageChip}>
            <ZenTypography size="sm" color="textSecondary" style={styles.dayLabel}>
              第 {currentDay} 天
            </ZenTypography>
            <View style={styles.dot} />
            <ZenTypography size="sm" variant="medium" color="textSecondary">
              {stage?.name}
            </ZenTypography>
          </View>
        </Animated.View>

        {/* Quote Section */}
        <Animated.View entering={FadeIn.delay(400).duration(1200)} style={styles.quoteCard}>
          <ZenTypography 
            type="serif" 
            size="2xl" 
            color="primaryLight" 
            style={styles.quoteMark}
          >
            “
          </ZenTypography>
          
          <ZenTypography 
            type="serif" 
            size="lg" 
            italic 
            align="center" 
            style={styles.dailyQuote}
          >
            {DAILY_QUOTES[currentDay - 1] ?? ''}
          </ZenTypography>
          
          <ZenTypography 
            type="serif" 
            size="2xl" 
            color="primaryLight" 
            align="right"
            style={styles.quoteMark}
          >
            ”
          </ZenTypography>
        </Animated.View>

        {/* Action Area */}
        <View style={styles.actionSection}>
          <Animated.View entering={FadeInDown.delay(800).duration(800).springify()}>
            <ZenButton
              title="开始练习"
              size="lg"
              onPress={() => router.push(`/day/${currentDay}`)}
              style={styles.mainButton}
            />
          </Animated.View>
        </View>

        {/* Journey Map Section */}
        <Animated.View
          entering={FadeIn.delay(1200).duration(800)}
          style={styles.journeySection}
        >
          <ZenButton
            title={journeyExpanded ? '隐于当下' : '见证旅程'}
            variant="ghost"
            size="sm"
            onPress={toggleJourney}
            style={styles.journeyToggle}
          />
          
          <Animated.View style={animatedJourneyStyle}>
            <View style={styles.journeyMapContainer}>
              <JourneyMap
                currentDay={currentDay}
                completedDays={completedDays}
                onDayPress={(day) => router.push(`/day/${day}`)}
                justCompletedDay={justCompleted}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {isFirstTime && <WelcomeOverlay onStart={handleDismissWelcome} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  blob: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.08, // Significantly softened for a halo effect
  },
  blob1: {
    width: 350,
    height: 350,
    top: -80,
    left: -80,
    backgroundColor: COLORS.stageRebuild,
  },
  blob2: {
    width: 450,
    height: 450,
    bottom: '15%',
    right: -120,
    backgroundColor: COLORS.stageEnergy,
  },
  blob3: {
    width: 280,
    height: 280,
    top: '25%',
    left: '5%',
    backgroundColor: COLORS.stageDesensitize,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  iconButton: {
    width: 48,
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  badgeCount: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    ...SHADOWS.sm,
  },
  titleSection: {
    marginTop: SPACING['5xl'],
    alignItems: 'center',
    gap: SPACING.md,
  },
  appTitle: {
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
  },
  stageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  dayLabel: {
    letterSpacing: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textTertiary,
    marginHorizontal: SPACING.sm,
    opacity: 0.5,
  },
  quoteCard: {
    marginVertical: SPACING['6xl'],
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
  quoteMark: {
    width: '100%',
    opacity: 0.4,
    marginBottom: -SPACING.md,
  },
  dailyQuote: {
    lineHeight: 40,
    paddingVertical: SPACING.lg,
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: SPACING['6xl'],
  },
  mainButton: {
    minWidth: 220,
    ...SHADOWS.glow,
  },
  journeySection: {
    width: '100%',
    alignItems: 'center',
  },
  journeyToggle: {
    marginBottom: SPACING.md,
  },
  journeyMapContainer: {
    width: SCREEN_WIDTH - SPACING.xl * 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...SHADOWS.soft,
  },
})

