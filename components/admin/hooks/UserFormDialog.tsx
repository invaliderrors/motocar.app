"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Owner } from "@/lib/types"
import { userFormSchema, UserFormValues } from "@/lib/schemas/user.schema"
import { usePasswordGeneration } from "@/components/admin/hooks/usePasswordGeneration"
import { useUserFormSubmit } from "@/components/admin/hooks/useUserFormSubmit"
import { PasswordDisplay } from "../components/PasswordDisplay"
import { PasswordResetButton } from "../components/PasswordResetButton"
import { UserBasicFields } from "../components/UserBasicFields"
import { UserRoleStatusFields } from "../components/UserRoleStatusFields"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: Owner | null
  onSave: (user: Owner) => void
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: UserFormDialogProps) {
  const isEditing = !!user
  const passwordGen = usePasswordGeneration()
  const { isLoading, submitUser } = useUserFormSubmit()

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      username: "",
      role: "USER",
      status: "ACTIVE",
    },
  })

  // Initialize form when dialog opens or user changes
  useEffect(() => {
    if (open) {
      if (user) {
        // Edit mode: populate form with user data
        form.reset({
          name: user.name,
          username: user.username,
          role: user.role as UserFormValues["role"],
          status: user.status as UserFormValues["status"],
        })
        passwordGen.reset()
      } else {
        // Create mode: reset form and generate password
        form.reset({
          name: "",
          username: "",
          role: "USER",
          status: "ACTIVE",
        })
        passwordGen.generate()
      }
    }
  }, [user, open, form])

  const handlePasswordCopy = async () => {
    await passwordGen.copyToClipboard()
  }

  const handleSubmit = async (values: UserFormValues) => {
    const result = await submitUser({
      values,
      userId: user?.id,
      password: passwordGen.password,
      isEditing,
      hasPasswordReset: isEditing && !!passwordGen.password,
    })

    if (result.success && result.data) {
      onSave(result.data)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isEditing
              ? "Actualiza la información del usuario existente."
              : "Completa el formulario para crear un nuevo usuario."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <UserBasicFields control={form.control} />

            {/* Password section for new user */}
            {!isEditing && (
              <PasswordDisplay
                password={passwordGen.password}
                copied={passwordGen.copied}
                onCopy={handlePasswordCopy}
                onRegenerate={passwordGen.generate}
              />
            )}

            {/* Password reset section for existing user */}
            {isEditing && !passwordGen.password && (
              <PasswordResetButton onReset={passwordGen.generate} />
            )}

            {isEditing && passwordGen.password && (
              <PasswordDisplay
                password={passwordGen.password}
                copied={passwordGen.copied}
                onCopy={handlePasswordCopy}
                onRegenerate={passwordGen.generate}
                label="Nueva contraseña"
                description="Al guardar, la contraseña del usuario será cambiada por esta nueva."
                onCancel={passwordGen.reset}
              />
            )}

            <UserRoleStatusFields control={form.control} />

            <DialogFooter className="flex justify-between items-center pt-2">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Actualizando..." : "Creando..."}
                    </>
                  ) : isEditing ? (
                    "Actualizar"
                  ) : (
                    "Crear"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
