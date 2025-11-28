import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { hasAccess } from "./lib/services/route-access"
import type { Role } from "./hooks/useAuth"

const publicRoutes = ["/login", "/forgot-password"]

export function parseJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error parsing JWT in middleware:", error)
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if current path is already a public route (exact match)
  const isPublicRoute = publicRoutes.some((route) => pathname === route)
  console.log("Middleware - Path:", pathname, "IsPublic:", isPublicRoute)

  const token = request.cookies.get("authToken")?.value

  // If we have a token, check if it's valid
  if (token) {
    const decoded = parseJwt(token)
    const now = Math.floor(Date.now() / 1000)

    // If token is expired or invalid, redirect to login
    if (!decoded || (decoded.exp && decoded.exp < now)) {
      // Only redirect if not already on login page
      if (pathname !== "/login") {
        const response = NextResponse.redirect(new URL("/login?expired=true", request.url))
        response.cookies.set("authToken", "", {
          path: "/",
          expires: new Date(0),
        })
        return response
      } else {
        // If already on login page, just clear the cookie and continue
        const response = NextResponse.next()
        response.cookies.set("authToken", "", {
          path: "/",
          expires: new Date(0),
        })
        return response
      }
    }

    const userRoles: Role[] = decoded?.roles || (decoded?.role ? [decoded.role] : ["ADMIN"])

    // Check access permissions
    if (!hasAccess(pathname, userRoles) && !isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // If authenticated and trying to access login page, redirect to home
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // If no token and not on public route, redirect to login
  if (!token && !isPublicRoute && !pathname.includes("/_next")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
