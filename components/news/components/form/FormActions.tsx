"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface FormActionsProps {
    loading: boolean
    isEditing: boolean
    onClose: () => void
}

export function FormActions({ loading, isEditing, onClose }: FormActionsProps) {
    return (
        <div className="flex gap-2 justify-end pt-2 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Actualizar" : "Crear"}
            </Button>
        </div>
    )
}
