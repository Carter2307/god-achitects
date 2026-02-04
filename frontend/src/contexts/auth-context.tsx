import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { LoginDto, RegisterDto, AuthResponse } from '@parking/api-client'
import { api } from '@/lib/api'
import { storage, STORAGE_KEYS } from '@/lib/storage'

// Local user type that matches the API response
export interface AppUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: string
  updatedAt?: string
}

interface AuthContextType {
  user: AppUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginDto) => Promise<void>
  register: (data: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const saveAuthData = useCallback((response: AuthResponse) => {
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken)
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
    storage.set(STORAGE_KEYS.USER, response.user)
    storage.set(STORAGE_KEYS.TOKEN_EXPIRY, Date.now() + response.expiresIn * 1000)
    setUser(response.user as AppUser)
  }, [])

  const clearAuthData = useCallback(() => {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
    storage.remove(STORAGE_KEYS.USER)
    storage.remove(STORAGE_KEYS.TOKEN_EXPIRY)
    setUser(null)
  }, [])

  const login = useCallback(
    async (data: LoginDto) => {
      const response = await api.auth.login(data)
      saveAuthData(response)
    },
    [saveAuthData]
  )

  const register = useCallback(
    async (data: RegisterDto) => {
      const response = await api.auth.register(data)
      saveAuthData(response)
    },
    [saveAuthData]
  )

  const logout = useCallback(async () => {
    try {
      const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN)
      if (refreshToken) {
        await api.auth.logout({ refreshToken })
      }
    } catch {
      // Ignore errors during logout
    } finally {
      clearAuthData()
    }
  }, [clearAuthData])

  const refreshUser = useCallback(async () => {
    try {
      const { user: updatedUser } = await api.auth.me()
      setUser(updatedUser as AppUser)
      storage.set(STORAGE_KEYS.USER, updatedUser)
    } catch {
      clearAuthData()
    }
  }, [clearAuthData])

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      try {
        const storedUser = storage.get<AppUser>(STORAGE_KEYS.USER)
        const accessToken = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN)
        const tokenExpiry = storage.get<number>(STORAGE_KEYS.TOKEN_EXPIRY)

        if (storedUser && accessToken) {
          // Check if token is expired
          if (tokenExpiry && Date.now() > tokenExpiry) {
            // Try to refresh
            const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN)
            if (refreshToken) {
              try {
                const response = await api.auth.refresh({ refreshToken })
                saveAuthData(response)
              } catch {
                clearAuthData()
              }
            } else {
              clearAuthData()
            }
          } else {
            // Token is still valid, verify with server
            setUser(storedUser)
            try {
              await refreshUser()
            } catch {
              // Keep stored user if server is unreachable
            }
          }
        }
      } catch {
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [clearAuthData, refreshUser, saveAuthData])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
