"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"

interface ExpenseFormActionsProps {
    loading: boolean
    uploadingImage: boolean
    isEditing: boolean
}

export function ExpenseFormActions({ loading, uploadingImage, isEditing }: ExpenseFormActionsProps) {
    return (
        <div className="flex items-center justify-between pt-6 border-t">
            <p className="text-sm text-muted-foreground">
                {isEditing ? "Los cambios se guardarán inmediatamente" : "Todos los campos marcados con * son obligatorios"}
            </p>
            <div className="flex gap-3">
                <Button
                    type="submit"
                    disabled={loading || uploadingImage}
                    size="lg"
                    className="px-8"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {isEditing ? "Actualizar Egreso" : "Guardar Egreso"}
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
