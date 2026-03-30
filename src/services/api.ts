// API service layer connecting frontend to server
const API_BASE = __DEV__
  ? 'http://localhost:3001/api'
  : 'https://api.healing29.app/api'

interface ApiResponse<T> {
  readonly success: boolean
  readonly data?: T
  readonly error?: string
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: 'Network request failed' }
  }
}

// User endpoints
export const userApi = {
  create: () =>
    request<{ id: string }>('/users', { method: 'POST' }),
  get: (id: string) =>
    request<unknown>(`/users/${id}`),
  update: (id: string, data: Record<string, unknown>) =>
    request<unknown>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
} as const

// Journey endpoints
export const journeyApi = {
  getDayLog: (userId: string, day: number) =>
    request<unknown>(`/journey/${userId}/days/${day}`),
  completeDayLog: (userId: string, day: number, data: Record<string, unknown>) =>
    request<unknown>(`/journey/${userId}/days/${day}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
} as const

// Badge endpoints
export const badgeApi = {
  getAll: (userId: string) =>
    request<unknown>(`/badges/${userId}`),
} as const

// Notification endpoints
export const notificationApi = {
  getPreferences: (userId: string) =>
    request<unknown>(`/notifications/${userId}/settings`),
  updatePreferences: (userId: string, data: Record<string, unknown>) =>
    request<unknown>(`/notifications/${userId}/settings`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
} as const
