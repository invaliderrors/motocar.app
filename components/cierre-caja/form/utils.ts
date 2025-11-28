import { Provider } from "@/lib/types"
import { ChartData, FormCalculations, FormState, SelectedTransaction } from "./types"


export const getProviderDetailsFromTransactions = (transactions: SelectedTransaction[]): Provider | undefined => {
    console.log('🔍 getProviderDetailsFromTransactions - All transactions:', transactions);
    
    const incomesWithProvider = transactions.filter((t) => {
        const hasProvider = t.type === "income" && t.provider;
        console.log(`Transaction ${t.id}:`, {
            type: t.type,
            hasProvider: !!t.provider,
            provider: t.provider
        });
        return hasProvider;
    });
    
    console.log('📊 Incomes with provider:', incomesWithProvider);
    
    const selectedProvider = incomesWithProvider.length > 0 ? incomesWithProvider[0].provider : undefined;
    console.log('✅ Selected provider:', selectedProvider);
    
    return selectedProvider;
}

export const calculateFormValues = (formState: FormState): FormCalculations => {
    const cashInRegister = Number.parseFloat(formState.cashInRegister) || 0
    const cashFromTransfers = Number.parseFloat(formState.cashFromTransfers) || 0
    const cashFromCards = Number.parseFloat(formState.cashFromCards) || 0
    const totalRegistered = cashInRegister + cashFromTransfers + cashFromCards
    const hasAnyValue = cashInRegister > 0 || cashFromTransfers > 0 || cashFromCards > 0

    return {
        cashInRegister,
        cashFromTransfers,
        cashFromCards,
        totalRegistered,
        totalExpected: 0, // Will be calculated separately
        totalExpenses: 0, // Will be calculated separately
        totalDifference: 0, // Will be calculated separately
        hasAnyValue,
    }
}

export const calculateTransactionTotals = (transactions: SelectedTransaction[]) => {
    const incomes = transactions.filter((t) => t.type === "income")
    const expenses = transactions.filter((t) => t.type === "expense")

    const totalExpected = incomes.reduce((acc, item) => acc + item.amount, 0)
    const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0)

    return {
        incomes,
        expenses,
        totalExpected,
        totalExpenses,
    }
}

export const calculateAutoFillValues = (incomes: SelectedTransaction[]) => {
    const cash = incomes.filter((i) => i.paymentMethod === "CASH").reduce((acc, i) => acc + i.amount, 0)
    const transfers = incomes.filter((i) => i.paymentMethod === "TRANSACTION").reduce((acc, i) => acc + i.amount, 0)
    const cards = incomes.filter((i) => i.paymentMethod === "CARD").reduce((acc, i) => acc + i.amount, 0)

    return { cash, transfers, cards }
}

export const createChartData = (
    calculations: FormCalculations,
): {
    paymentMethodData: ChartData[]
    transactionTypeData: ChartData[]
} => {
    const paymentMethodData = [
        { name: "Efectivo", value: calculations.cashInRegister },
        { name: "Transferencias", value: calculations.cashFromTransfers },
        { name: "Tarjetas", value: calculations.cashFromCards },
    ]

    const transactionTypeData = [
        { name: "Ingresos", value: calculations.totalExpected },
        { name: "Egresos", value: calculations.totalExpenses },
    ]

    return {
        paymentMethodData: paymentMethodData.filter((item) => item.value > 0),
        transactionTypeData: transactionTypeData.filter((item) => item.value > 0),
    }
}

export const CHART_COLORS = {
    PAYMENT_METHODS: ["#10b981", "#3b82f6", "#8b5cf6"],
    TRANSACTION_TYPES: ["#10b981", "#ef4444"],
}
