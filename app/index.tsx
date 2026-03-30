import { useState, useEffect, useRef, useMemo } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Text,
  Pressable,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Circle, Defs, RadialGradient as SvgRadialGradient, Stop, Path } from 'react-native-svg'
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
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
import { IconBadge, IconSettings, IconCheck } from '@/components/icons'
import { ZenButton, ZenTypography, ZenCard } from '@/components/ui'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

/**
 * MoodMiniChart: A very minimalist trend line for the last few days.
 * Fashionable and clean.
 */
function MoodMiniChart({ scores, color }: { scores: number[], color: string }) {
  if (scores.length < 2) return null
  const width = 100
  const height = 40
  const max = 10
  const min = 0
  
  const points = scores.slice(-5).map((s, i) => {
    const x = (i / (Math.min(scores.length, 5) - 1)) * width
    const y = height - ((s - min) / (max - min)) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <View style={styles.miniChartContainer}>
      <Svg width={width} height={height}>
        <Path
          d={`M ${points}`}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Text style={styles.miniChartLabel}>MOOD TREND</Text>
    </View>
  )
}

/**
 * ZenAura: Asymmetric organic light.
 */
function ZenAura({ color, size, duration }: { color: string, size: number, duration: number }) {
  return (
    <BreathingView 
      duration={duration} 
      range={[0.92, 1.1]} 
      opacityRange={[0.3, 0.6]}
      style={{ width: size, height: size, position: 'absolute' }}
    >
      <Svg width={size} height={size}>
        <Defs>
          <SvgRadialGradient id="auraGradient" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <Stop offset="60%" stopColor={color} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </SvgRadialGradient>
        </Defs>
        <Circle cx={size/2} cy={size/2} r={size/2} fill="url(#auraGradient)" />
      </Svg>
    </BreathingView>
  )
}

/**
 * HomeScreen: Re-re-designed with "High-Fashion Editorial" meets "Zen Dashboard".
 * Focuses on asymmetry, massive white space, and integrated data.
 */
export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { userId, currentDay, initUser } = useUserStore()
  const scoreHistory = useEmotionStore((s) => s.getScoreHistory())
  const dailyLogs = useJourneyStore((s) => s.dailyLogs)
  const completedDays = Object.keys(dailyLogs).map(Number)
  const earnedCount = useBadgeStore((s) => s.earnedBadges.length)

  const isFirstTime = userId === null
  const moods = scoreHistory.length > 0 ? scoreHistory.map((h) => h.score as number) : []
  const avgMood = moods.length > 0 ? Math.round(moods.reduce((a, b) => a + b, 0) / moods.length) : 0

  const stage = getStageByDay(currentDay)
  const stageColor = stage?.color || COLORS.primary
  const stageGradient = (GRADIENTS as any)[stage?.id] || GRADIENTS.healing

  const isTodayCompleted = dailyLogs[currentDay] !== undefined

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. Atmospheric Canvas */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient colors={stageGradient as any} style={StyleSheet.absoluteFill} />
        <View style={styles.aura1}><ZenAura color={stageColor} size={800} duration={15000} /></View>
        <View style={styles.aura2}><ZenAura color={stageColor} size={400} duration={12000} /></View>
        <WeatherParticles moodScore={avgMood} />
      </View>

      {/* 2. Editorial Header */}
      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <View style={styles.headerRow}>
          <View style={styles.brandGroup}>
            <Text style={styles.brandTitle}>HEALING</Text>
            <View style={[styles.brandLine, { backgroundColor: stageColor }]} />
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={() => router.push('/badges')} style={styles.headerIcon}>
              <IconBadge size={20} color={COLORS.textSecondary} />
              {earnedCount > 0 && <View style={[styles.badgeDot, { backgroundColor: stageColor }]} />}
            </Pressable>
            <Pressable onPress={() => router.push('/settings')} style={styles.headerIcon}>
              <IconSettings size={20} color={COLORS.textSecondary} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollInner, { paddingTop: insets.top + 60 }]}
      >
        {/* 3. Hero Section: Massive Day Counter */}
        <View style={styles.heroSection}>
          <Animated.View entering={FadeInDown.duration(800).springify()}>
            <View style={styles.dayCounter}>
              <Text style={styles.dayLabel}>DAY</Text>
              <Text style={styles.dayValue}>{currentDay.toString().padStart(2, '0')}</Text>
            </View>
            <View style={styles.stageIndicator}>
              <Text style={styles.stageName}>{stage?.name.toUpperCase()}</Text>
              <View style={styles.statusChip}>
                <View style={[styles.statusDot, { backgroundColor: isTodayCompleted ? COLORS.success : stageColor }]} />
                <Text style={styles.statusText}>{isTodayCompleted ? 'COMPLETED' : 'IN PROGRESS'}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* 4. Modern Dashboard Sheet */}
        <View style={styles.sheetContent}>
          {/* Quote Card: Large Serif, Center Aligned */}
          <Animated.View entering={FadeIn.delay(400).duration(1000)} style={styles.focusCard}>
            <Text style={styles.quoteSerif}>
              “{DAILY_QUOTES[currentDay - 1] ?? '静心思考，感受当下的力量。'}”
            </Text>
            <View style={styles.focusFooter}>
              <MoodMiniChart scores={moods} color={stageColor} />
              <View style={styles.focusTag}>
                <Text style={styles.focusTagText}>TODAY'S FOCUS</Text>
              </View>
            </View>
          </Animated.View>

          {/* Primary Action: Fashionable Wide Button */}
          <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.actionWrapper}>
            <ZenButton
              title={isTodayCompleted ? "回顾练习" : "开始疗愈之旅"}
              variant="hero"
              size="xl"
              fullWidth
              onPress={() => router.push(`/day/${currentDay}`)}
            />
          </Animated.View>

          {/* Data Section: Stats Row + Journey Map */}
          <View style={styles.statsRow}>
            <ZenCard variant="glass" style={styles.statCard}>
              <Text style={styles.statVal}>{completedDays.length}</Text>
              <Text style={styles.statKey}>DAYS DONE</Text>
            </ZenCard>
            <ZenCard variant="glass" style={styles.statCard}>
              <Text style={styles.statVal}>{avgMood || '-'}</Text>
              <Text style={styles.statKey}>AVG MOOD</Text>
            </ZenCard>
          </View>

          <ZenCard variant="glass" style={styles.journeyCard}>
            <Text style={styles.journeyTitle}>THE PATH</Text>
            <JourneyMap
              currentDay={currentDay}
              completedDays={completedDays}
              onDayPress={(day) => router.push(`/day/${day}`)}
              activeColor={stageColor}
            />
          </ZenCard>
        </View>
      </ScrollView>

      {isFirstTime && <WelcomeOverlay onStart={initUser} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, overflow: 'hidden' },
  aura1: { position: 'absolute', top: -100, right: -200 },
  aura2: { position: 'absolute', bottom: '15%', left: -150 },
  
  // Header
  headerArea: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING.md,
  },
  brandGroup: { gap: 4 },
  brandTitle: { fontSize: 12, letterSpacing: 6, fontWeight: '700', color: COLORS.textSecondary },
  brandLine: { width: 24, height: 2, borderRadius: 1 },
  headerActions: { flexDirection: 'row', gap: SPACING.md },
  headerIcon: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  badgeDot: { position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: 3, borderWidth: 1, borderColor: '#fff' },

  scrollInner: { paddingBottom: 60 },

  // Hero
  heroSection: { paddingHorizontal: SPACING['2xl'], marginBottom: SPACING['5xl'] },
  dayCounter: { flexDirection: 'row', alignItems: 'baseline' },
  dayLabel: { fontSize: 24, fontWeight: '300', color: COLORS.textSecondary, letterSpacing: 4, marginRight: 12 },
  dayValue: { fontSize: 110, fontWeight: '200', color: COLORS.text, letterSpacing: -6, includeFontPadding: false },
  stageIndicator: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -10 },
  stageName: { fontSize: 14, letterSpacing: 6, fontWeight: '600', color: COLORS.textSecondary },
  statusChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 1 },

  // Sheet
  sheetContent: { paddingHorizontal: SPACING['2xl'] },
  focusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 40,
    padding: SPACING['2xl'],
    marginBottom: SPACING['2xl'],
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.05, shadowRadius: 30,
  },
  quoteSerif: { 
    fontFamily: TYPOGRAPHY.fontFamily.serif, 
    fontSize: 26, lineHeight: 42, color: COLORS.text, 
    textAlign: 'center', fontStyle: 'italic',
    marginBottom: SPACING['2xl']
  },
  focusFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  miniChartContainer: { gap: 6 },
  miniChartLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textTertiary, letterSpacing: 2 },
  focusTag: { backgroundColor: COLORS.text, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  focusTagText: { fontSize: 9, fontWeight: '800', color: '#FFF', letterSpacing: 1 },

  actionWrapper: { marginBottom: SPACING['4xl'] },

  // Stats & Journey
  statsRow: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.lg },
  statCard: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.xl, borderRadius: 30 },
  statVal: { fontSize: 32, fontWeight: '300', color: COLORS.text, marginBottom: 4 },
  statKey: { fontSize: 9, fontWeight: '700', color: COLORS.textTertiary, letterSpacing: 2 },
  journeyCard: { padding: SPACING.lg, borderRadius: 35, alignItems: 'center', overflow: 'hidden' },
  journeyTitle: { fontSize: 11, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 6, marginBottom: SPACING.md },
})
