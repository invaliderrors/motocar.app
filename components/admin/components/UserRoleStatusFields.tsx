import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Control } from "react-hook-form"
import { UserFormValues } from "@/lib/schemas/user.schema"

interface UserRoleStatusFieldsProps {
  control: Control<UserFormValues>
}

export function UserRoleStatusFields({ control }: UserRoleStatusFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300">Rol</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:ring-primary/50">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem
                  value="ADMIN"
                  className="focus:bg-gray-700 focus:text-white"
                >
                  Administrador
                </SelectItem>
                <SelectItem
                  value="MODERATOR"
                  className="focus:bg-gray-700 focus:text-white"
                >
                  Moderador
                </SelectItem>
                <SelectItem
                  value="MANAGER"
                  className="focus:bg-gray-700 focus:text-white"
                >
                  Gerente
                </SelectItem>
                <SelectItem
                  value="USER"
                  className="focus:bg-gray-700 focus:text-white"
                >
                  Empleado
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-gray-500">
              Define los permisos del usuario en el sistema.
            </FormDescription>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300">Estado</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:ring-primary/50">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem
                  value="ACTIVE"
                  className="focus:bg-gray-700 focus:text-white"
                >
                  Activo
                </SelectItem>
                <SelectItem
                  value="INACTIVE"
                  className="focus:bg-gray-700 focus:text-white"
                >
                  Inactivo
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-gray-500">
              Determina si el usuario puede acceder al sistema.
            </FormDescription>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    </div>
  )
}
