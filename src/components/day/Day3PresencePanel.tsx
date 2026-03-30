import React, { useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { NEARBY_PLACES, COMPANION_COUNT } from './Day3Constants'
import type { NearbyPlace } from './Day3Constants'

// ─── Props ─────────────────────────────────────────────────────────

interface Day3PresencePanelProps {
  readonly onDone: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day3PresencePanel = React.memo(function Day3PresencePanel({
  onDone,
}: Day3PresencePanelProps) {
  const [checkedIn, setCheckedIn] = useState(false)

  const handleCheckIn = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      // Haptics not available
    }
    setCheckedIn(true)
    onDone()
  }, [onDone])

  if (checkedIn) {
    return (
      <Animated.View entering={FadeIn.duration(800)} style={styles.finishContainer}>
        <Text style={styles.finishEmoji}>🫂</Text>
        <Text style={styles.finishText}>
          此刻有 {COMPANION_COUNT.toLocaleString()} 人也在独自坐着
        </Text>
      </Animated.View>
    )
  }

  const renderPlace = ({ item, index }: { item: NearbyPlace; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <View style={styles.placeRow}>
        <Text style={styles.placeIcon}>{item.type}</Text>
        <View style={styles.placeInfo}>
          <Text style={styles.placeName}>{item.name}</Text>
          <Text style={styles.placeDistance}>{item.distance}</Text>
        </View>
      </View>
    </Animated.View>
  )

  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.panelContainer}>
      <Text style={styles.panelTitle}>附近可以坐坐的地方</Text>

      <FlatList
        data={NEARBY_PLACES}
        keyExtractor={(item) => item.id}
        renderItem={renderPlace}
        scrollEnabled={false}
        contentContainerStyle={styles.placeList}
      />

      <TouchableOpacity
        style={styles.checkInButton}
        onPress={handleCheckIn}
        activeOpacity={0.8}
      >
        <Text style={styles.checkInText}>陪伴打卡 📍</Text>
      </TouchableOpacity>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Panel shared
  panelContainer: {
    flex: 1,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },

  // Place list
  placeList: {
    gap: SPACING.sm,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  placeIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeDistance: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  checkInButton: {
    marginTop: SPACING['2xl'],
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  checkInText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },

  // Finish state
  finishContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xl,
  },
  finishText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day3PresencePanel
