import React, { useCallback, useState } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { SPACING } from '@/constants/theme'
import Day9CompletedView from './Day9CompletedView'
import Day9BodyResponsePhase from './Day9BodyResponsePhase'
import Day9ActivitySelector from './Day9ActivitySelector'
import Day9ActivityGuide from './Day9ActivityGuide'

// ─── Props ─────────────────────────────────────────────────────────

interface Day9BodyJoyProps {
  readonly onComplete: (data: {
    readonly activityType: string
    readonly bodyResponse: string
    readonly duration: number
  }) => void
}

// ─── Main component ────────────────────────────────────────────────

const Day9BodyJoy = React.memo(function Day9BodyJoy({
  onComplete,
}: Day9BodyJoyProps) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [timerDone, setTimerDone] = useState(false)
  const [elapsedDuration, setElapsedDuration] = useState(0)
  const [completed, setCompleted] = useState(false)

  // ─── Activity selection ─────────────────────────────────────────

  const handleSelectActivity = useCallback((id: string) => {
    setSelectedActivity(id)
  }, [])

  // ─── Timer done ─────────────────────────────────────────────────

  const handleTimerDone = useCallback((elapsed: number) => {
    setElapsedDuration(elapsed)
    setTimerDone(true)
  }, [])

  // ─── Change activity (reset timer state) ────────────────────────

  const handleChangeActivity = useCallback(() => {
    setSelectedActivity(null)
    setTimerDone(false)
    setElapsedDuration(0)
  }, [])

  // ─── Body response selected -> complete ─────────────────────────

  const handleBodyResponse = useCallback((responseKey: string) => {
    if (!selectedActivity) return

    setCompleted(true)
    onComplete({
      activityType: selectedActivity,
      bodyResponse: responseKey,
      duration: elapsedDuration,
    })
  }, [selectedActivity, elapsedDuration, onComplete])

  // ─── Render: completed state ─────────────────────────────────────

  if (completed) {
    return <Day9CompletedView />
  }

  // ─── Render: body response phase ────────────────────────────────

  if (timerDone) {
    return <Day9BodyResponsePhase onSelectResponse={handleBodyResponse} />
  }

  // ─── Render: main ────────────────────────────────────────────────

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {!selectedActivity ? (
        <Day9ActivitySelector onSelect={handleSelectActivity} />
      ) : (
        <Day9ActivityGuide
          activityId={selectedActivity}
          onTimerDone={handleTimerDone}
          onChangeActivity={handleChangeActivity}
        />
      )}
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
})

export default Day9BodyJoy
