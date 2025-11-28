import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from "axios"
import { getClientAuthToken } from "@/lib/token"
import type { User } from "@/hooks/useAuth"
import { AuthService } from "./services/auth.service"

const HttpService: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

let isRefreshing = false
let failedQueue: {
    resolve: (value: AxiosResponse) => void
    reject: (error: any) => void
    config: InternalAxiosRequestConfig
}[] = []

function processQueue(error: any, token: string | null = null): void {
    failedQueue.forEach(async ({ resolve, reject, config }) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            resolve(await HttpService(config))
        } else {
            reject(error)
        }
    })
    failedQueue = []
}

// Check if we're on the login page to prevent refresh loops
function isOnLoginPage(): boolean {
    return window.location.pathname === "/login"
}

/** Interceptor de requests para incluir Authorization desde cookie del cliente */
HttpService.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // Skip adding token for auth endpoints to prevent loops
        if (config.url?.includes("/auth/refresh") || config.url?.includes("/auth/login")) {
            return config
        }

        const token = getClientAuthToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        
        // Add selected storeId for admin viewing specific store
        const selectedStoreId = localStorage.getItem("selectedStoreId")
        if (selectedStoreId) {
            config.headers["x-store-id"] = selectedStoreId
        }
        
        return config
    },
    (error: AxiosError): Promise<never> => {
        console.error("Request Error:", error.message)
        return Promise.reject(error)
    },
)

HttpService.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<any> => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        const status = error.response?.status || 0
        const isUnauthorized = status === 401
        const isAuthEndpoint =
            originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/refresh")

        // Skip refresh logic if:
        // 1. We're on login page
        // 2. This is an auth endpoint
        // 3. We don't have a refresh token
        const hasRefreshToken = localStorage.getItem("refreshToken") !== null
        const shouldSkipRefresh = isOnLoginPage() || isAuthEndpoint || !hasRefreshToken

        console.log(
            "HTTP Interceptor - Status:",
            status,
            "URL:",
            originalRequest?.url,
            "IsLoginPage:",
            isOnLoginPage(),
            "HasRefreshToken:",
            hasRefreshToken,
        )

        if (isUnauthorized && !originalRequest._retry && !shouldSkipRefresh) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: originalRequest })
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                console.log("HTTP Interceptor attempting refresh...")
                const user: User | null = await AuthService.refresh()

                if (user) {
                    const newToken = getClientAuthToken()
                    processQueue(null, newToken)

                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return HttpService(originalRequest)
                } else {
                    processQueue(new Error("Usuario no encontrado tras refresh"), null)
                    throw error
                }
            } catch (refreshError) {
                processQueue(refreshError, null)

                // Only redirect if not already on login page
                if (!isOnLoginPage()) {
                    AuthService.logout()
                    window.location.replace("/login")
                }

                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    },
)

export { HttpService }
