import React, { useCallback, useState } from 'react'
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInRight,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Constants ────────────────────────────────────────────────────

const GUIDANCE_TEXT = '今天走一条从未走过的路'

export interface RouteOption {
  readonly id: string
  readonly title: string
  readonly icon: string
  readonly navHint: string
}

export const ROUTE_OPTIONS: readonly RouteOption[] = [
  {
    id: 'detour',
    title: '绕远路去公司',
    icon: '🛤️',
    navHint: '向东走约10分钟，经过那条有梧桐树的街道',
  },
  {
    id: 'new-shop',
    title: '去一家没去过的店',
    icon: '🏪',
    navHint: '往南走约5分钟，转角有一家新开的小店',
  },
  {
    id: 'custom',
    title: '我自己决定',
    icon: '🧭',
    navHint: '选一个方向，走到觉得可以停下来的地方',
  },
] as const

// ─── Props ────────────────────────────────────────────────────────

interface RouteSelectionProps {
  readonly scrollContentStyle: object
  readonly onArrive: (route: RouteOption) => void
}

// ─── Component ────────────────────────────────────────────────────

const RouteSelection = React.memo(function RouteSelection({
  scrollContentStyle,
  onArrive,
}: RouteSelectionProps) {
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null)

  const handleSelectRoute = useCallback(async (route: RouteOption) => {
    setSelectedRoute(route)
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      // Haptics not available
    }
  }, [])

  const handleArrive = useCallback(async () => {
    if (!selectedRoute) return
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {
      // Haptics not available
    }
    onArrive(selectedRoute)
  }, [selectedRoute, onArrive])

  return (
    <ScrollView style={styles.container} contentContainerStyle={scrollContentStyle}>
      {/* Guidance */}
      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.guidanceText}>
        {GUIDANCE_TEXT}
      </Animated.Text>

      {/* Route option cards */}
      {ROUTE_OPTIONS.map((route, index) => (
        <Animated.View
          key={route.id}
          entering={SlideInRight.delay(500 + index * 150).duration(400)}
        >
          <TouchableOpacity
            style={[
              styles.routeCard,
              selectedRoute?.id === route.id && styles.routeCardActive,
            ]}
            onPress={() => handleSelectRoute(route)}
            activeOpacity={0.7}
          >
            <Text style={styles.routeIcon}>{route.icon}</Text>
            <Text style={styles.routeTitle}>{route.title}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}

      {/* Navigation hint */}
      {selectedRoute && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.navHintContainer}>
          <Text style={styles.navArrow}>➡️</Text>
          <Text style={styles.navHintText}>{selectedRoute.navHint}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleArrive}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>我到了</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['3xl'],
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  routeCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F6FA',
  },
  routeIcon: {
    fontSize: 32,
    marginRight: SPACING.lg,
  },
  routeTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  navHintContainer: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
    gap: SPACING.md,
  },
  navArrow: {
    fontSize: 40,
  },
  navHintText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    alignSelf: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default RouteSelection
