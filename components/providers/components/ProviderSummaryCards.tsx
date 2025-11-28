"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Bike, DollarSign, TrendingUp } from "lucide-react"
import type { Provider } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface ProviderSummaryCardsProps {
    providers: Provider[]
    loading: boolean
}

export function ProviderSummaryCards({ providers, loading }: ProviderSummaryCardsProps) {
    const totalProviders = providers.length
    const totalMotorcycles = providers.reduce((sum, provider) => sum + (provider.motorcylces?.length || 0), 0)
    const totalCashRegisters = providers.reduce((sum, provider) => sum + (provider.cashRegisters?.length || 0), 0)

    const totalCashAmount = providers.reduce((sum, provider) => {
        return (
            sum +
            (provider.cashRegisters?.reduce((regSum, register) => {
                return regSum + register.cashInRegister + register.cashFromTransfers + register.cashFromCards
            }, 0) || 0)
        )
    }, 0)


    const cards = [
        {
            title: "Total Proveedores",
            value: totalProviders.toString(),
            icon: Building,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Total Motocicletas",
            value: totalMotorcycles.toString(),
            icon: Bike,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-950/30",
        },
        {
            title: "Cierres de Caja",
            value: totalCashRegisters.toString(),
            icon: TrendingUp,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
        },
        {
            title: "Total en Caja",
            value: `${formatCurrency(totalCashAmount)}`,
            icon: DollarSign,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        },
    ]

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {cards.map((_, index) => (
                    <Card key={index} className="border border-blue-100 dark:border-blue-900/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card, index) => (
                <Card key={index} className="border border-blue-100 dark:border-blue-900/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</CardTitle>
                        <div className={`p-2 rounded-full ${card.bgColor}`}>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
