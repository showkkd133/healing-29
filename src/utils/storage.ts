import AsyncStorage from '@react-native-async-storage/async-storage'
import type { StateStorage } from 'zustand/middleware'
import { encrypt, decrypt, getOrCreateKey } from './encryption'

let encryptionKey: string | null = null

// Initialize encryption key from secure store (call once at app start)
export const initEncryption = async (): Promise<void> => {
  encryptionKey = await getOrCreateKey()
}

export const asyncStorage: StateStorage = {
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name)
    if (!value) return null
    // Key not ready yet — return raw value (pre-init or migration)
    if (!encryptionKey) return value
    try {
      return decrypt(value, encryptionKey)
    } catch {
      // Fallback for unencrypted legacy data
      return value
    }
  },
  setItem: async (name, value) => {
    const toStore = encryptionKey ? encrypt(value, encryptionKey) : value
    await AsyncStorage.setItem(name, toStore)
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name)
  },
}
