"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import { Loan, Vehicle, User } from "@/lib/types"

const loanSchema = z.object({
    userId: z.string().min(1, { message: "Por favor, selecciona un cliente." }),
    vehicleId: z.string().min(1, { message: "Por favor, selecciona un vehículo." }),
    totalAmount: z.coerce.number().min(1, { message: "El precio total debe ser mayor a cero." }),
    downPayment: z.coerce.number().min(0, { message: "El pago inicial no puede ser negativo." }),
    startDate: z.string().optional(),
    endDate: z.string().nullable().optional(),
    loanTermMonths: z.coerce.number().min(1, { message: "El plazo del contrato debe ser al menos 1 mes." }),
    interestRate: z.coerce.number().min(0, { message: "La tasa de interés no puede ser negativa." }),
    interestType: z.enum(["FIXED", "COMPOUND"]),
    paymentFrequency: z.enum(["DAILY", "MONTHLY", "BIWEEKLY", "WEEKLY"]),
    installmentPaymentAmmount: z.coerce.number().optional(),
    gpsAmount: z.coerce.number().min(0, { message: "El monto de GPS no puede ser negativo." }).optional(),
})

type LoanFormValues = z.infer<typeof loanSchema>

interface UseLoanFormProps {
    loanId?: string
    loanData?: Loan
    onSaved?: (updatedLoan?: Loan) => void
}

// Helper functions
// Use exactly 30 days per month for all calculations
const DAYS_PER_MONTH = 30

const getInstallmentsFromMonths = (months: number, frequency: string, startDate?: string): number => {
    // Always use exactly 30 days per month, regardless of start date
    // Example: 18 months = 540 installments (18 * 30)
    switch (frequency) {
        case "DAILY":
            return months * DAYS_PER_MONTH
        case "WEEKLY":
            return Math.round((months * DAYS_PER_MONTH) / 7) // 30 days / 7 = ~4.29 weeks per month
        case "BIWEEKLY":
            return Math.round((months * DAYS_PER_MONTH) / 14) // 30 days / 14 = ~2.14 bi-weeks per month
        case "MONTHLY":
        default:
            return months
    }
}

const calculateInstallmentsFromDates = (startDate: string, endDate: string, frequency: string): number => {
    if (!startDate || !endDate) return 0
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start >= end) return 0
    
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    switch (frequency) {
        case "DAILY":
            // Count all days (including Sundays) - no exclusions
            return Math.max(1, diffDays)
        case "WEEKLY":
            return Math.ceil(diffDays / 7)
        case "BIWEEKLY":
            return Math.ceil(diffDays / 14)
        case "MONTHLY":
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
            return Math.max(1, months)
        default:
            return 0
    }
}

const calculateMonthsFromDates = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start >= end) return 0
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    const dayDiff = end.getDate() - start.getDate()
    
    // Add fraction of month if there are extra days
    return Math.max(1, Math.round(months + (dayDiff / 30)))
}

const getFrequencyText = (frequency: string): string => {
    switch (frequency) {
        case "DAILY":
            return "diarios"
        case "WEEKLY":
            return "semanales"
        case "BIWEEKLY":
            return "quincenales"
        case "MONTHLY":
        default:
            return "mensuales"
    }
}

const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === undefined) {
        return "COP 0"
    }
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(amount)
}

const formatNumber = (value: number | string | undefined): string => {
    if (value === undefined || value === null || value === "") return ""
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value
    if (isNaN(numValue)) return ""
    return numValue.toLocaleString("es-CO").replace(/,/g, ".")
}

const parseFormattedNumber = (value: string): number => {
    if (!value) return 0
    const cleanValue = value.replace(/[^\d,.-]/g, "").replace(/\./g, "")
    return Number.parseFloat(cleanValue) || 0
}

