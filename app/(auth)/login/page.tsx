import type { Metadata } from "next"
import { ModeToggle } from "@/components/common/mode-toggle"
import { LoginForm } from "@/components/auth/login-form"
import { Suspense } from "react"
import { Bike, Shield, TrendingUp, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Login | MotoCar de la Costa",
  description: "Iniciar sesión en el sistema de contratos de motocicletas",
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="absolute right-6 top-6 z-50 md:right-10 md:top-10">
        <ModeToggle />
      </div>

      <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-muted p-12 texture-pattern lg:flex xl:p-16">
          {/* Subtle decorative element */}
          <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/30 blur-3xl" />

          <div className="relative z-20">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                <Bike className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                MotoCar de la Costa
              </span>
            </div>
          </div>

          <div className="relative z-20 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Sistema de gestión empresarial
              </div>
              <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-foreground text-balance xl:text-6xl">
                Gestiona tu negocio con elegancia y eficiencia
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
                Plataforma integral para administrar contratos de motocicletas, contratos, pagos y reportes en
                tiempo real.
              </p>
            </div>

            <div className="grid gap-6 pt-4">
              <div className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80 hover:shadow-lg">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Shield className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Seguridad garantizada</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Protección de datos empresariales con encriptación de nivel bancario
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80 hover:shadow-lg">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <TrendingUp className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Análisis en tiempo real</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Dashboards interactivos con métricas clave de tu operación
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80 hover:shadow-lg">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Clock className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Ahorra tiempo</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Automatiza procesos repetitivos y enfócate en hacer crecer tu negocio
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-20 flex items-center justify-between border-t border-border/50 pt-8">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} MotoCar de la Costa</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">
                Privacidad
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                Términos
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="mx-auto w-full max-w-[440px] space-y-8">
            {/* Mobile logo */}
            <div className="flex flex-col items-center space-y-3 lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Bike className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">MotoCar de la Costa</h1>
            </div>

            <div className="space-y-3 text-center lg:text-left">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground lg:text-4xl">Bienvenido</h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Ingresa tus credenciales para acceder al sistema de gestión
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
                </div>
              }
            >
              <LoginForm />
            </Suspense>

            {/* Mobile footer */}
            <div className="space-y-4 pt-6 text-center lg:hidden">
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <a href="#" className="transition-colors hover:text-foreground">
                  Privacidad
                </a>
                <a href="#" className="transition-colors hover:text-foreground">
                  Términos
                </a>
              </div>
              <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} MotoCar de la Costa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
