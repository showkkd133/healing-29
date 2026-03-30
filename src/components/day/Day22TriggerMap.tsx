import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { GUIDANCE_TEXT, type TriggerEntry } from './Day22Constants'
import Day22CompletedView from './Day22CompletedView'
import Day22TriggerCard from './Day22TriggerCard'
import Day22TriggerForm from './Day22TriggerForm'

// ─── Props ────────────────────────────────────────────────────────

interface Day22TriggerMapProps {
  readonly onComplete: (data: {
    readonly triggers: ReadonlyArray<{
      readonly type: string
      readonly name: string
      readonly response: string
      readonly strategy: string
      readonly effectiveness: number
    }>
  }) => void
}

// ─── Main component ───────────────────────────────────────────────

const Day22TriggerMap = React.memo(function Day22TriggerMap({
  onComplete,
}: Day22TriggerMapProps) {
  const [triggers, setTriggers] = useState<ReadonlyArray<TriggerEntry>>([])
  const [isAdding, setIsAdding] = useState(true)
  const [completed, setCompleted] = useState(false)

  const handleAddTrigger = useCallback((newTrigger: TriggerEntry) => {
    setTriggers((prev) => [...prev, newTrigger])
    setIsAdding(false)
  }, [])

  const handleComplete = useCallback(async () => {
    setCompleted(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
    onComplete({ triggers: [...triggers] })
  }, [triggers, onComplete])

  // ─── Render: completed state ──────────────────────────────────

  if (completed) {
    return <Day22CompletedView />
  }

  // ─── Render: main ─────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Guidance */}
        <Animated.Text entering={FadeIn.delay(200).duration(500)} style={styles.guidanceText}>
          {GUIDANCE_TEXT}
        </Animated.Text>

        {/* Existing triggers list */}
        {triggers.length > 0 && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.triggerListSection}>
            <Text style={styles.sectionLabel}>已标记的触发点</Text>
            {triggers.map((trigger, index) => (
              <Day22TriggerCard key={index} trigger={trigger} index={index} />
            ))}
          </Animated.View>
        )}

        {/* Add new trigger form */}
        {isAdding ? (
          <Day22TriggerForm onAdd={handleAddTrigger} />
        ) : (
          <Animated.View entering={FadeIn.duration(300)} style={styles.actionRow}>
            <TouchableOpacity
              style={styles.addMoreButton}
              onPress={() => setIsAdding(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.addMoreText}>+ 添加更多触发点</Text>
            </TouchableOpacity>

            {triggers.length > 0 && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}
                activeOpacity={0.8}
              >
                <Text style={styles.completeButtonText}>完成标记</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING['5xl'],
  },
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: SPACING['3xl'],
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  triggerListSection: {
    marginBottom: SPACING.xl,
  },
  actionRow: {
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  addMoreButton: {
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  addMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  completeButton: {
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day22TriggerMap
