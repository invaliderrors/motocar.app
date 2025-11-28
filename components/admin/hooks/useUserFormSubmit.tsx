import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { UsersService } from "@/lib/services/users.service"
import { Owner } from "@/lib/types"
import { UserFormValues } from "@/lib/schemas/user.schema"

interface SubmitUserParams {
  values: UserFormValues
  userId?: string
  password: string
  isEditing: boolean
  hasPasswordReset: boolean
}

interface SubmitUserResult {
  success: boolean
  data?: Owner
  error?: string
}

export function useUserFormSubmit() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const submitUser = async (
    params: SubmitUserParams
  ): Promise<SubmitUserResult> => {
    const { values, userId, password, isEditing, hasPasswordReset } = params
    setIsLoading(true)

    try {
      let result: Owner

      if (isEditing && userId) {
        // Update existing user
        const updateData = {
          ...values,
          ...(hasPasswordReset && { password }),
        }

        result = await UsersService.update(userId, updateData)

        toast({
          title: "Usuario actualizado",
          description: hasPasswordReset
            ? "El usuario ha sido actualizado y su contraseña ha sido restablecida exitosamente."
            : "El usuario ha sido actualizado exitosamente.",
          variant: "default",
        })
      } else {
        // Create new user
        result = await UsersService.create({
          ...values,
          password,
        })

        toast({
          title: "Usuario creado",
          description:
            "El usuario ha sido creado exitosamente. Asegúrate de guardar la contraseña.",
          variant: "default",
        })
      }

      return { success: true, data: result }
    } catch (error: any) {
      console.error("Error saving user:", error)
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Ocurrió un error al guardar el usuario. Inténtalo de nuevo.",
        variant: "destructive",
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    submitUser,
  }
}
