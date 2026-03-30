// Encryption utilities for securing sensitive emotion and journal data at rest.
//
// TRANSITION APPROACH: Uses key-derived XOR with random IV via expo-crypto.
// This is NOT true AES encryption but significantly stronger than plain XOR
// (random IV prevents pattern analysis). For production, replace with
// react-native-quick-crypto AES-256-GCM.
//
// The encryption key is stored in expo-secure-store (hardware-backed keychain
// on iOS, encrypted SharedPreferences on Android).

import * as Crypto from 'expo-crypto'
import * as SecureStore from 'expo-secure-store'

const KEY_ALIAS = 'healing29_encryption_key'

// Generate or retrieve the encryption key from secure storage
export const getOrCreateKey = async (): Promise<string> => {
  const existing = await SecureStore.getItemAsync(KEY_ALIAS)
  if (existing) return existing

  const key = Crypto.randomUUID()
  await SecureStore.setItemAsync(KEY_ALIAS, key)
  return key
}

// Encrypt plaintext using key-derived XOR with a random IV
export const encrypt = (plaintext: string, key: string): string => {
  const iv = Crypto.getRandomValues(new Uint8Array(16))
  const ivHex = bytesToHex(iv)

  const keyBytes = new TextEncoder().encode(key)
  const data = new TextEncoder().encode(plaintext)
  const encrypted = new Uint8Array(data.length)

  for (let i = 0; i < data.length; i++) {
    encrypted[i] = data[i] ^ keyBytes[(i + iv[i % 16]) % keyBytes.length] ^ iv[i % 16]
  }

  const encHex = bytesToHex(encrypted)
  return `${ivHex}:${encHex}`
}

// Decrypt ciphertext produced by encrypt()
// Returns raw input if format is unrecognized (supports migration from unencrypted data)
export const decrypt = (ciphertext: string, key: string): string => {
  const separatorIndex = ciphertext.indexOf(':')
  if (separatorIndex !== 32) return ciphertext // Not our format — return as-is for migration

  const ivHex = ciphertext.slice(0, 32)
  const encHex = ciphertext.slice(33)
  if (!ivHex || !encHex) return ciphertext

  const iv = hexToBytes(ivHex)
  const encrypted = hexToBytes(encHex)
  const keyBytes = new TextEncoder().encode(key)

  const decrypted = new Uint8Array(encrypted.length)
  for (let i = 0; i < encrypted.length; i++) {
    decrypted[i] = encrypted[i] ^ keyBytes[(i + iv[i % 16]) % keyBytes.length] ^ iv[i % 16]
  }

  return new TextDecoder().decode(decrypted)
}

// ─── Internal helpers ──────────────────────────────────────────────

const hexToBytes = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
