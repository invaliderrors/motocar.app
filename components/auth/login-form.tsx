"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, User, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { AuthService } from "@/lib/services/auth.service"
import { useNavigationStore } from "@/lib/nav"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

const formSchema = z.object({
  username: z.string().min(3, {
    message: "El nombre de usuario debe tener al menos 3 caracteres.",
  }),
  password: z.string().min(3, {
    message: "La contraseña debe tener al menos 3 caracteres.",
  }),
  rememberMe: z.boolean().default(false),
})

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { login } = useAuth()
  const { setNavigatingFromLogin } = useNavigationStore()

  useEffect(() => {
    const expired = searchParams.get("expired")
    if (expired === "true" && !formSubmitted) {
      toast({
        variant: "destructive",
        title: "Sesión expirada",
        description: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
      })
    }
  }, [searchParams, toast, formSubmitted])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  })

  useEffect(() => {
    if (loginError) {
      setShowErrorDialog(true)
    }
  }, [loginError])

  const handleDialogClose = () => {
    setShowErrorDialog(false)
    setTimeout(() => setLoginError(null), 300)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setFormSubmitted(true)
    setLoginError(null)
    setShowErrorDialog(false)

    try {
      const user = await AuthService.login({
        username: values.username,
        password: values.password,
        rememberMe: values.rememberMe,
      })

      login(user)
      setNavigatingFromLogin(true)

      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setLoginError("Credenciales incorrectas. Por favor, inténtalo de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">Usuario</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground transition-colors" />
                      <Input
                        placeholder="Ingresa tu usuario"
                        {...field}
                        className="h-11 pl-11 transition-all focus:ring-2 focus:ring-ring/20"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium text-foreground">Contraseña</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground transition-colors" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="h-11 pl-11 transition-all focus:ring-2 focus:ring-ring/20"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-foreground">Recordarme</FormLabel>
                    <FormDescription className="text-xs leading-relaxed text-muted-foreground">
                      Mantén la sesión iniciada en este dispositivo
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-11 w-full font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Acceso seguro</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          ¿Necesitas ayuda?{" "}
          <Link href="/support" className="font-medium text-primary transition-colors hover:text-primary/80">
            Contacta soporte
          </Link>
        </p>
      </div>

      <Dialog
        open={showErrorDialog}
        onOpenChange={(open) => {
          setShowErrorDialog(open)
          if (!open) handleDialogClose()
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-lg font-semibold text-foreground">Error de autenticación</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {loginError}
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
