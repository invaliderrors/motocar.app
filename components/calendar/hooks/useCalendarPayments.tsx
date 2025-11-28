"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"

type Payment = {
  id: string
  loanId: string
  amount: number
  gps: number
  paymentDate: string
  isLate: boolean
  latePaymentDate: string | null
  notes: string | null
  paymentMethod: string
  loan: {
    id: string
    user: {
      name: string
      identification: string
      phone: string
    }
    vehicle: {
      model: string
      plate: string
      brand: string
    }
    contractNumber: string | null
  }
}

type Loan = {
  id: string
  contractNumber: string | null
  user: {
    name: string
    identification: string
  }
  vehicle: {
    model: string
    plate: string
    brand: string
  }
}

export function useCalendarPayments() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null)
  const [loans, setLoans] = useState<Loan[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Fetch all loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((c) => c.startsWith("authToken="))
          ?.split("=")[1]

        const response = await HttpService.get<any[]>("/api/v1/loans", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        })

        const mappedLoans: Loan[] = response.data.map((loan) => ({
          id: loan.id,
          contractNumber: loan.contractNumber,
          user: {
            name: loan.user?.name ?? "Sin nombre",
            identification: loan.user?.identification ?? "",
          },
          vehicle: {
            model: loan.vehicle?.model ?? "Sin modelo",
            plate: loan.vehicle?.plate ?? "Sin placa",
            brand: loan.vehicle?.brand ?? "Sin marca",
          },
        }))

        setLoans(mappedLoans)
      } catch (error) {
        console.error("Error al obtener préstamos:", error)
        toast({
          variant: "destructive",
          title: "Error al cargar datos",
          description: "No se pudieron obtener los préstamos",
        })
      }
    }

    fetchLoans()
  }, [toast])

  // Fetch payments for selected loan and month
  useEffect(() => {
    const fetchPayments = async () => {
      if (!selectedLoan) {
        setPayments([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const token = document.cookie
          .split("; ")
          .find((c) => c.startsWith("authToken="))
          ?.split("=")[1]

        const response = await HttpService.get<any>(`/api/v1/installments?loanId=${selectedLoan}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        })

        // The API returns { data: [...], pagination: {...} }
        const installments = response.data?.data || response.data || []

        const mappedPayments: Payment[] = installments.map((payment: any) => ({
          id: payment.id,
          loanId: payment.loanId,
          amount: payment.amount,
          gps: payment.gps || 0,
          paymentDate: payment.paymentDate,
          isLate: payment.isLate || false,
          latePaymentDate: payment.latePaymentDate,
          notes: payment.notes,
          paymentMethod: payment.paymentMethod || "CASH",
          loan: {
            id: payment.loan?.id ?? selectedLoan,
            user: {
              name: payment.loan?.user?.name ?? "Sin nombre",
              identification: payment.loan?.user?.identification ?? "",
              phone: payment.loan?.user?.phone ?? "",
            },
            vehicle: {
              model: payment.loan?.vehicle?.model ?? "Sin modelo",
              plate: payment.loan?.vehicle?.plate ?? "Sin placa",
              brand: payment.loan?.vehicle?.brand ?? "Sin marca",
            },
            contractNumber: payment.loan?.contractNumber,
          },
        }))

        setPayments(mappedPayments)
      } catch (error) {
        console.error("Error al obtener pagos:", error)
        toast({
          variant: "destructive",
          title: "Error al cargar pagos",
          description: "No se pudieron obtener los pagos del préstamo",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [selectedLoan, toast])

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDayClick = (date: Date) => {
    const dayPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.paymentDate)
      return (
        paymentDate.getDate() === date.getDate() &&
        paymentDate.getMonth() === date.getMonth() &&
        paymentDate.getFullYear() === date.getFullYear()
      )
    })

    if (dayPayments.length > 0) {
      setSelectedPayment(dayPayments[0]) // Show first payment if multiple
      setDialogOpen(true)
    }
  }

  const handleRefresh = async () => {
    if (selectedLoan) {
      setLoading(true)
      // Trigger re-fetch by updating a refresh key or call fetchPayments directly
      const token = document.cookie
        .split("; ")
        .find((c) => c.startsWith("authToken="))
        ?.split("=")[1]

      try {
        const response = await HttpService.get<any>(`/api/v1/installments?loanId=${selectedLoan}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        })

        const installments = response.data?.data || response.data || []
        const mappedPayments: Payment[] = installments.map((payment: any) => ({
          id: payment.id,
          loanId: payment.loanId,
          amount: payment.amount,
          gps: payment.gps || 0,
          paymentDate: payment.paymentDate,
          isLate: payment.isLate || false,
          latePaymentDate: payment.latePaymentDate,
          notes: payment.notes,
          paymentMethod: payment.paymentMethod || "CASH",
          loan: {
            id: payment.loan?.id ?? selectedLoan,
            user: {
              name: payment.loan?.user?.name ?? "Sin nombre",
              identification: payment.loan?.user?.identification ?? "",
              phone: payment.loan?.user?.phone ?? "",
            },
            vehicle: {
              model: payment.loan?.vehicle?.model ?? "Sin modelo",
              plate: payment.loan?.vehicle?.plate ?? "Sin placa",
              brand: payment.loan?.vehicle?.brand ?? "Sin marca",
            },
            contractNumber: payment.loan?.contractNumber,
          },
        }))

        setPayments(mappedPayments)
        toast({
          title: "Actualizado",
          description: "Los pagos se han actualizado correctamente",
        })
      } catch (error) {
        console.error("Error al actualizar pagos:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron actualizar los pagos",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleExport = () => {
    if (!selectedLoan || payments.length === 0) return

    const selectedLoanData = loans.find((l) => l.id === selectedLoan)
    if (!selectedLoanData) return

    const headers = [
      "Fecha",
      "Monto",
      "GPS",
      "Total",
      "Método de Pago",
      "Estado",
      "Notas",
    ]

    const formatCurrency = (value: number) => {
      return `$${value.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`
    }

    const getPaymentMethodText = (method: string) => {
      const methods: Record<string, string> = {
        CASH: "Efectivo",
        NEQUI: "Nequi",
        DAVIPLATA: "Daviplata",
        BANCOLOMBIA: "Bancolombia",
        TRANSFER: "Transferencia",
        OTHER: "Otro",
      }
      return methods[method] || method
    }

    const escapeCSV = (value: string | number | null | undefined): string => {
      if (value === null || value === undefined) return ""
      const stringValue = String(value)
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }

    const csvRows = [
      `Calendario de Pagos - ${selectedLoanData.vehicle.plate}`,
      `Vehículo: ${selectedLoanData.vehicle.brand} ${selectedLoanData.vehicle.model}`,
      `Cliente: ${selectedLoanData.user.name}`,
      "",
      headers.join(","),
      ...payments
        .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())
        .map((payment) => {
          const paymentDate = new Date(payment.paymentDate).toLocaleDateString("es-CO")
          const total = payment.amount + payment.gps
          return [
            escapeCSV(paymentDate),
            escapeCSV(formatCurrency(payment.amount)),
            escapeCSV(formatCurrency(payment.gps)),
            escapeCSV(formatCurrency(total)),
            escapeCSV(getPaymentMethodText(payment.paymentMethod)),
            escapeCSV(payment.isLate ? "Tardío" : "A tiempo"),
            escapeCSV(payment.notes || ""),
          ].join(",")
        }),
      "",
      `Total de Pagos,${payments.length}`,
      `Monto Total,${formatCurrency(payments.reduce((sum, p) => sum + p.amount + p.gps, 0))}`,
      "",
      `Generado el,${new Date().toLocaleString("es-CO")}`,
    ]

    const csvContent = "\uFEFF" + csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    const timestamp = new Date().toISOString().split("T")[0]
    link.setAttribute("href", url)
    link.setAttribute("download", `calendario-pagos-${selectedLoanData.vehicle.plate}-${timestamp}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportación exitosa",
      description: `Se exportaron ${payments.length} pagos al archivo CSV`,
    })
  }

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount + payment.gps, 0)

  const filteredLoans = loans.filter((loan) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      loan.vehicle.plate.toLowerCase().includes(search) ||
      loan.vehicle.model.toLowerCase().includes(search) ||
      loan.vehicle.brand.toLowerCase().includes(search) ||
      loan.user.name.toLowerCase().includes(search) ||
      loan.user.identification.toLowerCase().includes(search)
    )
  })

  return {
    currentDate,
    selectedLoan,
    loans: filteredLoans,
    payments,
    loading,
    selectedPayment,
    dialogOpen,
    searchTerm,
    totalPayments: payments.length,
    totalAmount,
    setSearchTerm,
    setSelectedLoan,
    setCurrentDate,
    handlePreviousMonth,
    handleNextMonth,
    handleToday,
    handleDayClick,
    handleRefresh,
    handleExport,
    setDialogOpen,
  }
}
