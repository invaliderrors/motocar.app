"use client"

import type React from "react"
import { LoanDetailsModal } from "./modals"

/**
 * @deprecated Use LoanDetailsModal from "./modals" instead
 * This component is kept for backwards compatibility
 */
export function LoanDetails({
  children,
  loanId,
  loanData,
}: {
  children: React.ReactNode
  loanId: string
  loanData?: any
}) {
  return (
    <LoanDetailsModal loanId={loanId} loanData={loanData}>
      {children}
    </LoanDetailsModal>
  )
}
