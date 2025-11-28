"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import { Loan } from "@/lib/types"

export function useLoanTable() {
    const [loans, setLoans] = useState<Loan[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [refreshKey, setRefreshKey] = useState(0)
    const [printingContract, setPrintingContract] = useState(false)
    const [printProgress, setPrintProgress] = useState(0)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
    const [loanToDelete, setLoanToDelete] = useState<string | null>(null)
    const [loanToArchive, setLoanToArchive] = useState<{ id: string; archived: boolean } | null>(null)
    const [showArchived, setShowArchived] = useState(false)

    const { toast } = useToast()

    // Auto-adjust items per page based on screen height
    useEffect(() => {
        const calculateItemsPerPage = () => {
            const height = window.innerHeight
            // Estimate: ~60px for header, ~200px for controls/pagination, ~65px per row
            const availableHeight = height - 350
            const rowHeight = 65
            const calculatedItems = Math.floor(availableHeight / rowHeight)
            // Min 5, max 20 items
            const items = Math.max(5, Math.min(20, calculatedItems))
            setItemsPerPage(items)
        }

        calculateItemsPerPage()
        window.addEventListener('resize', calculateItemsPerPage)
        
        return () => window.removeEventListener('resize', calculateItemsPerPage)
    }, [])

    const fetchLoans = async () => {
        try {
            setLoading(true)
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
                ...loan,
                userName: loan.user?.name ?? "Sin nombre",
                vehicleModel: loan.vehicle?.model ?? "Sin modelo",
                // Backwards compatibility
                motorcycleModel: loan.vehicle?.model ?? loan.motorcycle?.model ?? "Sin modelo",
                archived: loan.archived ?? false, // Default to false if not provided
            }))
            setLoans(mappedLoans)
        } catch (error) {
            console.error("Error al obtener arrendamientos:", error)
            toast({
                variant: "destructive",
                title: "Error al cargar datos",
                description: "No se pudieron obtener los arrendamientos del servidor",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLoans()
    }, [refreshKey])

    const handleDelete = async (id: string) => {
        setLoanToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleArchive = async (id: string, archived: boolean) => {
        setLoanToArchive({ id, archived })
        setArchiveDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!loanToDelete) return
        try {
            const token = document.cookie
                .split("; ")
                .find((c) => c.startsWith("authToken="))
                ?.split("=")[1]
            await HttpService.delete(`/api/v1/loans/${loanToDelete}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            })
            setLoans((prev) => prev.filter((loan) => loan.id !== loanToDelete))
            toast({
                title: "Préstamo eliminado",
                description: "El préstamo ha sido eliminado correctamente",
            })
        } catch (error) {
            console.error("Error al eliminar préstamo:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el préstamo",
            })
        } finally {
            setDeleteDialogOpen(false)
            setLoanToDelete(null)
        }
    }

    const confirmArchive = async () => {
        if (!loanToArchive) return
        try {
            const token = document.cookie
                .split("; ")
                .find((c) => c.startsWith("authToken="))
                ?.split("=")[1]

            const endpoint = loanToArchive.archived
                ? `/api/v1/loans/${loanToArchive.id}/unarchive`
                : `/api/v1/loans/${loanToArchive.id}/archive`

            await HttpService.post(
                endpoint,
                {},
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                },
            )

            // Update the loan in the local state
            setLoans((prev) =>
                prev.map((loan) => (loan.id === loanToArchive.id ? { ...loan, archived: !loanToArchive.archived } : loan)),
            )

            toast({
                title: loanToArchive.archived ? "Préstamo desarchivado" : "Préstamo archivado",
                description: loanToArchive.archived
                    ? "El préstamo ha sido desarchivado correctamente"
                    : "El préstamo ha sido archivado correctamente",
            })
        } catch (error) {
            console.error("Error al archivar/desarchivar préstamo:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo procesar la solicitud",
            })
        } finally {
            setArchiveDialogOpen(false)
            setLoanToArchive(null)
        }
    }

    const handlePrintContract = async (loan: Loan) => {
        try {
            setPrintingContract(true)
            setPrintProgress(10)
            // Simular progreso
            const progressInterval = setInterval(() => {
                setPrintProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return 90
                    }
                    return prev + 10
                })
            }, 300)
            const res = await HttpService.post(
                "/api/v1/contract",
                {
                    contractNumber: loan.contractNumber,
                    legalRepresentative: "Andrés Felipe Correa Perdomo",
                    representativeId: "10497576",
                    customerName: loan.user.name,
                    customerId: loan.user.identification,
                    customerAddress: loan.user.address || "Dirección no disponible",
                    customerCity: loan.user.city || "Ciudad no disponible",
                    customerPhone: loan.user.phone || "Teléfono no disponible",
                    plate: loan.vehicle?.plate || loan.motorcycle?.plate || "Placa no disponible",
                    brand: loan.vehicle?.brand || loan.motorcycle?.brand || "Marca no disponible",
                    engine: loan.vehicle?.engine || loan.motorcycle?.engine,
                    model: loan.vehicle?.model || loan.motorcycle?.model || "Modelo no disponible",
                    chassis: loan.vehicle?.chassis || loan.motorcycle?.chassis,
                    date: new Date().toISOString(),
                },
                {
                    responseType: "blob",
                },
            )
            clearInterval(progressInterval)
            setPrintProgress(100)
            const blob = new Blob([res.data], { type: "application/pdf" })
            const fileURL = URL.createObjectURL(blob)
            const printWindow = window.open(fileURL)
            if (!printWindow) throw new Error("No se pudo abrir la ventana")
            printWindow.addEventListener("load", () => {
                printWindow.focus()
                printWindow.print()
            })
            toast({
                title: "Contrato generado",
                description: "El contrato se ha generado correctamente",
            })
            // Cerrar el diálogo después de un breve retraso
            setTimeout(() => {
                setPrintingContract(false)
                setPrintProgress(0)
            }, 1000)
        } catch (error) {
            console.error("Error al generar contrato:", error)
            toast({
                variant: "destructive",
                title: "Error al imprimir contrato",
                description: "No se pudo generar el contrato PDF",
            })
            setPrintingContract(false)
            setPrintProgress(0)
        }
    }

    const filteredLoans = loans.filter((loan) => {
        // Filter by archived status
        if (loan.archived !== showArchived) return false

        // Filter by search term
        const userMatch = loan.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        const vehicleMatch = loan.vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase())
        const idMatch = loan.user?.identification?.toLowerCase().includes(searchTerm.toLowerCase())
        const plateMatch = loan.vehicle?.plate?.toLowerCase().includes(searchTerm.toLowerCase())
        return userMatch || vehicleMatch || idMatch || plateMatch
    })

    const totalItems = filteredLoans.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const currentItems = filteredLoans.slice(startIndex, endIndex)

    const refreshData = () => {
        setRefreshKey((prev) => prev + 1)
    }

    const exportToCSV = () => {
        const getPaymentFrequencyText = (frequency: string) => {
            switch (frequency) {
                case "DAILY":
                    return "Diario"
                case "WEEKLY":
                    return "Semanal"
                case "BIWEEKLY":
                    return "Quincenal"
                case "MONTHLY":
                    return "Mensual"
                default:
                    return frequency
            }
        }

        const getInterestTypeText = (type: string | undefined) => {
            switch (type) {
                case "FIXED":
                    return "Fijo"
                case "COMPOUND":
                    return "Compuesto"
                default:
                    return "No especificado"
            }
        }

        const getStatusText = (status: string) => {
            switch (status) {
                case "ACTIVE":
                    return "Activo"
                case "COMPLETED":
                    return "Completado"
                case "DEFAULTED":
                    return "En mora"
                case "CANCELLED":
                    return "Cancelado"
                default:
                    return status
            }
        }

        const formatCurrency = (value: number) => {
            return `$${value.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
        }

        const formatPercentage = (value: number) => {
            return `${value}%`
        }

        const escapeCSV = (value: string | number | null | undefined): string => {
            if (value === null || value === undefined) return ""
            const stringValue = String(value)
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`
            }
            return stringValue
        }

        // Enhanced headers with more detailed information
        const headers = [
            // Cliente Information
            "ID Préstamo",
            "Número de Contrato",
            "Cliente",
            "Identificación Cliente",
            "Teléfono Cliente",
            "Dirección Cliente",
            
            // Vehículo Information
            "Marca Vehículo",
            "Modelo Vehículo",
            "Año",
            "Color",
            "Placa",
            "Chasis",
            "Motor",
            "Cilindraje (CC)",
            
            // Loan Financial Details
            "Monto Total",
            "Cuota Inicial",
            "Monto Financiado",
            "Tasa de Interés",
            "Tipo de Interés",
            "Cuota por Instalación",
            "GPS por Cuota",
            
            // Payment Status
            "Total de Cuotas",
            "Cuotas Pagadas",
            "Cuotas Restantes",
            "Total Pagado",
            "Deuda Restante",
            "Progreso (%)",
            
            // Schedule Information
            "Frecuencia de Pago",
            "Fecha de Inicio",
            "Fecha de Finalización",
            "Días Transcurridos",
            
            // Status
            "Estado",
            "Archivado",
            
            // Metadata
            "Fecha de Creación",
            "Última Actualización",
        ]

        const csvRows = [
            headers.join(","),
            ...filteredLoans.map((loan) => {
                const vehicle = loan.vehicle || loan.motorcycle
                const startDate = loan.startDate ? new Date(loan.startDate) : null
                const endDate = loan.endDate ? new Date(loan.endDate) : null
                const createdAt = new Date(loan.createdAt)
                const updatedAt = new Date(loan.updatedAt)
                
                // Calculate days elapsed
                const daysElapsed = startDate ? Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0
                
                // Calculate progress percentage
                const progress = loan.installments > 0 ? Math.round((loan.paidInstallments / loan.installments) * 100) : 0
                
                // Financed amount (total - down payment)
                const financedAmount = loan.totalAmount - loan.downPayment

                return [
                    // Cliente Information
                    escapeCSV(loan.id),
                    escapeCSV(loan.contractNumber || "Sin número"),
                    escapeCSV(loan.user.name),
                    escapeCSV(loan.user.identification),
                    escapeCSV(loan.user.phone || "No disponible"),
                    escapeCSV(loan.user.address || "No disponible"),
                    
                    // Vehículo Information
                    escapeCSV(vehicle?.brand || "Sin marca"),
                    escapeCSV(vehicle?.model || "Sin modelo"),
                    escapeCSV("N/A"), // year field doesn't exist
                    escapeCSV(vehicle?.color || "N/A"),
                    escapeCSV(vehicle?.plate || "Sin placa"),
                    escapeCSV(vehicle?.chassis || "N/A"),
                    escapeCSV(vehicle?.engine || "N/A"),
                    escapeCSV(vehicle?.cc || "N/A"),
                    
                    // Loan Financial Details
                    escapeCSV(formatCurrency(loan.totalAmount)),
                    escapeCSV(formatCurrency(loan.downPayment)),
                    escapeCSV(formatCurrency(financedAmount)),
                    escapeCSV(formatPercentage(loan.interestRate)),
                    escapeCSV(getInterestTypeText(loan.interestType)),
                    escapeCSV(formatCurrency(loan.installmentPaymentAmmount)),
                    escapeCSV(formatCurrency(loan.gpsInstallmentPayment)),
                    
                    // Payment Status
                    escapeCSV(loan.installments),
                    escapeCSV(loan.paidInstallments),
                    escapeCSV(loan.remainingInstallments),
                    escapeCSV(formatCurrency(loan.totalPaid)),
                    escapeCSV(formatCurrency(loan.debtRemaining)),
                    escapeCSV(`${progress}%`),
                    
                    // Schedule Information
                    escapeCSV(getPaymentFrequencyText(loan.paymentFrequency || "DAILY")),
                    escapeCSV(startDate ? startDate.toLocaleDateString('es-CO') : "No establecida"),
                    escapeCSV(endDate ? endDate.toLocaleDateString('es-CO') : "No establecida"),
                    escapeCSV(daysElapsed > 0 ? `${daysElapsed} días` : "0 días"),
                    
                    // Status
                    escapeCSV(getStatusText(loan.status)),
                    escapeCSV(loan.archived ? "Sí" : "No"),
                    
                    // Metadata
                    escapeCSV(createdAt.toLocaleString('es-CO')),
                    escapeCSV(updatedAt.toLocaleString('es-CO')),
                ].join(",")
            }),
        ]

        // Add summary statistics at the end
        const totalLoans = filteredLoans.length
        const totalAmount = filteredLoans.reduce((sum, loan) => sum + loan.totalAmount, 0)
        const totalPaid = filteredLoans.reduce((sum, loan) => sum + loan.totalPaid, 0)
        const totalRemaining = filteredLoans.reduce((sum, loan) => sum + loan.debtRemaining, 0)
        const activeLoans = filteredLoans.filter(loan => loan.status === "ACTIVE").length
        const completedLoans = filteredLoans.filter(loan => loan.status === "COMPLETED").length

        csvRows.push("")
        csvRows.push("RESUMEN ESTADÍSTICO")
        csvRows.push(`Total de Préstamos,${totalLoans}`)
        csvRows.push(`Préstamos Activos,${activeLoans}`)
        csvRows.push(`Préstamos Completados,${completedLoans}`)
        csvRows.push(`Monto Total Prestado,${formatCurrency(totalAmount)}`)
        csvRows.push(`Total Recaudado,${formatCurrency(totalPaid)}`)
        csvRows.push(`Deuda Total Pendiente,${formatCurrency(totalRemaining)}`)
        csvRows.push(`Tasa de Recuperación,${totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0}%`)
        csvRows.push("")
        csvRows.push(`Generado el,${new Date().toLocaleString('es-CO')}`)

        const csvContent = "\uFEFF" + csvRows.join("\n") // Add BOM for proper UTF-8 encoding in Excel
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        const timestamp = new Date().toISOString().split('T')[0]
        const fileName = showArchived 
            ? `arrendamientos-archivados-${timestamp}.csv` 
            : `arrendamientos-${timestamp}.csv`
        link.setAttribute("href", url)
        link.setAttribute("download", fileName)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
            title: "Exportación exitosa",
            description: `Se exportaron ${totalLoans} préstamos al archivo CSV`,
        })
    }

    return {
        // State
        loans,
        loading,
        searchTerm,
        currentPage,
        itemsPerPage,
        printingContract,
        printProgress,
        deleteDialogOpen,
        archiveDialogOpen,
        loanToDelete,
        loanToArchive,
        showArchived,
        filteredLoans,
        totalItems,
        totalPages,
        startIndex,
        endIndex,
        currentItems,

        // Actions
        setSearchTerm,
        setCurrentPage,
        setItemsPerPage,
        setPrintingContract,
        setDeleteDialogOpen,
        setArchiveDialogOpen,
        setShowArchived,
        handleDelete,
        handleArchive,
        confirmDelete,
        confirmArchive,
        handlePrintContract,
        refreshData,
        exportToCSV,
    }
}
