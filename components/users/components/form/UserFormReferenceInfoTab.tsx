import { Card, CardContent } from "@/components/ui/card"

import { Users, User, FileText, Phone } from "lucide-react"
import type { Control } from "react-hook-form"
import { UserFormValues } from "../../hooks/useUserForm"
import { FormFieldWrapper } from "./UserFormFieldWrapper"


interface ReferenceInfoTabProps {
    control: Control<UserFormValues>
}

export function ReferenceInfoTab({ control }: ReferenceInfoTabProps) {
    return (
        <Card className="border-border shadow-sm">
            <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-primary">
                    <Users className="h-5 w-5" />
                    Datos del referente
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormFieldWrapper
                        control={control}
                        name="refName"
                        label="Nombre del referente"
                        placeholder="Nombre completo del referente"
                        description="Persona que puede dar referencias del cliente"
                        icon={<User className="h-4 w-4 text-primary" />}
                    />

                    <FormFieldWrapper
                        control={control}
                        name="refID"
                        label="Identificación del referente"
                        placeholder="Número de identificación"
                        description="Documento de identidad del referente"
                        icon={<FileText className="h-4 w-4 text-primary" />}
                    />

                    <FormFieldWrapper
                        control={control}
                        name="refPhone"
                        label="Teléfono del referente"
                        placeholder="Número de contacto"
                        description="Número de contacto del referente"
                        icon={<Phone className="h-4 w-4 text-primary" />}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
