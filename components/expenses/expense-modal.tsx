"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle, Receipt, FileEdit } from "lucide-react"
import { ExpenseForm } from "./ExpenseForm"
import { Expense } from "@/lib/types"

interface ExpenseModalProps {
    onSuccess?: () => void
    children?: React.ReactNode
    expenseData?: Expense
    isEditing?: boolean
}

export function ExpenseModal({ onSuccess, children, expenseData, isEditing = false }: ExpenseModalProps) {
    const [open, setOpen] = useState(false)

    const handleSuccess = () => {
        setOpen(false)
        if (onSuccess) {
            onSuccess()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all">
                        {isEditing ? (
                            <>
                                <FileEdit className="mr-2 h-4 w-4" />
                                Editar Egreso
                            </>
                        ) : (
                            <>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Nuevo Egreso
                            </>
                        )}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-hidden p-0">
                <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-primary/90 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                            <Receipt className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-white">
                                {isEditing ? "Editar Egreso" : "Nuevo Egreso"}
                            </DialogTitle>
                            <DialogDescription className="text-white/80 text-sm">
                                {isEditing
                                    ? "Modifique la información del egreso seleccionado"
                                    : "Complete el formulario para registrar un nuevo egreso"}
                            </DialogDescription>
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-100px)] px-6 py-6 bg-muted/30">
                    <ExpenseForm onSuccess={handleSuccess} isModal={true} expenseData={expenseData} isEditing={isEditing} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
