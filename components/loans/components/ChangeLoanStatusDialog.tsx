"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import { LoanStatus } from "@/lib/types"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ChangeLoanStatusDialogProps {
    loanId: string
    currentStatus: string
    onStatusChanged: () => void
    children: React.ReactNode
}

export function ChangeLoanStatusDialog({ loanId, currentStatus, onStatusChanged, children }: ChangeLoanStatusDialogProps) {
    const [open, setOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const statusOptions = [
        { value: LoanStatus.ACTIVE, label: "Activo" },
        { value: LoanStatus.COMPLETED, label: "Finalizado" },
        { value: LoanStatus.RESTARTED_BY_DEFAULT, label: "Reiniciado por mora" },
        { value: LoanStatus.COMPLETED_BY_THEFT, label: "Finalizado por Robo de vehículo" },
        { value: LoanStatus.COMPLETED_BY_PROSECUTOR, label: "Contrato finalizado por fiscalía" },
        { value: LoanStatus.IMMOBILIZED_BY_TRAFFIC, label: "Inmovilizado por tránsito" },
    ]

    const handleSubmit = async () => {
        if (selectedStatus === currentStatus) {
            toast({
                title: "Sin cambios",
                description: "El estado seleccionado es el mismo que el actual",
            })
            return
        }

        setIsSubmitting(true)
        try {
            const token = document.cookie
                .split("; ")
                .find((c) => c.startsWith("authToken="))
                ?.split("=")[1]

            await HttpService.patch(
                `/api/v1/loans/${loanId}/status`,
                { status: selectedStatus },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }
            )

            toast({
                title: "Estado actualizado",
                description: "El estado del contrato ha sido actualizado exitosamente",
            })

            setOpen(false)
            onStatusChanged()
        } catch (error) {
            console.error("Error updating loan status:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo actualizar el estado del contrato",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cambiar estado del contrato</DialogTitle>
                    <DialogDescription>
                        Selecciona el nuevo estado para este contrato
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="status">Estado</Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || selectedStatus === currentStatus}
                    >
                        {isSubmitting ? "Actualizando..." : "Actualizar estado"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
