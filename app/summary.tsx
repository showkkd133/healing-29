import React, { useMemo, useState, useEffect } from 'react'
import {
  View, Text, ScrollView, FlatList, Alert, StyleSheet
} from 'react-native'
import Animated, {
  FadeIn, useSharedValue, useAnimatedStyle, withSpring,
  withDelay,
} from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Polyline, Text as SvgText, Line } from 'react-native-svg'
import { useUserStore } from '@/stores/userStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useBadgeStore } from '@/stores/badgeStore'
import { getBadgeById } from '@/constants/badges'
import { exportAllData } from '@/services/dataExport'
import { IconButterfly } from '@/components/icons'
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '@/constants/theme'
import { ZenButton } from '@/components/ui/ZenButton'
import { ZenIconButton } from '@/components/ui/ZenIconButton'
import { ZenTypography } from '@/components/ui/ZenTypography'
import { useHaptic } from '@/hooks/useHaptic'
import {
  styles as oldStyles, CHART_WIDTH, CHART_HEIGHT, CHART_PADDING,
} from '@/components/summary/styles'

const MAX_VISIBLE_BADGES = 8

// Stagger delay between animated sections (ms)
const STAGGER_DELAY = 100

// Encouragement copy keyed by trend direction
const ENCOURAGEMENT: Record<string, string> = {
  improving: '从第 1 天的风暴，到今天的彩虹。你比想象中更坚强。',
  stable: '你一步一步走过了 29 天，保持了内心的平稳。这本身就是一种力量。',
  declining: '即使情绪起伏不定，你依然坚持走完了全程。勇气不是没有恐惧，而是带着恐惧继续前行。',
}

// -- Sub-components --

function CelebrationHeader() {
  return (
    <View style={styles.celebrationContainer}>
      <View style={styles.celebrationIcon}>
        <IconButterfly size={56} color={COLORS.accent} />
      </View>
      <ZenTypography variant="bold" size="xl" color="text" align="center" style={styles.celebrationTitle}>
        你做到了
      </ZenTypography>
      <ZenTypography variant="medium" size="sm" color="textSecondary" align="center">
        29 天疗愈之旅，圆满完成
      </ZenTypography>
    </View>
  )
}

function StatsItem({
  value, label,
}: {
  readonly value: string
  readonly label: string
}) {
  return (
    <View style={styles.statsItem}>
      <ZenTypography variant="bold" size="lg" color="primary">{value}</ZenTypography>
      <ZenTypography size="xs" color="textTertiary">{label}</ZenTypography>
    </View>
  )
}

function StatsRow({
  completedDays, streakDays, badgeCount,
}: {
  readonly completedDays: number
  readonly streakDays: number
  readonly badgeCount: number
}) {
  return (
    <View style={styles.statsRow}>
      <StatsItem value={`${completedDays}`} label="已完成天数" />
      <View style={styles.statsDivider} />
      <StatsItem value={`${streakDays}`} label="当前连击" />
      <View style={styles.statsDivider} />
      <StatsItem value={`${badgeCount}`} label="获得徽章" />
    </View>
  )
}

function AnimatedDataPoint({
  cx, cy, isEndpoint, color, delay,
}: {
  readonly cx: number
  readonly cy: number
  readonly isEndpoint: boolean
  readonly color: string
  readonly delay: number
}) {
  const scale = useSharedValue(0)

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 180 }))
  }, [delay, scale])

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: cx - (isEndpoint ? 5 : 3),
    top: cy - (isEndpoint ? 5 : 3),
    width: isEndpoint ? 10 : 6,
    height: isEndpoint ? 10 : 6,
    borderRadius: isEndpoint ? 5 : 3,
    backgroundColor: color,
    borderWidth: isEndpoint ? 1.5 : 0,
    borderColor: '#FFFFFF',
    transform: [{ scale: scale.value }],
  }))

  return <Animated.View style={animatedStyle} />
}

const CHART_DRAW_DURATION = 2000
const CHART_DRAW_DELAY = 1000

