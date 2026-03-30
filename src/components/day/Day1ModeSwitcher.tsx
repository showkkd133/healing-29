import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { useHaptic } from '@/hooks/useHaptic'

// ─── Props ─────────────────────────────────────────────────────────

type InputMode = 'voice' | 'text'

interface Day1ModeSwitcherProps {
  readonly mode: InputMode
  readonly onSwitch: (mode: InputMode) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day1ModeSwitcher = React.memo(function Day1ModeSwitcher({
  mode,
  onSwitch,
}: Day1ModeSwitcherProps) {
  const haptic = useHaptic();
  
  const handleSwitch = (newMode: InputMode) => {
    if (newMode !== mode) {
      haptic.light();
      onSwitch(newMode);
    }
  };

  return (
    <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.tabRow}>
      <TouchableOpacity
        style={[styles.tab, mode === 'voice' && styles.tabActive]}
        onPress={() => handleSwitch('voice')}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <Feather 
            name="mic" 
            size={16} 
            color={mode === 'voice' ? COLORS.primary : COLORS.textTertiary} 
            style={styles.icon}
          />
          <Text style={[styles.tabText, mode === 'voice' && styles.tabTextActive]}>
            语音
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, mode === 'text' && styles.tabActive]}
        onPress={() => handleSwitch('text')}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <Feather 
            name="edit-3" 
            size={16} 
            color={mode === 'text' ? COLORS.primary : COLORS.textTertiary} 
            style={styles.icon}
          />
          <Text style={[styles.tabText, mode === 'text' && styles.tabTextActive]}>
            文字
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.xl,
    padding: 4,
    marginBottom: SPACING['3xl'],
  },
  tab: {
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg + 2,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.card,
    ...SHADOWS.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
})

export default Day1ModeSwitcher
