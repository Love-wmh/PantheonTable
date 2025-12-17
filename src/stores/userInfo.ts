import { create } from 'zustand'
import { persist } from 'zustand/middleware/persist'
import { useUserTokenStore } from './userToken'

// import { shallow } from "zustand/vanilla/shallow";

interface UserInfo {
  // 需要持久化用户ID
  userID: string

  // 无需持久化用户其它的信息，每次登录后从服务器获取
  username: string
  email: string
  totalGames: number
  totalWins: number
  status: 'active' | 'banned'
}

interface UserInfoState {
  userInfo: UserInfo
  isLoading: boolean
  errorMessage: string
  login: (username: string, email: string) => Promise<void>
  logout: () => void
  updateUserInfo: (userInfo: Partial<UserInfo>) => void
}

export const useUserInfoStore = create<UserInfoState>()(
  persist(
    (set) => ({
      userInfo: {
        userID: '',
        username: '',
        email: '',
        totalGames: 0,
        totalWins: 0,
        status: 'active'
      },
      isLoading: false,
      errorMessage: '',

      login: async (username: string, email: string) => {
        set({ isLoading: true, errorMessage: '' })
        try {
          // 请求用户信息
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const mockUserInfo = {
            userID: 'user123',
            username: username,
            email: `${email}@example.com`,
            totalGames: 100,
            totalWins: 60,
            status: 'active' as const
          }
          const token = 'mock-token-abc123'

          // 更新用户信息
          set({ userInfo: mockUserInfo, isLoading: false })

          // 更新用户token
          const userTokenStore = useUserTokenStore.getState()
          userTokenStore.setToken(token)
        } catch {
          set({ errorMessage: 'Login failed', isLoading: false })
        }
      },

      logout: () => {
        set({
          userInfo: {
            userID: '',
            username: '',
            email: '',
            totalGames: 0,
            totalWins: 0,
            status: 'active'
          }
        })
      },

      updateUserInfo: (userInfo: Partial<UserInfo>) => {
        set((state) => ({ userInfo: { ...state.userInfo, ...userInfo } }))
      }
    }),
    {
      name: 'user-info-storage',
      partialize: (state) => ({
        userInfo: {
          userID: state.userInfo.userID
        }
      })
    }
  )
)
