"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { WhatsAppIcon } from "../../icons/whatsapp"

interface SuccessDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    message: string
}

export function SuccessDialog({ isOpen, onOpenChange, message }: SuccessDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-green-600 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-green-400 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Recibo enviado con éxito
                    </DialogTitle>
                    <DialogDescription className="text-foreground">{message}</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center p-4">
                    <div className="bg-green-600/20 p-4 rounded-full">
                        <WhatsAppIcon className="h-12 w-12 text-green-500" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => onOpenChange(false)} className="bg-green-600 hover:bg-green-700">
                        Aceptar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
