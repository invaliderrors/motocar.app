import type { NextApiRequest } from "next"

/**
 * Lee el authToken desde cookies en cliente (document.cookie)
 */
export function getClientAuthToken(): string | null {
    if (typeof document === "undefined") return null

    const token = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("authToken="))
        ?.split("=")[1]

    return token || null
}

/**
 * Lee el authToken desde headers.cookie en SSR
 */
export function getServerAuthToken(req?: NextApiRequest): string | null {
    if (req?.headers?.cookie) {
        const match = req.headers.cookie.match(/(^|;) ?authToken=([^;]*)/)
        return match ? decodeURIComponent(match[2]) : null
    }
    return null
}
