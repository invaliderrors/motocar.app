import type { User } from "@/hooks/useAuth"
import { HttpService } from "../http"
import { LoginResponse } from "../types"


const ACCESS_TOKEN_COOKIE = "authToken"
const REFRESH_TOKEN_KEY = "refreshToken"

function setAccessToken(token: string, rememberMe: boolean) {
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60
    document.cookie = `${ACCESS_TOKEN_COOKIE}=${token}; path=/; max-age=${maxAge}`
}

function removeAccessToken() {
    document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

function getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
}

function setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

function removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function decodeJWT(token: string): User | null {
    try {
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join(""),
        )
        const payload = JSON.parse(jsonPayload)
        
        // Minimum required fields
        if (!payload.sub || !payload.username) return null

        // Handle both old format (roles array) and new format (role field)
        const roles = payload.roles || (payload.role ? [payload.role] : ["ADMIN"])
        const primaryRole = payload.role || roles[0] || "ADMIN"

        return {
            id: payload.sub,
            name: payload.name || payload.username,
            username: payload.username,
            roles: roles,
            role: primaryRole,
            storeId: payload.storeId || null,
            storeName: payload.storeName || null,
            storeCode: payload.storeCode || null,
        }
    } catch (error) {
        console.error("Error decoding JWT:", error)
        return null
    }
}

export const AuthService = {
    async login({
        username,
        password,
        rememberMe,
    }: {
        username: string
        password: string
        rememberMe: boolean
    }): Promise<User> {
        const res = await HttpService.post<LoginResponse>("/api/v1/auth/login", {
            username,
            password,
        })

        const { access_token, refresh_token } = res.data

        setAccessToken(access_token, rememberMe)
        rememberMe ? setRefreshToken(refresh_token) : removeRefreshToken()

        const user = decodeJWT(access_token)
        if (!user) throw new Error("Token inválido")

        return user
    },

    async refresh(): Promise<User | null> {
        const refreshToken = getRefreshToken()
        if (!refreshToken) return null

        try {
            const res = await HttpService.post<{
                access_token: string
                refresh_token?: string
            }>("/api/v1/auth/refresh", {
                refresh_token: refreshToken,
            })

            const { access_token, refresh_token: newRefreshToken } = res.data

            const user = decodeJWT(access_token)
            if (!user) return null

            setAccessToken(access_token, false)

            if (newRefreshToken) {
                setRefreshToken(newRefreshToken)
            }

            return user
        } catch {
            return null
        }
    },

    logout() {
        removeAccessToken()
        removeRefreshToken()
    },
}
