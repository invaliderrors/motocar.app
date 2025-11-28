"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, Receipt, BarChart3, Clock } from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"
import { ChartsTab } from "./form/components/ChartsTab"
import { FormInputs } from "./form/components/FormInput"
import { ProviderDisplay } from "./form/components/ProviderDisplay"
import { SuccessDialog } from "./form/components/SuccessDialog"
import { SummaryTab } from "./form/components/SummaryTab"
import { TransactionsTab } from "./form/components/TransactionsTab"
import { useCashRegisterForm } from "./form/hooks/useCashRegisterForm"
import { CashRegisterFormProps } from "./form/types"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"


export function CashRegisterForm({ token, selectedTransactions, closingDate }: CashRegisterFormProps) {
    const [activeTab, setActiveTab] = useState("summary")
    const closingPermissions = useResourcePermissions(Resource.CLOSING)

    const {
        formState,
        currentProvider,
        showSuccessDialog,
        incomes,
        expenses,
        calculations,
        isFormValid,
        isReadOnly,
        expectedCash,
        cashMatches,
        handleInputChange,
        handleSubmit,
        resetForm,
        setShowSuccessDialog,
    } = useCashRegisterForm(selectedTransactions, closingDate)

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                {formState.error && (
                    <Alert variant="destructive" className="animate-in fade-in-50 slide-in-from-top-5">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error al registrar el cierre</AlertTitle>
                        <AlertDescription>
                            {formState.errorMessage ||
                                "Hubo un problema al registrar el cierre de caja. Por favor, intente nuevamente."}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel izquierdo - Formulario */}
                    <Card className="bg-card border-border shadow-sm lg:col-span-1">
                        <CardHeader className="pb-3 border-b border-border">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Receipt className="h-5 w-5 text-primary" />
                                Registro de Valores
                            </CardTitle>
                            <CardDescription>Ingrese los montos recibidos por cada método de pago</CardDescription>
                            <ProviderDisplay provider={currentProvider} />
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <FormInputs 
                                formState={formState} 
                                isReadOnly={isReadOnly} 
                                onInputChange={handleInputChange}
                                expectedCash={expectedCash}
                                hasSelectedTransactions={selectedTransactions.length > 0}
                            />
                        </CardContent>
                        <CardFooter className="pt-2 pb-6 flex flex-col">
                            {closingPermissions.canCreate ? (
                                <>
                                    <Button type="submit" disabled={!isFormValid} className="w-full shadow-sm transition-all bg-primary hover:bg-primary/90">
                                        {formState.submitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                                <span>Procesando...</span>
                                            </div>
                                        ) : (
                                            <span>Registrar Cierre de Caja</span>
                                        )}
                                    </Button>

                                    {!isFormValid && incomes.length === 0 && (
                                        <p className="text-xs text-amber-600 mt-2 text-center">
                                            Seleccione al menos una transacción para continuar
                                        </p>
                                    )}
                                    
                                    {!isFormValid && incomes.length > 0 && !cashMatches && (
                                        <Alert className="mt-3 border-destructive bg-destructive/10">
                                            <AlertCircle className="h-4 w-4 text-destructive" />
                                            <AlertDescription className="text-destructive text-sm">
                                                El efectivo contado debe coincidir con el esperado del sistema para registrar el cierre.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </>
                            ) : (
                                <Alert className="mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        No tienes permisos para crear cierres de caja.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardFooter>
                    </Card>

                    {/* Panel derecho - Resumen y Visualización */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="summary" className="w-full" onValueChange={setActiveTab}>
                            <div className="flex justify-between items-center mb-4">
                                <TabsList>
                                    <TabsTrigger value="summary" className="flex items-center gap-1">
                                        <Receipt className="h-4 w-4" />
                                        <span>Resumen</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="charts" className="flex items-center gap-1">
                                        <BarChart3 className="h-4 w-4" />
                                        <span>Gráficos</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="transactions" className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>Transacciones</span>
                                    </TabsTrigger>
                                </TabsList>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={calculations.totalDifference >= 0 ? "outline" : "destructive"} className="h-7">
                                                    <span className="font-medium mr-1">Diferencia:</span>
                                                    <span
                                                        className={cn(
                                                            "font-bold",
                                                            calculations.totalDifference === 0
                                                                ? "text-emerald-600"
                                                                : calculations.totalDifference > 0
                                                                    ? "text-emerald-600"
                                                                    : "text-destructive",
                                                        )}
                                                    >
                                                        {formatCurrency(calculations.totalDifference)}
                                                    </span>
                                                </Badge>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Diferencia entre el total registrado y el esperado</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <TabsContent value="summary" className="mt-0">
                                <SummaryTab
                                    calculations={calculations}
                                    incomes={incomes}
                                    expenses={expenses}
                                    currentProvider={currentProvider}
                                />
                            </TabsContent>

                            <TabsContent value="charts" className="mt-0">
                                <ChartsTab calculations={calculations} />
                            </TabsContent>

                            <TabsContent value="transactions" className="mt-0">
                                <TransactionsTab incomes={incomes} expenses={expenses} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </form>

            <SuccessDialog
                open={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                onNewClosure={resetForm}
                currentProvider={currentProvider}
                calculations={calculations}
            />
        </>
    )
}
