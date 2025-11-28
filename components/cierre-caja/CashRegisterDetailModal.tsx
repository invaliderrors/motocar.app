"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import es from "date-fns/locale/es"
import { ArrowUpToLine, ArrowDownToLine, Calendar, User, FileText, Bike, AlertCircle, Info, Eye } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Closing } from "@/lib/types"
import { CategoryBadge } from "../common/CategoryBadge"
import { PaymentMethodIcon } from "../common/PaymentMethodIcon"
import { ProviderBadge } from "../common/ProviderBadge"
import { FinancialSummaryCard } from "./history/components/CashRegisterFDinancialSummaryCard"
import { GeneralInfoCard } from "./history/components/CashRegisterGeneralInfo"
import { CashRegisterHeader } from "./history/components/CashRegisterHeader"
import { useCashRegisterDetail } from "./transactions/hooks/useCashRegisterDetails"
import { EmptyState } from "./history/components/CashRegisterEmptyState"

type Props = {
    open: boolean
    onClose: () => void
    cashRegister: Closing
}

export function CashRegisterDetailModal({ open, onClose, cashRegister }: Props) {
    const { totalIncome, totalExpense, balance, formatMethod, getInitials } = useCashRegisterDetail(cashRegister)

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-6">
                <CashRegisterHeader />

                {/* Cash Register Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <GeneralInfoCard cashRegister={cashRegister} getInitials={getInitials} />
                    <FinancialSummaryCard
                        cashRegister={cashRegister}
                        totalIncome={totalIncome}
                        totalExpense={totalExpense}
                        balance={balance}
                    />
                </div>

                <Tabs defaultValue="payments" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                        <TabsTrigger value="payments" className="flex items-center gap-2 text-base">
                            <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                                <ArrowUpToLine className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span>Pagos Registrados ({cashRegister.payments.length})</span>
                        </TabsTrigger>
                        <TabsTrigger value="expenses" className="flex items-center gap-2 text-base">
                            <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full">
                                <ArrowDownToLine className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <span>Egresos Asociados ({cashRegister.expense.length})</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="payments" className="space-y-4">
                        {cashRegister.payments.length === 0 ? (
                            <EmptyState
                                title="No hay pagos registrados"
                                description="Este cierre de caja no tiene pagos (ingresos) asociados."
                            />
                        ) : (
                            <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        Fecha
                                                    </div>
                                                </TableHead>
                                                <TableHead>
                                                    <div className="flex items-center">
                                                        <User className="h-4 w-4 mr-2" />
                                                        Cliente
                                                    </div>
                                                </TableHead>
                                                <TableHead>
                                                    <div className="flex items-center">
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Contrato
                                                    </div>
                                                </TableHead>
                                                <TableHead>
                                                    <div className="flex items-center">
                                                        <Bike className="h-4 w-4 mr-2" />
                                                        Placa
                                                    </div>
                                                </TableHead>
                                                <TableHead>Método</TableHead>
                                                <TableHead className="text-right">
                                                    <div className="flex items-center justify-end">
                                                        <ArrowUpToLine className="h-4 w-4 mr-2 text-green-500" />
                                                        Monto
                                                    </div>
                                                </TableHead>
                                                <TableHead className="text-right">GPS</TableHead>
                                                <TableHead>Estado</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cashRegister.payments.map((p) => {
                                                const paymentDate = new Date(p.paymentDate)
                                                return (
                                                    <TableRow key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                                        <TableCell className="font-medium font-mono text-xs">
                                                            <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">
                                                                {p.id.substring(0, 8)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span>{format(paymentDate, "dd/MM/yyyy", { locale: es })}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {format(paymentDate, "HH:mm", { locale: es })}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {p.loan?.user?.name ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarFallback className="text-xs">{getInitials(p.loan.user.name)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="text-sm font-medium">{p.loan.user.name}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                                                                {p.loan?.contractNumber || "—"}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {p.loan?.vehicle?.plate ? (
                                                                <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                                                                    {p.loan.vehicle.plate}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <PaymentMethodIcon method={p.paymentMethod} />
                                                                <span>{formatMethod(p.paymentMethod)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                                                            {formatCurrency(p.amount)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium text-blue-600 dark:text-blue-400">
                                                            {formatCurrency(p.gps)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {p.isLate ? (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/30 flex items-center gap-1.5"
                                                                >
                                                                    <AlertCircle className="h-3 w-3" />
                                                                    Tardío
                                                                </Badge>
                                                            ) : (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30 flex items-center gap-1.5"
                                                                >
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                                    Al día
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="expenses" className="space-y-4">
                        {cashRegister.expense.length === 0 ? (
                            <EmptyState
                                title="No hay egresos registrados"
                                description="Este cierre de caja no tiene egresos asociados."
                            />
                        ) : (
                            <>
                                <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                                <TableRow>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead>
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-2" />
                                                            Fecha
                                                        </div>
                                                    </TableHead>
                                                    <TableHead>Categoría</TableHead>
                                                    <TableHead>Beneficiario</TableHead>
                                                    <TableHead>Método</TableHead>
                                                    <TableHead>Proveedor</TableHead>
                                                    <TableHead className="text-right">
                                                        <div className="flex items-center justify-end">
                                                            <ArrowDownToLine className="h-4 w-4 mr-2 text-red-500" />
                                                            Monto
                                                        </div>
                                                    </TableHead>
                                                    <TableHead>Referencia</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {cashRegister.expense.map((e) => {
                                                    const expenseDate = new Date(e.date)
                                                    return (
                                                        <TableRow key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                                            <TableCell className="font-medium font-mono text-xs">
                                                                <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">
                                                                    {e.id.substring(0, 8)}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col">
                                                                    <span>{format(expenseDate, "dd/MM/yyyy", { locale: es })}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {format(expenseDate, "HH:mm", { locale: es })}
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <CategoryBadge category={e.category} />
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full">
                                                                        <User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                                                                    </div>
                                                                    <span>{e.beneficiary}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <PaymentMethodIcon method={e.paymentMethod} />
                                                                    <span>{formatMethod(e.paymentMethod)}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {e.provider?.name ? (
                                                                    <ProviderBadge provider={e.provider} />
                                                                ) : (
                                                                    <span className="text-muted-foreground text-sm">—</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium text-red-600 dark:text-red-400">
                                                                {formatCurrency(e.amount)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {e.reference ? (
                                                                    <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                                                                        {e.reference.substring(0, 12)}...
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted-foreground">—</span>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Expense Details Section */}
                                <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="bg-white dark:bg-slate-800 p-1.5 rounded-full">
                                            <Info className="h-4 w-4 text-primary" />
                                        </div>
                                        <h3 className="text-base font-medium">Detalles adicionales de gastos</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        {cashRegister.expense.map((e) => (
                                            <div key={`desc-${e.id}`} className="p-4 bg-white dark:bg-slate-950 rounded-md border shadow-sm">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-xs">
                                                            {e.id.substring(0, 8)}
                                                        </div>
                                                        <CategoryBadge category={e.category} />
                                                    </div>
                                                    <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(e.amount)}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-200 dark:border-slate-800">
                                                    {e.description}
                                                </p>
                                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                                    {e.reference && (
                                                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                            <span className="text-xs text-muted-foreground">Ref:</span>
                                                            <span className="text-xs font-mono">{e.reference.substring(0, 12)}...</span>
                                                        </div>
                                                    )}
                                                    {e.attachmentUrl && (
                                                        <a
                                                            href={e.attachmentUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md"
                                                        >
                                                            <FileText className="h-3 w-3" />
                                                            Ver comprobante
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </TabsContent>
                </Tabs>

                <Separator className="my-4" />
                <div className="flex justify-end mt-6">
                    <Button variant="default" onClick={onClose} className="gap-2">
                        <Eye className="h-4 w-4" />
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
