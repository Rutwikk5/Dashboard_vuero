import axios, {
  type RawAxiosRequestHeaders,
  type AxiosInstance,
  type AxiosRequestHeaders,
} from 'axios'

import { useUserSession } from '/@src/stores/userSession'

let api: AxiosInstance

export function createApi() {
  // Here we set the base URL for all requests made to the api
  api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  })

  // We set an interceptor for each request to
  // include Bearer token to the request if user is logged in
  api.interceptors.request.use((config) => {
    const userSession = useUserSession()

    if (userSession.isLoggedIn) {
      config.headers = {
        ...((config.headers as RawAxiosRequestHeaders) ?? {}),
        Authorization: `Bearer ${userSession.token}`,
      } as AxiosRequestHeaders
    }

    return config
  })

  return api
}

export function useApi() {
  if (!api) {
    createApi()
  }
  return api
}
