import { createApiClient } from '@parking/api-client'
import { storage, STORAGE_KEYS } from './storage'

export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  getAccessToken: () => storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN),
  getRefreshToken: () => storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN),
  onTokenRefresh: (tokens) => {
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
    storage.set(STORAGE_KEYS.TOKEN_EXPIRY, Date.now() + tokens.expiresIn * 1000)
  },
  onUnauthorized: () => {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
    storage.remove(STORAGE_KEYS.USER)
    storage.remove(STORAGE_KEYS.TOKEN_EXPIRY)
    window.location.href = '/login'
  },
})

export type { ApiError } from '@parking/api-client'
