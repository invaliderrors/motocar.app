import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { UserFormValues } from "@/lib/schemas/user.schema"

interface UserBasicFieldsProps {
  control: Control<UserFormValues>
}

export function UserBasicFields({ control }: UserBasicFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300">Nombre completo</FormLabel>
            <FormControl>
              <Input
                placeholder="Juan Pérez"
                {...field}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-primary/50"
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300">Nombre de usuario</FormLabel>
            <FormControl>
              <Input
                placeholder="usuario123"
                {...field}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-primary/50"
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    </>
  )
}
