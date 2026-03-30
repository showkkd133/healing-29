// Day 11 — Setup phase: duration selection and start button

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { DURATION_OPTIONS } from './Day11constants'

interface Day11SetupPhaseProps {
  readonly selectedDuration: string | null
  readonly customMinutes: number
  readonly onSelectDuration: (id: string) => void
  readonly onSetCustomMinutes: (minutes: number) => void
  readonly onStartMeltdown: () => void
}

const Day11SetupPhase = React.memo(function Day11SetupPhase({
  selectedDuration,
  customMinutes,
  onSelectDuration,
  onSetCustomMinutes,
  onStartMeltdown,
}: Day11SetupPhaseProps) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.Text entering={FadeIn.delay(200).duration(600)} style={styles.guidanceText}>
          设置你的崩溃时长
        </Animated.Text>
        <Animated.Text entering={FadeIn.delay(400).duration(400)} style={styles.guidanceSubtext}>
          给悲伤一个期限，允许自己在这段时间里全然崩溃
        </Animated.Text>

        <Animated.View entering={SlideInDown.delay(600).duration(500)} style={styles.durationOptions}>
          {DURATION_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.durationButton,
                selectedDuration === option.id && styles.durationButtonActive,
              ]}
              onPress={() => onSelectDuration(option.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.durationText,
                  selectedDuration === option.id && styles.durationTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {selectedDuration === 'custom' && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>{customMinutes} 分钟</Text>
            <View style={styles.sliderTrack}>
              {[60, 90, 120, 150, 180, 210, 240].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.sliderDot,
                    customMinutes === value && styles.sliderDotActive,
                  ]}
                  onPress={() => onSetCustomMinutes(value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sliderDotLabel}>{value / 60}h</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {selectedDuration && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.startWrapper}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={onStartMeltdown}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>开始崩溃</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
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
  guidanceText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  guidanceSubtext: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING['3xl'],
  },
  durationOptions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  durationButton: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  durationButtonActive: {
    backgroundColor: COLORS.stageEmergency,
    borderColor: COLORS.stageEmergency,
  },
  durationText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  durationTextActive: {
    color: COLORS.card,
  },
  sliderContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  sliderTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  sliderDot: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  sliderDotActive: {
    backgroundColor: COLORS.stageEmergency,
    borderRadius: BORDER_RADIUS.md,
  },
  sliderDotLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  startWrapper: {
    marginTop: SPACING['3xl'],
    alignItems: 'center',
  },
  startButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['4xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.stageEmergency,
    ...SHADOWS.md,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day11SetupPhase
