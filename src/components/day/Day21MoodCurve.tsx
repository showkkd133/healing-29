import React, { useCallback, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'
import { type MoodPoint, TIME_START, formatHour } from './Day21ChartConstants'
import Day21TimeAxis from './Day21TimeAxis'
import Day21MoodChart from './Day21MoodChart'
import Day21MoodPointList from './Day21MoodPointList'
import Day21ScorePicker from './Day21ScorePicker'
import Day21TriggerModal from './Day21TriggerModal'

// ─── Props ─────────────────────────────────────────────────────────

interface Day21MoodCurveProps {
  readonly onComplete: (data: {
    readonly moodCurve: ReadonlyArray<{ readonly time: string; readonly score: number }>
    readonly triggers: string[]
  }) => void
}

// ─── Constants ─────────────────────────────────────────────────────

const GUIDANCE_TEXT = '记录今天的心情波动'
const COMPLETION_TEXT = '反复不是倒退，是螺旋上升'

// ─── Main component ────────────────────────────────────────────────

const Day21MoodCurve = React.memo(function Day21MoodCurve({
  onComplete,
}: Day21MoodCurveProps) {
  const [moodPoints, setMoodPoints] = useState<readonly MoodPoint[]>([])
  const [showScorePicker, setShowScorePicker] = useState(false)
  const [selectedHour, setSelectedHour] = useState(TIME_START)
  const [showTriggerModal, setShowTriggerModal] = useState(false)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const [triggerInput, setTriggerInput] = useState('')
  const [completed, setCompleted] = useState(false)

  // ─── Derived data ───────────────────────────────────────────────

  const sortedPoints = useMemo(
    () => [...moodPoints].sort((a, b) => a.hour - b.hour),
    [moodPoints]
  )

  const fluctuationCount = useMemo(() => {
    if (sortedPoints.length < 2) return 0
    let count = 0
    for (let i = 1; i < sortedPoints.length; i++) {
      const diff = Math.abs(sortedPoints[i].score - sortedPoints[i - 1].score)
      if (diff >= 2) count++
    }
    return count
  }, [sortedPoints])

  // ─── Handlers ───────────────────────────────────────────────────

  const handleTimelineTap = useCallback((hour: number) => {
    setSelectedHour(hour)
    setShowScorePicker(true)
  }, [])

  const handleScoreSelect = useCallback(async (score: number) => {
    const point: MoodPoint = {
      id: `${selectedHour}-${Date.now()}`,
      hour: selectedHour,
      score,
      trigger: '',
    }
    setMoodPoints((prev) => {
      const filtered = prev.filter((p) => p.hour !== selectedHour)
      return [...filtered, point]
    })
    setShowScorePicker(false)
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {
      // Haptics not available
    }
  }, [selectedHour])

  const handlePointTap = useCallback((pointId: string) => {
    setSelectedPointId(pointId)
    setTriggerInput('')
    setShowTriggerModal(true)
  }, [])

  const handleTriggerSubmit = useCallback(() => {
    if (!selectedPointId || !triggerInput.trim()) {
      setShowTriggerModal(false)
      return
    }
    setMoodPoints((prev) =>
      prev.map((p) =>
        p.id === selectedPointId ? { ...p, trigger: triggerInput.trim() } : p
      )
    )
    setTriggerInput('')
    setShowTriggerModal(false)
  }, [selectedPointId, triggerInput])

  const handleComplete = useCallback(() => {
    setCompleted(true)
    onComplete({
      moodCurve: sortedPoints.map((p) => ({
        time: formatHour(p.hour),
        score: p.score,
      })),
      triggers: sortedPoints
        .filter((p) => p.trigger.length > 0)
        .map((p) => `${formatHour(p.hour)}: ${p.trigger}`),
    })
  }, [sortedPoints, onComplete])

  const closeScorePicker = useCallback(() => setShowScorePicker(false), [])
  const closeTriggerModal = useCallback(() => setShowTriggerModal(false), [])

  // ─── Render: completed state ─────────────────────────────────────

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>📈</Text>
          <Text style={styles.completedText}>{COMPLETION_TEXT}</Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: main ────────────────────────────────────────────────

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.guidanceText}>
        {GUIDANCE_TEXT}
      </Animated.Text>

      <Day21TimeAxis moodPoints={moodPoints} onHourTap={handleTimelineTap} />

      {moodPoints.length > 0 && (
        <Day21MoodChart sortedPoints={sortedPoints} onPointTap={handlePointTap} />
      )}

      {sortedPoints.length > 0 && (
        <Day21MoodPointList sortedPoints={sortedPoints} onPointTap={handlePointTap} />
      )}

      {moodPoints.length >= 2 && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.aiCard}>
          <Text style={styles.aiText}>
            你今天有{fluctuationCount}次明显波动，这在康复期很正常
          </Text>
        </Animated.View>
      )}

      {moodPoints.length > 0 && (
        <TouchableOpacity style={styles.exportButton} activeOpacity={0.7} disabled>
          <Text style={styles.exportButtonText}>导出报告（即将推出）</Text>
        </TouchableOpacity>
      )}

      {moodPoints.length >= 2 && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>完成</Text>
        </TouchableOpacity>
      )}

      <Day21ScorePicker
        visible={showScorePicker}
        hour={selectedHour}
        onSelect={handleScoreSelect}
        onClose={closeScorePicker}
      />

      <Day21TriggerModal
        visible={showTriggerModal}
        value={triggerInput}
        onChangeText={setTriggerInput}
        onSubmit={handleTriggerSubmit}
        onClose={closeTriggerModal}
      />
    </ScrollView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING['4xl'],
  },
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['2xl'],
  },
  aiCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  aiText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    textAlign: 'center',
  },
  exportButton: {
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    opacity: 0.5,
  },
  exportButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xl,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day21MoodCurve
