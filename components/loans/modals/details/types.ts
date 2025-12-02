import { Loan } from "@/lib/types"

export interface LoanDetailsProps {
    loan: Loan
    interests: number
}

export interface PaymentHistoryProps {
    payments: Loan["payments"]
    currentPage: number
    itemsPerPage: number
    onPageChange: (page: number) => void
}
