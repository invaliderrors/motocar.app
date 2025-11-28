"use client"

import { AuthService, decodeJWT } from "@/lib/services/auth.service"
import { usePathname } from "next/navigation"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Role = "ADMIN" | "USER"

export type User = {
  id: string
  name: string
  username: string
  roles: Role[]
  exp?: number
}

type AuthContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Track if we're currently on the login page
let isOnLoginPage = false

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshAttempted, setRefreshAttempted] = useState(false)
  const pathname = usePathname()

  // Update login page status
  useEffect(() => {
    isOnLoginPage = pathname === "/login"
    console.log("Path changed:", pathname, "isLoginPage:", isOnLoginPage)
  }, [pathname])

  // Inicializa sesión desde cookie o hace refresh
  useEffect(() => {
    const publicPaths = ["/login", "/forgot-password"]
    const isPublicPath = publicPaths.some((path) => pathname === path)

    console.log("Auth init - Path:", pathname, "IsPublic:", isPublicPath, "RefreshAttempted:", refreshAttempted)

    // Get token from cookie
    const token = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("authToken="))
      ?.split("=")[1]

    // Check if we have a refresh token in localStorage
    const hasRefreshToken = localStorage.getItem("refreshToken") !== null

    console.log("Has token:", !!token, "Has refresh token:", hasRefreshToken)

    if (token) {
      const decoded = decodeJWT(token)
      if (decoded) {
        setUser(decoded)
        setIsLoading(false)
        return
      }
    }

    // Only attempt refresh if:
    // 1. We're not on a public path
    // 2. We haven't attempted refresh yet
    // 3. We have a refresh token
    if (!isPublicPath && !refreshAttempted && hasRefreshToken) {
      console.log("Attempting refresh...")
      setRefreshAttempted(true)

      AuthService.refresh()
        .then((refreshedUser) => {
          console.log("Refresh result:", refreshedUser ? "success" : "failed")
          if (refreshedUser) {
            setUser(refreshedUser)
          }
        })
        .catch((error) => {
          console.error("Auth refresh error:", error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      // On public paths or after refresh attempt, just set loading to false
      setIsLoading(false)
    }
  }, [pathname, refreshAttempted])

  const login = (userData: User) => {
    setUser(userData)
    // Reset refresh attempted state on successful login
    setRefreshAttempted(false)
  }

  const logout = () => {
    setUser(null)
    AuthService.logout()
    // Reset refresh attempted state on logout
    setRefreshAttempted(false)
    // Use replace to prevent adding to history
    window.location.replace("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
