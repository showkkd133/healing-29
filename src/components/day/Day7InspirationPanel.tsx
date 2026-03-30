// Day 7 — Collapsible inspiration tags panel

import React, { useMemo, useState } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'
import { INSPIRATION_TAGS } from './Day7Constants'

interface Day7InspirationPanelProps {
  readonly activeTab: string
  readonly onTagTap: (tag: string) => void
}

const Day7InspirationPanel = React.memo(function Day7InspirationPanel({
  activeTab,
  onTagTap,
}: Day7InspirationPanelProps) {
  const [showInspiration, setShowInspiration] = useState(false)

  const currentTags = useMemo(
    () => INSPIRATION_TAGS[activeTab] ?? [],
    [activeTab]
  )

  return (
    <>
      <TouchableOpacity
        style={styles.inspirationToggle}
        onPress={() => setShowInspiration((prev) => !prev)}
        activeOpacity={0.7}
      >
        <Text style={styles.inspirationToggleText}>
          {showInspiration ? '收起灵感库 ▲' : '优点灵感库 ▼'}
        </Text>
      </TouchableOpacity>

      {showInspiration && (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.inspirationPanel}>
          {currentTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={styles.inspirationTag}
              onPress={() => onTagTap(tag)}
              activeOpacity={0.7}
            >
              <Text style={styles.inspirationTagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </>
  )
})

const styles = StyleSheet.create({
  inspirationToggle: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  inspirationToggleText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  inspirationPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING['2xl'],
  },
  inspirationTag: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.secondary,
  },
  inspirationTagText: {
    fontSize: 13,
    color: COLORS.text,
  },
})

export default Day7InspirationPanel
