import { describe, it, expect, beforeEach } from 'bun:test'
import { useUserStore } from '../userStore'

describe('userStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      userId: null,
      currentDay: 1,
      streakDays: 0,
      createdAt: null,
      notificationTime: '20:00',
      privacyLevel: 'local',
      _hasHydrated: false,
    })
  })

  it('should initialize user', () => {
    const { initUser } = useUserStore.getState()
    initUser()
    const state = useUserStore.getState()
    expect(state.userId).toBeTruthy()
    expect(state.currentDay).toBe(1)
    expect(state.createdAt).toBeTruthy()
  })

  it('should advance day', () => {
    useUserStore.setState({ userId: 'test', currentDay: 1 })
    const { advanceDay } = useUserStore.getState()
    advanceDay()
    expect(useUserStore.getState().currentDay).toBe(2)
  })

  it('should not advance past day 29', () => {
    useUserStore.setState({ userId: 'test', currentDay: 29 })
    const { advanceDay } = useUserStore.getState()
    advanceDay()
    expect(useUserStore.getState().currentDay).toBe(29)
  })

  it('should update preferences', () => {
    const { updatePreferences } = useUserStore.getState()
    updatePreferences({ notificationTime: '08:00' })
    expect(useUserStore.getState().notificationTime).toBe('08:00')
  })
})
