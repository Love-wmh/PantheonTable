import { apiClient } from './http'

// 定义请求/响应类型
interface LoginParams {
  username: string
  password: string
}

interface RegisterParams {
  username: string
  email: string
  password: string
}

interface AuthResponse {
  token: string
  userID: string
}

// 登录API
export const login = async (params: LoginParams): Promise<AuthResponse> => {
  return await apiClient.post('/auth/login', params)
}

// 注册API
export const register = async (params: RegisterParams): Promise<AuthResponse> => {
  return await apiClient.post('/auth/register', params)
}

// 登出API
export const logout = async (): Promise<void> => {
  return await apiClient.post('/auth/logout')
}

// 刷新token
export const refreshToken = async (): Promise<{ token: string }> => {
  return await apiClient.post('/auth/refresh-token')
}
