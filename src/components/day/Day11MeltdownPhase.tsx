// Day 11 — Meltdown phase: countdown timer and tool cards

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { useHaptic } from '@/hooks/useHaptic'
import { TOOLS, formatCountdown } from './Day11constants'
import { PhotoViewer, SadPlaylist, MemoryTimeline, VentBoard } from './Day11ToolContent'

interface Day11MeltdownPhaseProps {
  readonly remainingSeconds: number
  readonly expandedTool: string | null
  readonly toolsUsed: readonly string[]
  readonly ventText: string
  readonly onToolPress: (toolId: string) => void
  readonly onVentTextChange: (text: string) => void
}

const Day11MeltdownPhase = React.memo(function Day11MeltdownPhase({
  remainingSeconds,
  expandedTool,
  toolsUsed,
  ventText,
  onToolPress,
  onVentTextChange,
}: Day11MeltdownPhaseProps) {
  const haptic = useHaptic();

  const handleToolPress = (toolId: string) => {
    haptic.medium();
    onToolPress(toolId);
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Countdown */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.countdownContainer}>
          <Text style={styles.countdownLabel}>剩余崩溃时间</Text>
          <Text style={styles.countdownText}>{formatCountdown(remainingSeconds)}</Text>
        </Animated.View>

        {/* Tool cards */}
        <View style={styles.toolGrid}>
          {TOOLS.map((tool, index) => (
            <Animated.View key={tool.id} entering={FadeInDown.delay(index * 100).duration(400)}>
              <TouchableOpacity
                style={[
                  styles.toolCard,
                  expandedTool === tool.id && styles.toolCardExpanded,
                  toolsUsed.includes(tool.id) && styles.toolCardUsed,
                ]}
                onPress={() => handleToolPress(tool.id)}
                activeOpacity={0.8}
              >
                <View style={styles.toolHeader}>
                  <Feather 
                    name={tool.iconName as any} 
                    size={24} 
                    color={expandedTool === tool.id ? COLORS.primary : COLORS.textSecondary} 
                  />
                  <Text style={[
                    styles.toolTitle,
                    expandedTool === tool.id && styles.toolTitleActive
                  ]}>{tool.title}</Text>
                </View>

                {expandedTool === tool.id && (
                  <Animated.View entering={FadeIn.duration(300)} style={styles.toolContent}>
                    {tool.id === 'photos' && <PhotoViewer />}
                    {tool.id === 'music' && <SadPlaylist />}
                    {tool.id === 'timeline' && <MemoryTimeline />}
                    {tool.id === 'vent' && (
                      <VentBoard ventText={ventText} onChangeText={onVentTextChange} />
                    )}
                  </Animated.View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  content: {
    paddingBottom: SPACING['5xl'],
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  countdownLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  countdownText: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  toolGrid: {
    gap: SPACING.lg,
  },
  toolCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toolCardExpanded: {
    borderColor: COLORS.primary,
  },
  toolCardUsed: {
    borderColor: COLORS.stageEmergency,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  toolIcon: {
    fontSize: 24,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  toolContent: {
    marginTop: SPACING.lg,
  },
})

export default Day11MeltdownPhase
