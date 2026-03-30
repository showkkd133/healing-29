import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { Audio } from 'expo-av'
import { COLORS, SPACING } from '@/constants/theme'
import type { Day1Data, PrivacyLevel } from '@/types'
import Day1VoiceRecorder from './Day1VoiceRecorder'
import Day1TextEntry from './Day1TextEntry'
import Day1NamingScreen from './Day1NamingScreen'
import Day1CompletedScreen from './Day1CompletedScreen'
import Day1ModeSwitcher from './Day1ModeSwitcher'

// ─── Props ─────────────────────────────────────────────────────────

interface Day1EmotionWeatherProps {
  readonly onComplete: (data: Day1Data & { readonly recordingName: string; readonly storage: PrivacyLevel }) => void
}

// ─── Constants ─────────────────────────────────────────────────────

type InputMode = 'voice' | 'text'

const MAX_RECORDING_MS = 3 * 60 * 1000

const GUIDANCE_TEXT = '不用组织语言，像对老朋友吐槽一样，说出此刻所有感受'

// ─── Default recording name ────────────────────────────────────────

const getDefaultName = (): string => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日的我`
}

// ─── Main component ────────────────────────────────────────────────

const Day1EmotionWeather = React.memo(function Day1EmotionWeather({
  onComplete,
}: Day1EmotionWeatherProps) {
  const [mode, setMode] = useState<InputMode>('voice')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDone, setRecordingDone] = useState(false)
  const [recordingUri, setRecordingUri] = useState<string | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [textEntry, setTextEntry] = useState('')
  const [recordingName, setRecordingName] = useState(getDefaultName)
  const [showNaming, setShowNaming] = useState(false)
  const [completed, setCompleted] = useState(false)

  const recordingRef = useRef<Audio.Recording | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      // Stop and unload any active recording to prevent memory leak
      recordingRef.current?.stopAndUnloadAsync().catch(() => {})
    }
  }, [])

  // ─── Recording controls ────────────────────────────────────────

  const startRecording = useCallback(async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync()
      if (!granted) {
        Alert.alert('权限不足', '需要麦克风权限才能录音')
        return
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      recordingRef.current = recording
      setIsRecording(true)
      setElapsedMs(0)

      // Start timer
      const startTime = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        if (elapsed >= MAX_RECORDING_MS) {
          stopRecording()
        } else {
          setElapsedMs(elapsed)
        }
      }, 200)

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch (error) {
      // Fallback for environments without audio support (simulator, web)
      setIsRecording(true)
      setElapsedMs(0)
      const startTime = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        if (elapsed >= MAX_RECORDING_MS) {
          stopRecording()
        } else {
          setElapsedMs(elapsed)
        }
      }, 200)
    }
  }, [])

  const stopRecording = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRecording(false)

    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync()
        const uri = recordingRef.current.getURI()
        setRecordingUri(uri)
        recordingRef.current = null
      }
    } catch {
      // Mock URI for environments without audio
      setRecordingUri('mock://recording.m4a')
    }

    setRecordingDone(true)
    setShowNaming(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
  }, [])

  const handleRecordPress = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  // ─── Text mode submit ──────────────────────────────────────────

  const handleTextSubmit = useCallback(() => {
    if (textEntry.trim().length === 0) return
    setRecordingDone(true)
    setShowNaming(true)
  }, [textEntry])

  // ─── Save handler ─────────────────────────────────────────────

  const handleSave = useCallback(
    (storage: PrivacyLevel) => {
      setCompleted(true)
      onComplete({
        type: 'day1',
        audioFileUri: mode === 'voice' ? recordingUri : null,
        textEntry: mode === 'text' ? textEntry : null,
        moodScore: 5,
        recordingName,
        storage,
      })
    },
    [mode, recordingUri, textEntry, recordingName, onComplete]
  )

  // ─── Mode switch ──────────────────────────────────────────────

  const switchMode = useCallback(
    async (next: InputMode) => {
      if (next === mode) return
      setMode(next)
      try {
        await Haptics.selectionAsync()
      } catch {
        // Haptics not available
      }
    },
    [mode]
  )

  // ─── Render: completed state ──────────────────────────────────

  if (completed) {
    return <Day1CompletedScreen />
  }

  // ─── Render: naming + save ────────────────────────────────────

  if (showNaming) {
    return (
      <Day1NamingScreen
        recordingName={recordingName}
        defaultName={getDefaultName()}
        onChangeName={setRecordingName}
        onSave={handleSave}
      />
    )
  }

  // ─── Render: main input ───────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Guidance text */}
      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.guidanceText}>
        {GUIDANCE_TEXT}
      </Animated.Text>

      {/* Mode switcher tabs */}
      <Day1ModeSwitcher mode={mode} onSwitch={switchMode} />

      {/* Voice mode */}
      {mode === 'voice' && (
        <Day1VoiceRecorder
          isRecording={isRecording}
          elapsedMs={elapsedMs}
          onRecordPress={handleRecordPress}
        />
      )}

      {/* Text mode */}
      {mode === 'text' && (
        <Day1TextEntry
          textEntry={textEntry}
          onChangeText={setTextEntry}
          onSubmit={handleTextSubmit}
        />
      )}
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
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
})

export default Day1EmotionWeather
