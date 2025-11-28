import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"
import { X, UserCheck, UserPlus } from 'lucide-react'

interface DialogHeaderProps {
    isEditing: boolean
    onClose: () => void
}

export function DialogHeader({ isEditing, onClose }: DialogHeaderProps) {
    return (
        <>
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

            <div className="bg-primary p-6 flex items-center gap-4">
                <div className="bg-primary-foreground/20 backdrop-blur-sm p-3 rounded-full">
                    {isEditing ? <UserCheck className="h-8 w-8 text-primary-foreground" /> : <UserPlus className="h-8 w-8 text-primary-foreground" />}
                </div>
                <div>
                    <DialogTitle className="text-xl font-bold text-primary-foreground">
                        {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
                    </DialogTitle>
                    <p className="text-primary-foreground/80 text-sm">
                        {isEditing ? "Actualiza los datos del usuario" : "Ingresa los datos del nuevo usuario"}
                    </p>
                </div>
            </div>
        </>
    )
}
