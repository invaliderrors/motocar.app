"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"

interface SuccessDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    message: string
}

export function SuccessDialog({ isOpen, onOpenChange, message }: SuccessDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        Operación exitosa
                    </DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
