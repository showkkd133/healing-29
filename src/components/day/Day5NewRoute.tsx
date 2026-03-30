import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'
import RouteSelection from './Day5RouteSelection'
import CheckinView from './Day5CheckinView'
import type { RouteOption } from './Day5RouteSelection'

// ─── Props ─────────────────────────────────────────────────────────

interface Day5NewRouteProps {
  readonly onComplete: (data: {
    readonly routeChoice: string
    readonly discoveryTag: string
    readonly photoTaken: boolean
  }) => void
}

// ─── Constants ─────────────────────────────────────────────────────

const COMPLETION_TEXT = '你的肌肉记忆更新了0.01%'

// ─── Main component ────────────────────────────────────────────────

const Day5NewRoute = React.memo(function Day5NewRoute({
  onComplete,
}: Day5NewRouteProps) {
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null)
  const [showCheckin, setShowCheckin] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleArrive = useCallback((route: RouteOption) => {
    setSelectedRoute(route)
    setShowCheckin(true)
  }, [])

  const handleCheckinComplete = useCallback((tag: string, photoTaken: boolean) => {
    if (!selectedRoute) return
    setCompleted(true)
    onComplete({
      routeChoice: selectedRoute.id,
      discoveryTag: tag,
      photoTaken,
    })
  }, [selectedRoute, onComplete])

  // ─── Render: completed state ─────────────────────────────────────

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🗺️</Text>
          <Text style={styles.completedText}>{COMPLETION_TEXT}</Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: check-in ───────────────────────────────────────────

  if (showCheckin) {
    return (
      <CheckinView
        scrollContentStyle={styles.scrollContent}
        onComplete={handleCheckinComplete}
      />
    )
  }

  // ─── Render: route selection ─────────────────────────────────────

  return (
    <RouteSelection
      scrollContentStyle={styles.scrollContent}
      onArrive={handleArrive}
    />
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

export default Day5NewRoute