export function useLoanForm({ loanId, loanData, onSaved }: UseLoanFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [availableUsers, setAvailableUsers] = useState<User[]>([])
    const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([])
    const [loadingData, setLoadingData] = useState(false)
    const [loanSummary, setLoanSummary] = useState<any>(null)
    const { toast } = useToast()
    const dataLoaded = useRef(false)
    const isMounted = useRef(false)
    const calculationInProgress = useRef(false)
    const initialLoadComplete = useRef(false) // Flag to track when initial data is loaded

    const form = useForm<LoanFormValues>({
        resolver: zodResolver(loanSchema),
        defaultValues: {
            userId: "",
            vehicleId: "",
            totalAmount: 4000000,
            downPayment: 0,
            startDate: new Date().toISOString().split('T')[0],
            endDate: null,
            loanTermMonths: 18,
            interestRate: 0,
            interestType: "FIXED",
            paymentFrequency: "DAILY",
            installmentPaymentAmmount: 32000,
            gpsAmount: 2000,
        },
    })

    const formValues = form.watch()

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    const calculateLoanSummary = (values: LoanFormValues) => {
        if (calculationInProgress.current) return
        calculationInProgress.current = true
        try {
            const totalAmount = Number(values.totalAmount) || 0
            const downPayment = Number(values.downPayment) || 0
            const loanTermMonths = Number(values.loanTermMonths) || 1
            const interestRate = Number(values.interestRate) || 0
            const installmentPaymentAmmount = Number(values.installmentPaymentAmmount) || 32000
            const gpsAmount = Number(values.gpsAmount) || 0

            if (totalAmount <= 0 || loanTermMonths <= 0) {
                return
            }

            const financedAmount = totalAmount - downPayment
            let totalWithInterest: number
            let paymentAmount: number
            let totalPaymentWithGps: number

            // Calculate installments based on dates if available, otherwise use loanTermMonths
            let totalInstallments: number
            if (values.startDate && values.endDate) {
                totalInstallments = calculateInstallmentsFromDates(
                    values.startDate,
                    values.endDate,
                    values.paymentFrequency
                )
            } else {
                totalInstallments = getInstallmentsFromMonths(loanTermMonths, values.paymentFrequency, values.startDate)
            }

            if (values.interestType === "FIXED") {
                const interestAmount = financedAmount * (interestRate / 100) * (loanTermMonths / 12)
                totalWithInterest = financedAmount + interestAmount
            } else {
                const monthlyRate = interestRate / 100 / 12
                totalWithInterest = financedAmount * Math.pow(1 + monthlyRate, loanTermMonths)
            }

            if (values.paymentFrequency === "DAILY") {
                paymentAmount = installmentPaymentAmmount
                totalPaymentWithGps = paymentAmount + gpsAmount
                const daysToPayOff = Math.ceil(totalWithInterest / paymentAmount)
                
                // Calculate installments covered by downpayment using TOTAL daily rate (base + GPS)
                // This matches the table calculation: downPayment / (installmentPaymentAmmount + gpsInstallmentPayment)
                const downPaymentInstallments = downPayment > 0 && totalPaymentWithGps > 0 
                    ? Math.floor(downPayment / totalPaymentWithGps) 
                    : 0
                
                if (isMounted.current) {
                    setLoanSummary({
                        financedAmount,
                        totalWithInterest,
                        paymentAmount,
                        gpsAmount,
                        totalPaymentWithGps,
                        totalInstallments,
                        downPaymentInstallments,
                        daysToPayOff,
                        totalInterest: totalWithInterest - financedAmount,
                    })
                }
            } else {
                paymentAmount = totalWithInterest / totalInstallments
                totalPaymentWithGps = paymentAmount + gpsAmount
                
                // Calculate installments covered by downpayment using TOTAL payment (base + GPS)
                const downPaymentInstallments = downPayment > 0 && totalPaymentWithGps > 0 
                    ? Math.floor(downPayment / totalPaymentWithGps) 
                    : 0
                
                if (isMounted.current) {
                    setLoanSummary({
                        financedAmount,
                        totalWithInterest,
                        paymentAmount,
                        gpsAmount,
                        totalPaymentWithGps,
                        totalInstallments,
                        downPaymentInstallments,
                        totalInterest: totalWithInterest - financedAmount,
                    })
                }
            }
        } catch (error) {
            console.error("Error calculating loan summary:", error)
        } finally {
            calculationInProgress.current = false
        }
    }

    // Calculate end date helper function - adds months directly
    const calculateEndDateFromStart = (startDateStr: string, paymentFreq: string, termMonths: number): string => {
        const start = new Date(startDateStr)
        let calculatedEndDate: Date

        // For all frequencies, calculate based on the term in months
        // This provides a consistent end date regardless of payment frequency
        calculatedEndDate = new Date(start)
        calculatedEndDate.setMonth(calculatedEndDate.getMonth() + termMonths)

        return calculatedEndDate.toISOString().split('T')[0]
    }

    const watchedValues = useWatch({
        control: form.control,
        name: [
            "totalAmount",
            "downPayment",
            "startDate",
            "endDate",
            "loanTermMonths",
            "interestRate",
            "interestType",
            "paymentFrequency",
            "installmentPaymentAmmount",
            "gpsAmount",
        ],
    })

    useEffect(() => {
        if (isOpen && isMounted.current) {
            const values = form.getValues()
            calculateLoanSummary(values)
        }
    }, [watchedValues, isOpen])

    // Auto-calculate total amount based on daily payment and loan term
    useEffect(() => {
        if (!isOpen || !isMounted.current) return

        // Destructure watchedValues array (in the same order as defined in useWatch)
        const [
            totalAmount,
            downPayment,
            startDate,
            endDate,
            loanTermMonths,
            interestRate,
            interestType,
            paymentFrequency,
            installmentPaymentAmmount,
            gpsAmount,
        ] = watchedValues

        // Only auto-calculate if we have valid payment amount and months
        if (!installmentPaymentAmmount || !loanTermMonths || loanTermMonths <= 0) return

        // Calculate total installments based on frequency
        const totalInstallments = getInstallmentsFromMonths(loanTermMonths, paymentFrequency)
        
        // Calculate total with interest (what customer will pay in installments)
        const paymentWithoutGps = installmentPaymentAmmount - (gpsAmount || 0)
        const totalWithInterest = paymentWithoutGps * totalInstallments

        // Remove interest to get financed amount
        let financedAmount = totalWithInterest
        if (interestRate && interestRate > 0) {
            if (interestType === "FIXED") {
                // For fixed interest: totalWithInterest = financedAmount * (1 + rate/100)
                financedAmount = totalWithInterest / (1 + interestRate / 100)
            } else {
                // For compound interest: totalWithInterest = financedAmount * (1 + rate/100)^months
                financedAmount = totalWithInterest / Math.pow(1 + interestRate / 100, loanTermMonths)
            }
        }

        // The financed amount represents what the customer will finance through installments
        // The total amount is just the financed amount (downpayment is separate and already paid)
        // Customer pays: downPayment upfront + financedAmount in installments with interest
        const calculatedTotal = Math.round(financedAmount)

        // Only update if the value has actually changed (prevent infinite loop)
        if (calculatedTotal !== totalAmount) {
            form.setValue("totalAmount", calculatedTotal, { shouldValidate: false })
        }
    }, [watchedValues, isOpen])

    // Auto-calculate end date when start date or loan term changes
    useEffect(() => {
        if (!isOpen || !isMounted.current) return
        
        // Skip auto-calculation during initial load when editing
        if (loanData && !initialLoadComplete.current) return

        const [
            totalAmount,
            downPayment,
            startDate,
            endDate,
            loanTermMonths,
            interestRate,
            interestType,
            paymentFrequency,
            installmentPaymentAmmount,
            gpsAmount,
        ] = watchedValues

        // Auto-calculate end date if we have start date and loan term
        // Only skip if endDate is explicitly null (user cleared it manually)
        if (startDate && loanTermMonths && loanTermMonths > 0 && endDate !== null) {
            const calculatedEndDate = calculateEndDateFromStart(startDate, paymentFrequency, loanTermMonths)
            // Only update if the calculated date is different from current value
            if (calculatedEndDate !== endDate) {
                form.setValue("endDate", calculatedEndDate, { shouldValidate: false })
            }
        }
    }, [watchedValues, isOpen, loanData])

    const filterAvailableOptions = async (allUsers: User[], allVehicles: Vehicle[]) => {
        try {
            const token = document.cookie
                .split("; ")
                .find((c) => c.startsWith("authToken="))
                ?.split("=")[1]

            // Fetch existing active loans
            const loansResponse = await HttpService.get<Loan[]>("/api/v1/loans", {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            })

            // Match backend rule: any non-archived, non-completed loan blocks reassignment
            const blockingLoans = loansResponse.data.filter(
                (loan) => !loan.archived && loan.status !== "COMPLETED"
            )

            // Get IDs of users and vehicles that are already assigned to active loans
            const assignedUserIds = new Set(blockingLoans.map((loan) => loan.userId))
            const assignedVehicleIds = new Set(blockingLoans.map((loan) => loan.vehicleId))

            // If we're editing a loan, allow the current user and vehicle to be available
            if (loanData) {
                assignedUserIds.delete(loanData.userId)
                assignedVehicleIds.delete(loanData.vehicleId)
            }

            // Filter out assigned users and vehicles
            const filteredUsers = allUsers.filter((user) => !assignedUserIds.has(user.id))
            const filteredVehicles = allVehicles.filter((vehicle) => !assignedVehicleIds.has(vehicle.id))

            console.log("Blocking loans count:", blockingLoans.length)
            console.log("Assigned user IDs:", Array.from(assignedUserIds))
            console.log("Available users:", filteredUsers.length, "of", allUsers.length)
            console.log("Available vehicles:", filteredVehicles.length, "of", allVehicles.length)

            setAvailableUsers(filteredUsers)
            setAvailableVehicles(filteredVehicles)
        } catch (error) {
            console.error("Error filtering available options:", error)
            // On error, still filter but don't fetch loans - safer to show all options
            toast({
                variant: "destructive",
                title: "Advertencia",
                description: "No se pudo verificar disponibilidad. Se muestran todos los usuarios y vehículos.",
            })
            setAvailableUsers(allUsers)
            setAvailableVehicles(allVehicles)
        }
    }

    const loadInitialData = async () => {
        if (dataLoaded.current || !isMounted.current) return
        setLoadingData(true)
        try {
            const token = document.cookie
                .split("; ")
                .find((c) => c.startsWith("authToken="))
                ?.split("=")[1]

            const [userRes, vehicleRes] = await Promise.all([
                HttpService.get<User[]>("/api/v1/users", { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
                // Fetch a larger page to include vehicles beyond the default limit (50)
                HttpService.get<{ data: Vehicle[]; pagination: any }>("/api/v1/vehicles?page=1&limit=1000", {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                }),
            ])

            const users = userRes.data
            const vehicles = vehicleRes.data.data || []

            setUsers(users)
            setVehicles(vehicles)

            // Filter available options based on existing loans
            await filterAvailableOptions(users, vehicles)

            if (loanData) {
                // Calculate loanTermMonths from start and end dates if available
                let loanTermMonths = loanData.installments
                
                if (loanData.startDate && loanData.endDate) {
                    // Calculate exact months between start and end dates
                    const start = new Date(loanData.startDate)
                    const end = new Date(loanData.endDate)
                    const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
                    loanTermMonths = Math.max(1, monthsDiff)
                } else if (loanData.paymentFrequency === "DAILY") {
                    // Fallback: use more accurate conversion (30.44 days per month)
                    loanTermMonths = Math.round(loanData.installments / 30.44)
                } else if (loanData.paymentFrequency === "WEEKLY") {
                    loanTermMonths = Math.round(loanData.installments / 4.33)
                } else if (loanData.paymentFrequency === "BIWEEKLY") {
                    loanTermMonths = Math.round(loanData.installments / 2.17)
                }

                // Split installmentPaymentAmmount into payment and GPS if needed
                let installmentPayment = loanData.installmentPaymentAmmount ?? 32000
                let gpsAmount = loanData.gpsInstallmentPayment ?? 2000

                // If there's no GPS amount but we have a total payment, assume default split
                if (loanData.installmentPaymentAmmount && !loanData.gpsInstallmentPayment) {
                    installmentPayment = Math.max(0, loanData.installmentPaymentAmmount - 2000)
                    gpsAmount = 2000
                }

                form.reset({
                    userId: loanData.userId,
                    vehicleId: loanData.vehicleId,
                    totalAmount: loanData.totalAmount,
                    downPayment: loanData.downPayment ?? 0,
                    startDate: loanData.startDate ? new Date(loanData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    endDate: loanData.endDate ? new Date(loanData.endDate).toISOString().split('T')[0] : "",
                    loanTermMonths: loanTermMonths,
                    interestRate: 0,
                    interestType: "FIXED",
                    paymentFrequency: loanData.paymentFrequency ?? "DAILY",
                    installmentPaymentAmmount: installmentPayment,
                    gpsAmount: gpsAmount,
                })
                
                // Mark initial load as complete after a small delay to let the form settle
                setTimeout(() => {
                    initialLoadComplete.current = true
                }, 100)
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los datos" })
        } finally {
            setLoadingData(false)
            dataLoaded.current = true
        }
    }

    const handleVehicleChange = (vehicleId: string) => {
        const selected = vehicles.find((v) => v.id === vehicleId)
        if (selected) form.setValue("totalAmount", selected.price || 0)
    }

    const onSubmit = async (values: LoanFormValues) => {
        try {
            setLoading(true)
            const token = document.cookie
                .split("; ")
                .find((c) => c.startsWith("authToken="))
                ?.split("=")[1]

            // Calculate end date if not provided
            let endDateToUse = values.endDate
            if (values.startDate && !endDateToUse) {
                endDateToUse = calculateEndDateFromStart(
                    values.startDate,
                    values.paymentFrequency,
                    values.loanTermMonths
                )
            }

            // Always calculate installments using the 30-days-per-month rule
            // This ensures consistency: 18 months = 540 installments (18 × 30)
            // Don't use calculateInstallmentsFromDates as it counts actual calendar days
            const totalInstallments = getInstallmentsFromMonths(values.loanTermMonths, values.paymentFrequency)

            const submissionValues: any = {
                ...values,
                totalAmount: Number(values.totalAmount) || 0,
                downPayment: Number(values.downPayment) || 0,
                installments: totalInstallments,
                interestRate: Number(values.interestRate) || 0,
                installmentPaymentAmmount: Number(values.installmentPaymentAmmount) || 32000,
                gpsInstallmentPayment: Number(values.gpsAmount) || 0,
            }

            // Add dates if provided (append time to avoid timezone conversion)
            if (values.startDate) {
                submissionValues.startDate = new Date(`${values.startDate}T00:00:00`).toISOString()
            }
            if (endDateToUse && endDateToUse !== "" && endDateToUse !== null) {
                submissionValues.endDate = new Date(`${endDateToUse}T00:00:00`).toISOString()
            } else {
                submissionValues.endDate = null
            }

            // Remove fields that are not part of the API
            delete submissionValues.loanTermMonths
            delete submissionValues.gpsAmount

            let response
            if (loanId) {
                response = await HttpService.patch(`/api/v1/loans/${loanId}`, submissionValues, {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                })
            } else {
                response = await HttpService.post("/api/v1/loans", submissionValues, {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                })
            }

            toast({ title: loanId ? "contrato actualizado" : "contrato creado", description: "Operación exitosa" })
            setIsOpen(false)
            onSaved?.(response.data)
        } catch (error) {
            console.error("Error al guardar contrato:", error)
            toast({ variant: "destructive", title: "Error", description: "No se pudo guardar el contrato" })
        } finally {
            setLoading(false)
        }
    }

    const handleOpenDialog = () => {
        setIsOpen(true)
        if (!dataLoaded.current) loadInitialData()
    }

    const handleCloseDialog = () => {
        setIsOpen(false)
        setLoanSummary(null)
        initialLoadComplete.current = false // Reset for next open
    }

    return {
        // State
        isOpen,
        loading,
        loadingData,
        availableUsers,
        availableVehicles,
        loanSummary,
        form,
        formValues,

        // Actions
        handleOpenDialog,
        handleCloseDialog,
        handleVehicleChange,
        onSubmit,

        // Utilities
        formatCurrency,
        formatNumber,
        parseFormattedNumber,
        getFrequencyText,
    }
}
