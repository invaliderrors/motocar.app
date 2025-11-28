import { z } from "zod"

export const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  username: z.string().min(3, {
    message: "El nombre de usuario debe tener al menos 3 caracteres.",
  }),
  role: z.enum(["ADMIN", "USER", "MANAGER", "MODERATOR"], {
    required_error: "Por favor selecciona un rol.",
  }),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    required_error: "Por favor selecciona un estado.",
  }),
})

export type UserFormValues = z.infer<typeof userFormSchema>