function MoodChart({ data }: { readonly data: ReadonlyArray<{ day: number; score: number }> }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [animationDone, setAnimationDone] = useState(false)

  const points = useMemo(() => {
    if (data.length === 0) return []
    const plotW = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
    const plotH = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom
    return data.map((d) => ({
      x: CHART_PADDING.left + ((d.day - 1) / 28) * plotW,
      y: CHART_PADDING.top + plotH - ((d.score - 1) / 9) * plotH,
      score: d.score,
    }))
  }, [data])

  useEffect(() => {
    if (points.length === 0) return
    const startTimer = setTimeout(() => {
      setVisibleCount(1)
      if (points.length <= 1) {
        setAnimationDone(true)
        return
      }
      const intervalMs = CHART_DRAW_DURATION / (points.length - 1)
      const interval = setInterval(() => {
        setVisibleCount((prev) => {
          const next = prev + 1
          if (next >= points.length) {
            clearInterval(interval)
            setAnimationDone(true)
            return points.length
          }
          return next
        })
      }, intervalMs)
      return () => clearInterval(interval)
    }, CHART_DRAW_DELAY)
    return () => clearTimeout(startTimer)
  }, [points.length])

  if (data.length === 0) {
    return (
      <View style={styles.chartContainer}>
        <ZenTypography variant="bold" size="md" color="text" style={styles.chartTitle}>情绪变化曲线</ZenTypography>
        <ZenTypography size="sm" color="textTertiary" align="center">暂无情绪数据</ZenTypography>
      </View>
    )
  }

  const visiblePoints = points.slice(0, visibleCount)
  const polyline = visiblePoints.map((p) => `${p.x},${p.y}`).join(' ')
  const first = points[0]
  const last = points[points.length - 1]

  return (
    <View style={styles.chartContainer}>
      <ZenTypography variant="bold" size="md" color="text" style={styles.chartTitle}>成长轨迹回放</ZenTypography>
      <View>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <SvgText x={CHART_PADDING.left} y={CHART_HEIGHT - 4} fontSize={10} fill={COLORS.textTertiary} textAnchor="start">Day 1</SvgText>
          <SvgText x={CHART_WIDTH - CHART_PADDING.right} y={CHART_HEIGHT - 4} fontSize={10} fill={COLORS.textTertiary} textAnchor="end">Day 29</SvgText>
          <Line x1={CHART_PADDING.left} y1={CHART_HEIGHT - CHART_PADDING.bottom} x2={CHART_WIDTH - CHART_PADDING.right} y2={CHART_HEIGHT - CHART_PADDING.bottom} stroke={COLORS.border} strokeWidth={0.5} />
          {visiblePoints.length >= 2 && (
            <Polyline points={polyline} fill="none" stroke={COLORS.primary} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          )}
          {animationDone && (
            <>
              <SvgText x={first.x + 8} y={first.y - 8} fontSize={11} fill={COLORS.textSecondary} textAnchor="start">起点 {first.score}</SvgText>
              <SvgText x={last.x - 8} y={last.y - 8} fontSize={11} fill={COLORS.textSecondary} textAnchor="end">终点 {last.score}</SvgText>
            </>
          )}
        </Svg>
        {visiblePoints.map((p, i) => {
          const isFirst = i === 0
          const isLast = i === points.length - 1 && animationDone
          return (
            <AnimatedDataPoint
              key={`pt-${data[i].day}`}
              cx={p.x}
              cy={p.y}
              isEndpoint={isFirst || isLast}
              color={isFirst ? COLORS.secondary : isLast ? COLORS.accent : COLORS.primary}
              delay={0}
            />
          )
        })}
      </View>
      {animationDone && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.journeyArrowContainer}>
          <ZenTypography size="xs" color="textTertiary">起点 → 终点</ZenTypography>
        </Animated.View>
      )}
    </View>
  )
}

function BadgeItem({ icon, provider, name }: { readonly icon: string; readonly provider?: any; readonly name: string }) {
  return (
    <View style={styles.badgeItem}>
      <ZenIconButton
        icon={icon}
        provider={provider}
        size={64}
        iconSize={32}
        color={COLORS.primary}
        backgroundColor={COLORS.backgroundPositive}
        style={styles.badgeIcon}
      />
      <ZenTypography variant="medium" size="xs" color="textSecondary" numberOfLines={1} style={styles.badgeName}>
        {name}
      </ZenTypography>
    </View>
  )
}

function BadgeList({ earnedBadges }: { readonly earnedBadges: ReadonlyArray<{ badgeId: string }> }) {
  const router = useRouter()
  const haptic = useHaptic();

  const visibleBadges = useMemo(() => {
    return earnedBadges.map((eb) => getBadgeById(eb.badgeId)).filter(Boolean).slice(0, MAX_VISIBLE_BADGES);
  }, [earnedBadges])

  const overflow = earnedBadges.length - MAX_VISIBLE_BADGES

  if (earnedBadges.length === 0) return null

  return (
    <View style={styles.badgeSection}>
      <ZenTypography variant="bold" size="md" color="text" style={styles.sectionTitle}>获得的徽章</ZenTypography>
      <FlatList
        horizontal
        data={visibleBadges}
        keyExtractor={(item) => item!.id}
        renderItem={({ item }) => (
          <BadgeItem icon={item!.icon} provider={item!.iconProvider as any} name={item!.name} />
        )}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={
          overflow > 0 ? (
            <View style={styles.overflowWrapper}>
              <ZenIconButton
                icon="plus"
                size={64}
                iconSize={24}
                backgroundColor={COLORS.borderLight}
                color={COLORS.textSecondary}
                onPress={() => {
                  haptic.light();
                  router.push('/badges');
                }}
              />
              <ZenTypography size="xs" color="textTertiary" style={styles.badgeName}>更多 {overflow}</ZenTypography>
            </View>
          ) : null
        }
        contentContainerStyle={styles.badgeListContent}
      />
    </View>
  )
}

