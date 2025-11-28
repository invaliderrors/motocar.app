import { HttpService } from "@/lib/http"
import { API_ENDPOINTS } from "../constants"
import { Transaction, TransactionResponse } from "../constants/types"
import { formatTimeFromDate } from "../utils/formatters"
import { Installment, Expense } from "@/lib/types"

/**
 * Fetches available transactions (installments and expenses)
 * @param token - Authentication token
 */
export const fetchAvailableTransactions = async (token: string): Promise<Transaction[]> => {
    try {
        console.log('🌐 Service - Fetching all available transactions');

        const response = await HttpService.get<TransactionResponse>(API_ENDPOINTS.AVAILABLE_PAYMENTS, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
        })

        console.log('✅ Service - API Response:', response.data);

        const incomes = mapInstallmentsToTransactions(response.data.installments)
        const expenses = mapExpensesToTransactions(response.data.expenses)

        return [...incomes, ...expenses]
    } catch (error) {
        console.error("Error fetching transactions:", error)
        throw error
    }
}

/**
 * Maps installments from API to Transaction objects
 */
const mapInstallmentsToTransactions = (installments: Installment[]): Transaction[] => {
    return installments.map((installment) => {
        // IMPORTANT: The logic for dates is:
        // - paymentDate = the actual date when payment was made/registered
        // - latePaymentDate = the original due date (when isLate = true)
        // 
        // For closings, we need to track BOTH dates:
        // - date: actual payment date (for display and grouping by payment date)
        // - latePaymentDate: due date (for validation - can't mix different due dates)
        const actualPaymentDate = installment.paymentDate;

        return {
            id: installment.id,
            time: formatTimeFromDate(actualPaymentDate),
            description: `${installment.loan.vehicle.plate}`,
            category: "Cuota de arredamiento",
            amount: installment.amount + installment.gps, // Add GPS to the amount
            baseAmount: installment.amount, // Keep the original amount as baseAmount
            gpsAmount: installment.gps, // Store the GPS amount separately
            paymentMethod: installment.paymentMethod, // Use enum directly
            type: "income",
            reference: installment.id,
            client: installment.loan.user.name,
            provider: installment.loan.vehicle.provider,
            date: new Date(actualPaymentDate),
            isLate: installment.isLate,
            latePaymentDate: installment.latePaymentDate ? new Date(installment.latePaymentDate) : null,
            createdBy: installment.createdBy,
        }
    })
}

/**
 * Maps expenses from API to Transaction objects
 */
const mapExpensesToTransactions = (expenses: Expense[]): Transaction[] => {
    return expenses.map((expense) => ({
        id: expense.id,
        time: formatTimeFromDate(expense.date),
        description: expense.description,
        category: expense.category,
        amount: expense.amount,
        paymentMethod: expense.paymentMethod, // Use enum directly
        type: "expense",
        reference: expense.reference ?? "",
        provider: expense.provider || undefined,
        date: new Date(expense.date),
        createdBy: expense.createdBy,
    }))
}
