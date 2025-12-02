"use client"

import { formatCurrency } from "@/lib/utils"
import { Coins, Receipt, Wallet, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

interface FinancialSummaryGridProps {
    totalAmount: number
    downPayment: number
    totalWithInterest: number
    interestRate: number
    installmentAmount: number
    paymentFrequency: string
    interestType: string
    totalInstallments: number
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

export function FinancialSummaryGrid({
    totalAmount,
    downPayment,
    totalWithInterest,
    interestRate,
    installmentAmount,
    paymentFrequency,
    interestType,
    totalInstallments,
}: FinancialSummaryGridProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <FinancialCard
                icon={<Wallet className="h-5 w-5" />}
                iconColor="text-blue-500"
                iconBg="from-blue-500/20 to-blue-600/20"
                label="Precio Total"
                value={formatCurrency(totalAmount)}
                subtitle={`Inicial: ${formatCurrency(downPayment || 0)}`}
            />
            
            <FinancialCard
                icon={<Coins className="h-5 w-5" />}
                iconColor="text-emerald-500"
                iconBg="from-emerald-500/20 to-emerald-600/20"
                label="Total con Interés"
                value={formatCurrency(totalWithInterest)}
                subtitle={`Tasa: ${interestRate || 0}%`}
            />
            
            <FinancialCard
                icon={<Receipt className="h-5 w-5" />}
                iconColor="text-violet-500"
                iconBg="from-violet-500/20 to-violet-600/20"
                label={`Cuota ${FREQUENCY_LABELS[paymentFrequency] || paymentFrequency}`}
                value={formatCurrency(installmentAmount)}
                subtitle={INTEREST_TYPE_LABELS[interestType] || interestType}
            />
            
            <FinancialCard
                icon={<CalendarDays className="h-5 w-5" />}
                iconColor="text-amber-500"
                iconBg="from-amber-500/20 to-amber-600/20"
                label="Total de Cuotas"
                value={totalInstallments.toString()}
                subtitle={FREQUENCY_LABELS[paymentFrequency] || paymentFrequency}
            />
        </div>
    )
}

interface FinancialCardProps {
    icon: React.ReactNode
    iconColor: string
    iconBg: string
    label: string
    value: string
    subtitle?: string
}

function FinancialCard({ icon, iconColor, iconBg, label, value, subtitle }: FinancialCardProps) {
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
                    <p className="text-base font-bold text-foreground">{value}</p>
                    {subtitle && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
