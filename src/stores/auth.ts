import { computed, reactive } from 'vue'
import { apiRequest } from '../lib/api'
import type { AuthResponse, AuthUser } from '../types/auth'

const TOKEN_KEY = 'pkkmb_token'

const state = reactive<{
  token: string | null
  user: AuthUser | null
  initialized: boolean
}>({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  initialized: false,
})

export function useAuthStore() {
  const isLoggedIn = computed(() => Boolean(state.token && state.user))
  const isAdmin = computed(() => state.user?.role === 'admin')
  const isStudent = computed(() => state.user?.role === 'student')

  const setAuth = (payload: AuthResponse) => {
    state.token = payload.token
    state.user = payload.user
    localStorage.setItem(TOKEN_KEY, payload.token)
  }

  const clearAuth = () => {
    state.token = null
    state.user = null
    localStorage.removeItem(TOKEN_KEY)
  }

  const init = async () => {
    if (!state.token) {
      state.initialized = true
      return
    }
    try {
      const user = await apiRequest<AuthUser>('/api/auth/me', { token: state.token })
      state.user = user
    } catch (_error) {
      clearAuth()
    } finally {
      state.initialized = true
    }
  }

  const login = async (email: string, password: string) => {
    const result = await apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setAuth(result)
    return result.user
  }

  const registerStudent = async (fullName: string, email: string, password: string) => {
    const result = await apiRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: { fullName, email, password },
    })
    setAuth(result)
    return result.user
  }

  return {
    state,
    isLoggedIn,
    isAdmin,
    isStudent,
    init,
    login,
    registerStudent,
    clearAuth,
  }
}
