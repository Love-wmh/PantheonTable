import axios, {
  type AxiosInstance,
  // type AxiosRequestConfig,
  type AxiosResponse,
  type CancelTokenSource,
  AxiosError
} from 'axios'
import { useUserTokenStore } from '@/stores/userToken'

class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 从用户token store中获取token
        const tokenStore = useUserTokenStore.getState()
        const token: string | null = tokenStore.token
        // 自动添加Authorization头
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { code, data, msg } = response.data
        if (code === 200 || code === 1 || msg === '学号已存在') return data

        // 处理特定错误消息
        let msgTemp = msg
        if (msg === '账号或密码错误') {
          msgTemp = '姓名或学号错误'
        }

        // 使用console.error
        console.error(msgTemp || '服务器异常')
        if (msgTemp === '姓名或学号错误') {
          console.error('请登录您首次注册的账号，若账号已被抢注，请联系管理员')
        }
        return Promise.reject(new Error(msgTemp || 'Error'))
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_local')
          window.location.href = '/login'
        }

        const msg = (error.response?.data as object) || error.message || '网络异常，请稍后重试'

        // 使用console.error
        console.error(msg)
        return Promise.reject(error)
      }
    )
  }

  /*
  // 基本请求方法
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, { params, ...config });
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  // 高级功能
  upload<T = any>(
    url: string,
    file: File,
    onProgress?: (percent: number) => void,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const form = new FormData();
    form.append('file', file);
    return this.instance.post(url, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => onProgress?.(Math.round((evt.loaded * 100) / (evt.total || 1))),
      ...config
    });
  }
  */

  async download(url: string, filename?: string) {
    const res = await this.instance.get(url, { responseType: 'blob' })
    const blob = new Blob([res.data])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename || 'download'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  createCancelToken(): CancelTokenSource {
    return axios.CancelToken.source()
  }
}

export const apiClient = new ApiClient()
