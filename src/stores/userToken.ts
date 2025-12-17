import { create } from 'zustand'
import { persist } from 'zustand/middleware/persist'

interface UserTokenState {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
  isAuthenticated: () => boolean
}

export const useUserTokenStore = create<UserTokenState>()(
  persist(
    (set, get) => ({
      token: null,
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: null }),
      isAuthenticated: () => {
        const token = get().token
        return token !== null && token !== ''
      }
    }),
    {
      name: 'user-token-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
)
