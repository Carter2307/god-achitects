import SecureLS from 'secure-ls'

const ls = new SecureLS({
  encodingType: 'aes',
  encryptionSecret: import.meta.env.VITE_STORAGE_SECRET || 'parking-app-secret',
  isCompression: false,
})

export const storage = {
  get<T>(key: string): T | null {
    try {
      return ls.get(key) as T
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      ls.set(key, value)
    } catch (error) {
      console.error('Error saving to storage:', error)
    }
  },

  remove(key: string): void {
    try {
      ls.remove(key)
    } catch (error) {
      console.error('Error removing from storage:', error)
    }
  },

  clear(): void {
    try {
      ls.removeAll()
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  },
}

// Storage keys constants
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  TOKEN_EXPIRY: 'tokenExpiry',
} as const
