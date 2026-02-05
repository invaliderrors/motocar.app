"use client"

import { HttpService } from "@/lib/http"
import { useState, useEffect } from "react"

export type ClosingValidationStatus = "CORRECT" | "MINOR_DIFFERENCE" | "MAJOR_DIFFERENCE" | "INSTALLMENT_DELETED"

export interface MissingInstallment {
  installmentId: string
  amount: number
  gpsAmount: number
  totalAmount: number
  clientName: string
  vehiclePlate: string
  contractNumber: string
  paymentDate: string
  reason: "REMOVED_FROM_CLOSING" | "DELETED"
  deletedAt?: string
  deletedBy?: string
}

export interface ClosingValidationResult {
  isValid: boolean
  status: ClosingValidationStatus
  message: string
  details: {
    expectedTotal: number
    actualTotal: number
    difference: number
    missingInstallments: MissingInstallment[]
    deletedInstallments: MissingInstallment[]
    auditHistory: Array<{
      id: string
      changeType: string
      description: string
      amountImpact: number | null
      createdAt: string
      createdBy: string | null
    }>
  }
}

export function useClosingValidation(cashRegisterId: string | null) {
  const [validation, setValidation] = useState<ClosingValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!cashRegisterId) {
      setValidation(null)
      return
    }

    const fetchValidation = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await HttpService.get<ClosingValidationResult>(`/closing/validate/${cashRegisterId}`)
        setValidation(response.data)
      } catch (err) {
        console.error("Error validating closing:", err)
        setError("No se pudo validar el cierre")
        setValidation(null)
      } finally {
        setLoading(false)
      }
    }

    fetchValidation()
  }, [cashRegisterId])

  return { validation, loading, error }
}