function EncouragementBlock({ direction }: { readonly direction: string }) {
  const text = ENCOURAGEMENT[direction] ?? ENCOURAGEMENT.improving
  return (
    <View style={styles.encouragementContainer}>
      <ZenTypography variant="medium" size="sm" color="primary" align="center" style={styles.encouragementText}>
        {text}
      </ZenTypography>
    </View>
  )
}

function ActionButtons({ onExport, onGoHome }: { readonly onExport: () => void; readonly onGoHome: () => void }) {
  return (
    <View style={styles.actionContainer}>
      <ZenButton
        title="返回首页"
        variant="primary"
        size="lg"
        fullWidth
        onPress={onGoHome}
        style={styles.primaryButton}
      />
      <ZenButton
        title="导出旅程报告"
        variant="ghost"
        size="md"
        fullWidth
        leftIcon="share"
        onPress={onExport}
        style={styles.ghostButton}
      />
    </View>
  )
}

// -- Main screen --

export default function SummaryScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const streakDays = useUserStore((s) => s.streakDays)
  const dailyLogs = useJourneyStore((s) => s.dailyLogs)
  const earnedBadges = useBadgeStore((s) => s.earnedBadges)
  const getScoreHistory = useEmotionStore((s) => s.getScoreHistory)
  const calculateTrend = useEmotionStore((s) => s.calculateTrend)

  const completedDays = Object.keys(dailyLogs).length
  const scoreHistory = useMemo(() => getScoreHistory(), [getScoreHistory])
  const trend = useMemo(() => calculateTrend(), [calculateTrend])

  const handleExport = async () => {
    try {
      await exportAllData()
    } catch (error) {
      Alert.alert('导出失败', '请稍后重试')
    }
  }

  const handleGoHome = () => {
    router.replace('/')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(300)}>
          <CelebrationHeader />
        </Animated.View>
        <Animated.View entering={FadeIn.delay(STAGGER_DELAY).duration(400)}>
          <StatsRow completedDays={completedDays} streakDays={streakDays} badgeCount={earnedBadges.length} />
        </Animated.View>
        <Animated.View entering={FadeIn.delay(STAGGER_DELAY * 2).duration(400)}>
          <MoodChart data={scoreHistory} />
        </Animated.View>
        <Animated.View entering={FadeIn.delay(STAGGER_DELAY * 3).duration(400)}>
          <BadgeList earnedBadges={earnedBadges} />
        </Animated.View>
        <Animated.View entering={FadeIn.delay(STAGGER_DELAY * 4).duration(400)}>
          <EncouragementBlock direction={trend.direction} />
        </Animated.View>
        <Animated.View entering={FadeIn.delay(STAGGER_DELAY * 5).duration(400)}>
          <ActionButtons onExport={handleExport} onGoHome={handleGoHome} />
        </Animated.View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING['6xl'],
  },
  celebrationContainer: {
    paddingVertical: SPACING['4xl'],
    alignItems: 'center',
  },
  celebrationIcon: {
    marginBottom: SPACING.lg,
  },
  celebrationTitle: {
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  statsItem: {
    alignItems: 'center',
  },
  statsDivider: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.borderLight,
    alignSelf: 'center',
  },
  chartContainer: {
    marginTop: SPACING['3xl'],
    paddingHorizontal: SPACING.xl,
  },
  chartTitle: {
    marginBottom: SPACING.lg,
  },
  journeyArrowContainer: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  badgeSection: {
    marginTop: SPACING['4xl'],
  },
  sectionTitle: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  badgeListContent: {
    paddingHorizontal: SPACING.xl,
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: SPACING.lg,
    width: 72,
  },
  badgeIcon: {
    ...SHADOWS.sm,
  },
  badgeName: {
    marginTop: SPACING.xs,
    width: '100%',
    textAlign: 'center',
  },
  overflowWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  encouragementContainer: {
    marginTop: SPACING['4xl'],
    paddingHorizontal: SPACING['3xl'],
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.backgroundPositive,
    marginHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  encouragementText: {
    lineHeight: 24,
    fontStyle: 'italic',
  },
  actionContainer: {
    marginTop: SPACING['4xl'],
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  primaryButton: {
    ...SHADOWS.md,
  },
  ghostButton: {
    marginTop: SPACING.xs,
  },
})
