// Day 11 — Setup phase: duration selection and start button

import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ZenButton } from '@/components/ui/ZenButton'
import { useHaptic } from '@/hooks/useHaptic'
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
  const haptic = useHaptic();

  const handleSelectDuration = (id: string) => {
    haptic.light();
    onSelectDuration(id);
  }

  const handleSetCustomMinutes = (minutes: number) => {
    haptic.light();
    onSetCustomMinutes(minutes);
  }

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
            <ZenButton
              key={option.id}
              title={option.label}
              variant={selectedDuration === option.id ? 'primary' : 'outline'}
              onPress={() => handleSelectDuration(option.id)}
              style={styles.durationButton}
            />
          ))}
        </Animated.View>

        {selectedDuration === 'custom' && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>{customMinutes} 分钟</Text>
            <View style={styles.sliderTrack}>
              {[60, 90, 120, 150, 180, 210, 240].map((value) => (
                <ZenButton
                  key={value}
                  title={`${value / 60}h`}
                  variant={customMinutes === value ? 'primary' : 'ghost'}
                  size="sm"
                  onPress={() => handleSetCustomMinutes(value)}
                  style={styles.sliderDot}
                />
              ))}
            </View>
          </Animated.View>
        )}

        {selectedDuration && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.startWrapper}>
            <ZenButton
              title="开始崩溃"
              variant="primary"
              size="lg"
              onPress={onStartMeltdown}
              fullWidth
            />
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
    minWidth: 44,
  },
  startWrapper: {
    marginTop: SPACING['3xl'],
    paddingHorizontal: SPACING.xl,
  },
})

export default Day11SetupPhase
