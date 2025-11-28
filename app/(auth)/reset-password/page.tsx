import type { Metadata } from "next"
import Link from "next/link"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { ModeToggle } from "@/components/common/mode-toggle"

export const metadata: Metadata = {
  title: "Restablecer Contraseña | MotoCar de la Costa",
  description: "Restablece tu contraseña del sistema de contratos de motocicletas",
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/abstract-geometric-shapes.png')] bg-cover bg-center opacity-5"></div>
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">MotoCar de la Costa</h1>
          <p className="text-gray-400 mt-1 text-center">Sistema de gestión de contratos</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col space-y-2 text-center mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-white">Restablecer contraseña</h2>
              <p className="text-sm text-gray-400">Crea una nueva contraseña para tu cuenta</p>
            </div>
            <ResetPasswordForm />
            <div className="mt-6 text-center text-sm text-gray-400">
              <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} MotoCar de la Costa. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
