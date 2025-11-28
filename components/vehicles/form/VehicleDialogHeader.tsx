"use client"

import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"
import { X, Bike } from "lucide-react"

interface VehicleDialogHeaderProps {
    isEditing: boolean
    onClose: () => void
}

export function VehicleDialogHeader({ isEditing, onClose }: VehicleDialogHeaderProps) {
    return (
        <>
            <DialogTitle className="sr-only">{isEditing ? "Editar vehículo" : "Nueva vehículo"}</DialogTitle>
            <div className="relative">
                <div className="absolute top-4 right-4 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full h-8 w-8 bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cerrar</span>
                    </Button>
                </div>
                <div className="bg-primary text-primary-foreground p-6 flex items-center gap-4">
                    <div className="bg-primary-foreground/20 backdrop-blur-sm p-3 rounded-full">
                        <Bike className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{isEditing ? "Editar vehículo" : "Nueva vehículo"}</h2>
                        <p className="text-primary-foreground/80 text-sm">
                            {isEditing ? "Actualiza los datos de tu vehículo" : "Ingresa los datos de tu nueva vehículo"}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

