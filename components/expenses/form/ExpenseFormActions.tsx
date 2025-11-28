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
        <div className="flex justify-end gap-4 pt-2">
            <Button
                type="submit"
                disabled={loading || uploadingImage}
                className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white shadow-md hover:shadow-lg transition-all"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditing ? "Actualizando..." : "Guardando..."}
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? "Actualizar Egreso" : "Guardar Egreso"}
                    </>
                )}
            </Button>
        </div>
    )
}
