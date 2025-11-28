"use client"

import type React from 'react'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/common/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/hooks/useAuth'
import { StoreProvider } from '@/contexts/StoreContext'
import { PermissionsProvider } from '@/hooks/usePermissions'
import { useEffect, Suspense, lazy } from 'react'
import { usePathname } from 'next/navigation'
import { useNavigationStore } from '@/lib/nav'
import { AppSidebar } from '@/components/sidebar/sidebar'

const ExpiredSessionHandler = lazy(() => import('@/components/common/SessionHandler'))

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { setPageLoaded, isNavigatingFromLogin } = useNavigationStore()
  const pathname = usePathname()

  useEffect(() => {
    const hasToken = document.cookie.includes('authToken=')
    if (!hasToken) {
      localStorage.removeItem('refreshToken')
    }
  }, [])

  useEffect(() => {
    if (isNavigatingFromLogin && !pathname.includes('/login')) {
      const timer = setTimeout(() => {
        setPageLoaded(true)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [isNavigatingFromLogin, pathname, setPageLoaded])

  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body className={`${poppins.className} bg-dark-blue-950 dot-pattern text-gray-100`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <StoreProvider>
              <PermissionsProvider>
                <SidebarProvider>

                  <div className="flex h-screen w-full overflow-hidden">
                    <AppSidebar />
                    {children}
                  </div>
                  <Suspense fallback={null}>
                    <ExpiredSessionHandler />
                  </Suspense>
                  <Toaster />

                </SidebarProvider>
              </PermissionsProvider>
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
