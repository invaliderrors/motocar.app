"use client"

import { formatCurrency, calculatePartialInstallmentDebt } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, CheckCircle, Clock, Percent } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentProgressGridProps {
    paidInstallments: number
    totalInstallments: number
    totalPaid: number
    debtRemaining: number
    remainingInstallments: number
    installmentAmount: number
    interestGenerated: number
    interestRate: number
    downPayment?: number
    gpsInstallmentPayment?: number
}

export function PaymentProgressGrid({
    paidInstallments,
    totalInstallments,
    totalPaid,
    debtRemaining,
    remainingInstallments,
    installmentAmount,
    interestGenerated,
    interestRate,
    downPayment = 0,
    gpsInstallmentPayment = 0,
}: PaymentProgressGridProps) {
    // Calculate installments covered by downpayment
    const dailyRate = installmentAmount + gpsInstallmentPayment
    const downPaymentInstallments = downPayment > 0 && dailyRate > 0 
        ? Math.floor(downPayment / dailyRate) 
        : 0
    const effectivePaidInstallments = paidInstallments + downPaymentInstallments
    
    const progressPercentage = totalInstallments 
        ? Math.min((effectivePaidInstallments / totalInstallments) * 100, 100)
        : 0

    const partialDebt = calculatePartialInstallmentDebt(
        remainingInstallments,
        installmentAmount
    )

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Payment Progress */}
            <ProgressCard
                icon={<TrendingUp className="h-5 w-5" />}
                iconColor="text-blue-500"
                iconBg="from-blue-500/20 to-blue-600/20"
                label="Progreso de Pagos"
                paid={effectivePaidInstallments}
                total={totalInstallments}
                progress={progressPercentage}
                downPaymentInstallments={downPaymentInstallments}
            />
            
            {/* Total Paid */}
            <StatCard
                icon={<CheckCircle className="h-5 w-5" />}
                iconColor="text-emerald-500"
                iconBg="from-emerald-500/20 to-emerald-600/20"
                label="Total Pagado"
                value={formatCurrency(totalPaid)}
                valueColor="text-emerald-600 dark:text-emerald-400"
                subtitle={`${progressPercentage.toFixed(1)}% completado`}
            />
            
            {/* Remaining Debt */}
            <StatCard
                icon={<Clock className="h-5 w-5" />}
                iconColor="text-amber-500"
                iconBg="from-amber-500/20 to-amber-600/20"
                label="Deuda Restante"
                value={formatCurrency(debtRemaining)}
                valueColor="text-amber-600 dark:text-amber-400"
                subtitle={<DebtSubtitle partialDebt={partialDebt} />}
            />
            
            {/* Interest Generated */}
            <StatCard
                icon={<Percent className="h-5 w-5" />}
                iconColor="text-violet-500"
                iconBg="from-violet-500/20 to-violet-600/20"
                label="Interés Generado"
                value={formatCurrency(interestGenerated)}
                valueColor="text-violet-600 dark:text-violet-400"
                subtitle={`${interestRate}% por cuota`}
            />
        </div>
    )
}

interface ProgressCardProps {
    icon: React.ReactNode
    iconColor: string
    iconBg: string
    label: string
    paid: number
    total: number
    progress: number
    downPaymentInstallments?: number
}

function ProgressCard({ icon, iconColor, iconBg, label, paid, total, progress, downPaymentInstallments = 0 }: ProgressCardProps) {
    return (
        <div className="p-3 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
            <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                    "h-9 w-9 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                    iconBg
                )}>
                    <span className={iconColor}>{icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
                    <p className="text-base font-bold text-foreground">
                        <span className="text-primary">{paid.toFixed(2)}</span>
                        <span className="text-muted-foreground mx-1">/</span>
                        <span>{total}</span>
                    </p>
                </div>
            </div>
            <Progress value={progress} className="h-1.5" />
            <div className="flex justify-between items-center mt-1.5">
                {downPaymentInstallments > 0 && (
                    <p className="text-[10px] text-green-600 dark:text-green-400">Inicial: {downPaymentInstallments} cuotas</p>
                )}
                <p className="text-[10px] text-muted-foreground ml-auto">{progress.toFixed(1)}%</p>
            </div>
        </div>
    )
}

interface StatCardProps {
    icon: React.ReactNode
    iconColor: string
    iconBg: string
    label: string
    value: string
    valueColor: string
    subtitle: React.ReactNode
}

function StatCard({ icon, iconColor, iconBg, label, value, valueColor, subtitle }: StatCardProps) {
    return (
        <div className="p-3 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-border transition-colors">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "h-9 w-9 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                    iconBg
                )}>
                    <span className={iconColor}>{icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
                    <p className={cn("text-base font-bold", valueColor)}>{value}</p>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</div>
                </div>
            </div>
        </div>
    )
}

interface PartialDebtInfo {
    fullInstallments: number
    partialInstallmentAmount: number
    partialInstallmentPercentage: number
}

function DebtSubtitle({ partialDebt }: { partialDebt: PartialDebtInfo }) {
    if (partialDebt.fullInstallments > 0 && partialDebt.partialInstallmentAmount > 0) {
        return (
            <>
                <span>{partialDebt.fullInstallments} cuotas completas</span>
                <span className="block">
                    + {formatCurrency(partialDebt.partialInstallmentAmount)} ({partialDebt.partialInstallmentPercentage.toFixed(1)}%)
                </span>
            </>
        )
    } else if (partialDebt.partialInstallmentAmount > 0 && partialDebt.fullInstallments === 0) {
        return (
            <span>
                {formatCurrency(partialDebt.partialInstallmentAmount)} ({partialDebt.partialInstallmentPercentage.toFixed(1)}%)
            </span>
        )
    } else {
        return <span>{partialDebt.fullInstallments} cuotas pendientes</span>
    }
}
