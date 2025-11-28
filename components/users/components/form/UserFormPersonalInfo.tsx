import { Card, CardContent } from "@/components/ui/card"
import { User, Calendar, Hash, MapPin, Phone, Home } from "lucide-react"
import type { Control } from "react-hook-form"
import { UserFormValues } from "../../hooks/useUserForm"
import { FormFieldWrapper } from "./UserFormFieldWrapper"


interface PersonalInfoTabProps {
    control: Control<UserFormValues>
}

export function PersonalInfoTab({ control }: PersonalInfoTabProps) {
    return (
        <Card className="border-border shadow-sm">
            <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-primary">
                    <User className="h-5 w-5" />
                    Datos personales
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormFieldWrapper
                        control={control}
                        name="name"
                        label="Nombre completo"
                        placeholder="Nombre y apellidos"
                        description="Ingrese el nombre completo del cliente"
                        icon={<User className="h-4 w-4 text-primary" />}
                    />

                    <FormFieldWrapper
                        control={control}
                        name="age"
                        label="Edad"
                        placeholder="Edad"
                        description="La edad debe ser mayor o igual a 18 años"
                        icon={<Calendar className="h-4 w-4 text-primary" />}
                        type="number"
                    />

                    <FormFieldWrapper
                        control={control}
                        name="identification"
                        label="Identificación"
                        placeholder="Número de identificación"
                        description="Cédula de ciudadanía, extranjería o pasaporte"
                        icon={<Hash className="h-4 w-4 text-primary" />}
                    />

                    <FormFieldWrapper
                        control={control}
                        name="idIssuedAt"
                        label="Lugar de expedición"
                        placeholder="Ciudad o municipio de expedición"
                        description="Lugar donde se expidió el documento de identidad"
                        icon={<MapPin className="h-4 w-4 text-primary" />}
                    />

                    <FormFieldWrapper
                        control={control}
                        name="phone"
                        label="Teléfono"
                        placeholder="Número de teléfono"
                        description="Número de contacto principal"
                        icon={<Phone className="h-4 w-4 text-primary" />}
                    />

                    <FormFieldWrapper
                        control={control}
                        name="address"
                        label="Dirección"
                        placeholder="Dirección completa"
                        description="Dirección de residencia actual"
                        icon={<Home className="h-4 w-4 text-primary" />}
                    />

                    <FormFieldWrapper
                        control={control}
                        name="city"
                        label="Ciudad de residencia"
                        placeholder="Ciudad donde reside"
                        description="Ciudad o municipio de residencia actual"
                        icon={<MapPin className="h-4 w-4 text-primary" />}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
