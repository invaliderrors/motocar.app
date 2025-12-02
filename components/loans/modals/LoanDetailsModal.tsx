"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
    FileText, 
    Users, 
    Bike, 
    CreditCard, 
    Phone, 
    MapPin, 
    User2, 
    Hash, 
    Settings, 
    Shield, 
    Palette,
    Wallet,
    Coins,
    Receipt,
    CalendarDays,
    TrendingUp,
    CheckCircle,
    Clock,
    Percent,
    Calendar,
    Navigation
} from "lucide-react"
import { formatCurrency, formatDate, calculatePartialInstallmentDebt, cn } from "@/lib/utils"
import { Loan, Installment } from "@/lib/types"

import {
    PaymentHistoryTable,
    LoanDetailsSkeleton,
    LoanNotFound,
    useLoanDetails,
} from "./details"
import { InstallmentDetailsModal } from "@/components/installments/modals/InstallmentDetailsModal"

interface LoanDetailsModalProps {
    children: React.ReactNode
    loanId: string
    loanData?: any
}

// Status configuration
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: "Activo", className: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
    COMPLETED: { label: "Completado", className: "bg-green-500/15 text-green-600 border-green-500/30" },
    DEFAULTED: { label: "Incumplido", className: "bg-red-500/15 text-red-600 border-red-500/30" },
    PENDING: { label: "Pendiente", className: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
    ARCHIVED: { label: "Archivado", className: "bg-slate-500/15 text-slate-600 border-slate-500/30" },
}

const FREQUENCY_LABELS: Record<string, string> = {
    DAILY: "Diaria",
    WEEKLY: "Semanal",
    BIWEEKLY: "Quincenal",
    MONTHLY: "Mensual",
}

const INTEREST_TYPE_LABELS: Record<string, string> = {
    FIXED: "Fijo (Simple)",
    COMPOUND: "Compuesto",
}

