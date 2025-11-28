"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Button } from "@/components/ui/button"
import { FileDown, FileUp } from "lucide-react"
import { ExpenseModal } from "@/components/expenses/expense-modal"
import { ExpenseSummary } from "@/components/expenses/expense-summary"
import { ExpenseTable } from "@/components/expenses/ExpenseTable"


export default function ExpensesPage() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Egresos</h1>
                    <p className="text-muted-foreground">Gestiona todos los egresos del negocio</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* <ExpenseModal
                        onSuccess={() => {
                            // Aquí podríamos recargar los datos si fuera necesario
                            console.log("Egreso creado exitosamente")
                        }}
                    /> */}
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

            <Tabs defaultValue="listado" className="w-full">
                <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-2">
                    <TabsTrigger value="listado">Listado de Egresos</TabsTrigger>
                    <TabsTrigger value="resumen">Resumen y Estadísticas</TabsTrigger>
                </TabsList>
                <TabsContent value="listado" className="space-y-4">
                    <ExpenseTable />
                </TabsContent>
                <TabsContent value="resumen" className="space-y-4">
                    <ExpenseSummary />
                </TabsContent>
            </Tabs>
        </div>
    )
}
