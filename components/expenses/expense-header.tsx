"use client"

import { Button } from "@/components/ui/button"
import { FileDown, FileUp } from 'lucide-react'
import { ExpenseModal } from "./expense-modal"
import { useRouter } from "next/navigation"

export function ExpensesHeader() {
    const router = useRouter()

    const handleSuccess = () => {
        router.refresh()
    }

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Egresos</h1>
                <p className="text-muted-foreground">Gestiona todos los egresos del negocio</p>
            </div>
            <div className="flex items-center gap-2">
                <ExpenseModal onSuccess={handleSuccess} />
                <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar
                </Button>
                <Button variant="outline">
                    <FileUp className="mr-2 h-4 w-4" />
                    Importar
                </Button>
            </div>
        </div>
    )
}