export function LoanDetailsModal({ children, loanId, loanData }: LoanDetailsModalProps) {
    const [open, setOpen] = useState(false)
    const { 
        loan, 
        loading, 
        interests, 
        currentPage, 
        setCurrentPage,
    } = useLoanDetails(loanId, open)

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            setCurrentPage(1)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[95vw] lg:max-w-[1400px] max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader className="pb-4 border-b border-border/50">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5 text-primary" />
                        Detalles del Contrato
                    </DialogTitle>
                </DialogHeader>

                <div className="pt-4">
                    {loading ? (
                        <LoanDetailsSkeleton />
                    ) : loan ? (
                        <LoanDetailsContent 
                            loan={loan} 
                            interests={interests}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    ) : (
                        <LoanNotFound />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface LoanDetailsContentProps {
    loan: Loan
    interests: number
    currentPage: number
    onPageChange: (page: number) => void
}

function LoanDetailsContent({ loan, interests, currentPage, onPageChange }: LoanDetailsContentProps) {
    const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null)
    const [installmentModalOpen, setInstallmentModalOpen] = useState(false)
    
    const user = loan.user
    const vehicle = loan.vehicle || loan.motorcycle
    const totalWithInterest = loan.totalAmount + (interests * loan.installments || 0)
    const interestGenerated = (interests || 0) * (loan.paidInstallments || 0)
    const progressPercentage = loan.installments ? (loan.paidInstallments / loan.installments) * 100 : 0

    const handleViewPayment = (payment: Installment) => {
        setSelectedInstallment(payment)
        setInstallmentModalOpen(true)
    }
    const partialDebt = calculatePartialInstallmentDebt(loan.remainingInstallments || 0, loan.installmentPaymentAmmount || 0)
    const statusConfig = STATUS_CONFIG[loan.status] || STATUS_CONFIG.PENDING

    const initials = user.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()

    return (
        <div className="space-y-6">
            {/* Row 1: Client & Vehicle - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Client Card */}
                <Card className="border-border/50">
                    <CardHeader className="py-3 px-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                        <CardTitle className="flex items-center text-sm font-semibold">
                            <Users className="mr-2 h-4 w-4 text-blue-500" />
                            Información del Cliente
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/50">
                            <Avatar className="h-12 w-12 border-2 border-blue-500/20">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-600 font-medium">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-foreground">{user.name}</h3>
                                <p className="text-xs text-muted-foreground">Cliente</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <InfoItem icon={<CreditCard className="h-3.5 w-3.5" />} label="ID" value={user.identification || "N/A"} />
                            <InfoItem icon={<Phone className="h-3.5 w-3.5" />} label="Tel" value={user.phone || "N/A"} />
                            {user.refName && <InfoItem icon={<User2 className="h-3.5 w-3.5" />} label="Ref" value={user.refName} />}
                            {user.address && <InfoItem icon={<MapPin className="h-3.5 w-3.5" />} label="Dir" value={user.address} />}
                            {user.city && <InfoItem icon={<MapPin className="h-3.5 w-3.5" />} label="Ciudad" value={user.city} />}
                        </div>
                    </CardContent>
                </Card>

                {/* Vehicle Card */}
                <Card className="border-border/50">
                    <CardHeader className="py-3 px-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                        <CardTitle className="flex items-center text-sm font-semibold">
                            <Bike className="mr-2 h-4 w-4 text-emerald-500" />
                            Información del Vehículo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/50">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                                <Bike className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">{vehicle?.brand} {vehicle?.model}</h3>
                                <p className="text-xs text-muted-foreground">Vehículo</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <InfoItem icon={<Hash className="h-3.5 w-3.5" />} label="Placa" value={vehicle?.plate || "N/A"} highlight />
                            <InfoItem icon={<Bike className="h-3.5 w-3.5" />} label="Marca" value={vehicle?.brand || "N/A"} />
                            <InfoItem icon={<Settings className="h-3.5 w-3.5" />} label="Modelo" value={vehicle?.model || "N/A"} />
                            {vehicle?.engine && <InfoItem icon={<Settings className="h-3.5 w-3.5" />} label="Motor" value={vehicle.engine} />}
                            {vehicle?.chassis && <InfoItem icon={<Shield className="h-3.5 w-3.5" />} label="Chasis" value={vehicle.chassis} />}
                            {vehicle?.color && <InfoItem icon={<Palette className="h-3.5 w-3.5" />} label="Color" value={vehicle.color} />}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: Contract Details */}
            <Card className="border-border/50">
                <CardHeader className="py-3 px-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                    <CardTitle className="flex items-center text-sm font-semibold">
                        <FileText className="mr-2 h-4 w-4 text-violet-500" />
                        Detalles del Contrato
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {/* Status Row */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                <CreditCard className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Estado</p>
                                <Badge variant="outline" className={cn("text-xs", statusConfig.className)}>
                                    {statusConfig.label}
                                </Badge>
                            </div>
                        </div>
                        {loan.contractNumber && (
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Contrato No.</p>
                                <p className="text-lg font-bold">{loan.contractNumber}</p>
                            </div>
                        )}
                    </div>

                    {/* Financial Grid - 4 columns */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard 
                            icon={<Wallet className="h-4 w-4" />} 
                            iconBg="bg-blue-500/20" 
                            iconColor="text-blue-500"
                            label="Precio Total" 
                            value={formatCurrency(loan.totalAmount)} 
                            subtitle={`Inicial: ${formatCurrency(loan.downPayment || 0)}`} 
                        />
                        <StatCard 
                            icon={<Coins className="h-4 w-4" />} 
                            iconBg="bg-emerald-500/20" 
                            iconColor="text-emerald-500"
                            label="Total con Interés" 
                            value={formatCurrency(totalWithInterest)} 
                            subtitle={`Tasa: ${loan.interestRate || 0}%`} 
                        />
                        <StatCard 
                            icon={<Receipt className="h-4 w-4" />} 
                            iconBg="bg-violet-500/20" 
                            iconColor="text-violet-500"
                            label={`Cuota ${FREQUENCY_LABELS[loan.paymentFrequency || "DAILY"]}`} 
                            value={formatCurrency(loan.installmentPaymentAmmount || 0)} 
                            subtitle={INTEREST_TYPE_LABELS[loan.interestType || "FIXED"]} 
                        />
                        <StatCard 
                            icon={<CalendarDays className="h-4 w-4" />} 
                            iconBg="bg-amber-500/20" 
                            iconColor="text-amber-500"
                            label="Total de Cuotas" 
                            value={String(loan.installments || 0)} 
                            subtitle={FREQUENCY_LABELS[loan.paymentFrequency || "DAILY"]} 
                        />
                    </div>

                    {/* Progress Grid - 4 columns */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Progress Card with bar */}
                        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground">Progreso</p>
                                    <p className="text-sm font-bold">
                                        <span className="text-primary">{Math.round(loan.paidInstallments || 0)}</span>
                                        <span className="text-muted-foreground"> / </span>
                                        <span>{Math.round(loan.installments || 0)}</span>
                                    </p>
                                </div>
                            </div>
                            <Progress value={progressPercentage} className="h-1.5" />
                            <p className="text-[10px] text-muted-foreground mt-1 text-right">{progressPercentage.toFixed(1)}%</p>
                        </div>

                        <StatCard 
                            icon={<CheckCircle className="h-4 w-4" />} 
                            iconBg="bg-emerald-500/20" 
                            iconColor="text-emerald-500"
                            label="Total Pagado" 
                            value={formatCurrency(loan.totalPaid || 0)} 
                            valueColor="text-emerald-500"
                            subtitle={`${progressPercentage.toFixed(1)}% completado`} 
                        />
                        <StatCard 
                            icon={<Clock className="h-4 w-4" />} 
                            iconBg="bg-amber-500/20" 
                            iconColor="text-amber-500"
                            label="Deuda Restante" 
                            value={formatCurrency(loan.debtRemaining || 0)} 
                            valueColor="text-amber-500"
                            subtitle={`${partialDebt.fullInstallments} cuotas`} 
                        />
                        <StatCard 
                            icon={<Percent className="h-4 w-4" />} 
                            iconBg="bg-violet-500/20" 
                            iconColor="text-violet-500"
                            label="Interés Generado" 
                            value={formatCurrency(interestGenerated)} 
                            valueColor="text-violet-500"
                            subtitle={`${loan.interestRate || 0}% por cuota`} 
                        />
                    </div>

                    {/* Dates Row - 3 columns */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <StatCard 
                            icon={<Calendar className="h-4 w-4" />} 
                            iconBg="bg-emerald-500/20" 
                            iconColor="text-emerald-500"
                            label="Fecha de Inicio" 
                            value={loan.startDate ? formatDate(loan.startDate.split("T")[0]) : "N/A"} 
                        />
                        <StatCard 
                            icon={<MapPin className="h-4 w-4" />} 
                            iconBg="bg-blue-500/20" 
                            iconColor="text-blue-500"
                            label="Fecha Estimada de Fin" 
                            value={loan.endDate ? formatDate(loan.endDate.split("T")[0]) : "N/A"} 
                        />
                        {loan.gpsInstallmentPayment > 0 && (
                            <StatCard 
                                icon={<Navigation className="h-4 w-4" />} 
                                iconBg="bg-cyan-500/20" 
                                iconColor="text-cyan-500"
                                label="Pago GPS por Cuota" 
                                value={formatCurrency(loan.gpsInstallmentPayment)} 
                                valueColor="text-cyan-500"
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Row 3: Payment History */}
            <PaymentHistoryTable
                payments={loan.payments}
                currentPage={currentPage}
                itemsPerPage={10}
                onPageChange={onPageChange}
                onViewPayment={handleViewPayment}
            />

            {/* Installment Details Modal */}
            <InstallmentDetailsModal
                installment={selectedInstallment}
                open={installmentModalOpen}
                onOpenChange={setInstallmentModalOpen}
            />
        </div>
    )
}

// Simple info item component
function InfoItem({ icon, label, value, highlight = false }: { 
    icon: React.ReactNode
    label: string
    value: string
    highlight?: boolean 
}) {
    return (
        <div className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded text-xs",
            highlight ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted/30"
        )}>
            <span className="text-muted-foreground">{icon}</span>
            <span className="text-muted-foreground">{label}:</span>
            <span className={cn("font-medium truncate", highlight && "text-emerald-500")}>{value}</span>
        </div>
    )
}

// Stat card component
function StatCard({ 
    icon, 
    iconBg, 
    iconColor, 
    label, 
    value, 
    valueColor,
    subtitle 
}: { 
    icon: React.ReactNode
    iconBg: string
    iconColor: string
    label: string
    value: string
    valueColor?: string
    subtitle?: string 
}) {
    return (
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-2">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", iconBg)}>
                    <span className={iconColor}>{icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground truncate">{label}</p>
                    <p className={cn("text-sm font-bold truncate", valueColor)}>{value}</p>
                    {subtitle && <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>}
                </div>
            </div>
        </div>
    )
}
