"use client"

import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"

interface ActionButtonsProps {
    loading: boolean
    isEditing: boolean
    selectedLoan: any
    onCancel: () => void
}

export function ActionButtons({ loading, isEditing, selectedLoan, onCancel }: ActionButtonsProps) {
    return (
        <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={loading || (!isEditing && !selectedLoan)} className="gap-1.5">
                {loading ? (
                    <>
                        <svg
                            className="animate-spin h-3.5 w-3.5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        {isEditing ? "Actualizando..." : "Registrando..."}
                    </>
                ) : (
                    <>
                        <CreditCard className="h-3.5 w-3.5" />
                        {isEditing ? "Actualizar" : "Registrar Pago"}
                    </>
                )}
            </Button>
        </div>
    )
}
