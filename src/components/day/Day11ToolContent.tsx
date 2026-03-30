// Day 11 — Tool content sub-components (photo viewer, playlist, timeline, vent board)

import React, { useMemo } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { MOCK_SONGS } from './Day11constants'

// ─── PhotoViewer ──────────────────────────────────────────────────

export const PhotoViewer = React.memo(function PhotoViewer() {
  return (
    <View style={styles.placeholder}>
      <Feather name="camera" size={40} color={COLORS.textTertiary} style={styles.placeholderIcon} />
      <Text style={styles.placeholderText}>此功能需要上传照片</Text>
      <Text style={styles.placeholderHint}>你可以在相册里安静地看一看</Text>
    </View>
  )
})

// ─── SadPlaylist ──────────────────────────────────────────────────

export const SadPlaylist = React.memo(function SadPlaylist() {
  return (
    <View style={styles.listContainer}>
      {MOCK_SONGS.map((song, index) => (
        <View key={index} style={styles.songRow}>
          <Text style={styles.songIndex}>{index + 1}</Text>
          <Text style={styles.songName}>{song}</Text>
        </View>
      ))}
    </View>
  )
})

// ─── MemoryTimeline ───────────────────────────────────────────────

export const MemoryTimeline = React.memo(function MemoryTimeline() {
  return (
    <View style={styles.timelineContainer}>
      {[1, 2, 3].map((_, index) => (
        <View key={index} style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineLine} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelinePlaceholder}>在这里写下一段回忆…</Text>
          </View>
        </View>
      ))}
    </View>
  )
})

// ─── VentBoard ────────────────────────────────────────────────────

interface VentBoardProps {
  readonly ventText: string
  readonly onChangeText: (text: string) => void
}

export const VentBoard = React.memo(function VentBoard({ ventText, onChangeText }: VentBoardProps) {
  const randomSizes = useMemo(() => {
    return Array.from({ length: 20 }, () => 14 + Math.floor(Math.random() * 24))
  }, [])

  return (
    <View style={styles.ventContainer}>
      <TextInput
        style={[styles.ventInput, { fontSize: randomSizes[ventText.length % 20] }]}
        value={ventText}
        onChangeText={onChangeText}
        placeholder="在这里发泄，随便打…"
        placeholderTextColor="#666"
        multiline
        textAlignVertical="top"
        autoFocus
      />
    </View>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  placeholderText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  placeholderHint: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
  listContainer: {
    padding: SPACING.md,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  songIndex: {
    width: 24,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textTertiary,
  },
  songName: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  timelineContainer: {
    padding: SPACING.md,
    paddingLeft: SPACING.xl,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: 4,
    top: 14,
    bottom: -SPACING.xl,
    width: 2,
    backgroundColor: COLORS.border,
  },
  timelineContent: {
    flex: 1,
    marginLeft: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  timelinePlaceholder: {
    fontSize: 14,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
  },
  ventContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: BORDER_RADIUS.lg,
    minHeight: 200,
    padding: SPACING.lg,
  },
  ventInput: {
    flex: 1,
    color: '#FF6B6B',
    fontWeight: '700',
    minHeight: 180,
  },
})
