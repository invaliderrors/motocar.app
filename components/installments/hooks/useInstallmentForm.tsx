"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loan as BaseLoan, Installment } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import { useAuth } from "@/hooks/useAuth"
import { uploadImageToCloudinary } from "@/lib/services/cloudinary"
import { NewsService } from "@/lib/services/news.service"
import { utcToZonedTime } from "date-fns-tz"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const COLOMBIA_TZ = "America/Bogota"

// Payment coverage response type from API
interface PaymentCoverageResponse {
    loanId: string
    dailyRate: number
    loanStartDate: string
    lastCoveredDate: string
    paymentAmount: number
    daysCovered: number
    coverageStartDate: string
    coverageEndDate: string
    isLate: boolean
    latePaymentDate: string | null
    daysBehind: number
    amountNeededToCatchUp: number
    willBeCurrentAfterPayment: boolean
    daysAheadAfterPayment: number
    skippedDatesCount: number
    skippedDates: string[]
}

const installmentSchema = z.object({
    loanId: z.string({ required_error: "Debe seleccionar un contrato" }),
    amount: z.coerce.number().min(1, { message: "El monto debe ser mayor a 0" }),
    gps: z.coerce.number(),
    paymentMethod: z.enum(["CASH", "CARD", "TRANSACTION"], {
        required_error: "Debe seleccionar un método de pago",
    }),
    dueDate: z.date().optional().nullable(),
    paymentDate: z.date().optional(),
    notes: z.string().optional(),
    attachmentUrl: z.string().optional(),
    createdById: z.string().optional(),
})

type InstallmentFormValues = z.infer<typeof installmentSchema>

export type EnrichedLoan = BaseLoan & {
    user: { name: string; identification?: string }
    vehicle: { model: string; plate?: string }
    motorcycle?: { model: string; plate?: string } // Legacy support
    payments: Installment[]
    monthlyPayment: number
    financedAmount: number
    totalCapitalPaid: number
    nextInstallmentNumber: number
}

interface UseInstallmentFormProps {
    loanId?: string
    installment?: any
    onSaved?: () => void
}

export function useInstallmentForm({ loanId, installment, onSaved }: UseInstallmentFormProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loans, setLoans] = useState<EnrichedLoan[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [selectedLoan, setSelectedLoan] = useState<EnrichedLoan | null>(null)
    const [paymentBreakdown, setPaymentBreakdown] = useState<{
        principalAmount: number
        interestAmount: number
        totalAmount: number
    } | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState<string | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [lastInstallmentInfo, setLastInstallmentInfo] = useState<{
        lastPaymentDate: Date | null
        daysSinceLastPayment: number | null
    } | null>(null)
    const [paymentCoverage, setPaymentCoverage] = useState<PaymentCoverageResponse | null>(null)
    const [loadingCoverage, setLoadingCoverage] = useState(false)
    const [loanNews, setLoanNews] = useState<any[]>([])
    const [loadingNews, setLoadingNews] = useState(false)

    const { toast } = useToast()
    const { user } = useAuth()

    const form = useForm<InstallmentFormValues>({
        resolver: zodResolver(installmentSchema),
        defaultValues: {
            loanId: loanId || "",
            amount: 0,
            gps: 0,
            dueDate: null,
            paymentDate: new Date(),
            notes: "",
            attachmentUrl: "",
            createdById: user?.id,
        },
    })

    const amount = form.watch("amount")
    const gps = form.watch("gps")
    const paymentMethod = form.watch("paymentMethod")

    // Helper function to calculate GPS portion from total amount based on loan rates
    const calculateGpsFromTotal = useCallback((loan: EnrichedLoan, totalAmount: number) => {
        const baseRate = loan.monthlyPayment || loan.installmentPaymentAmmount || 0
        const gpsRate = loan.gpsInstallmentPayment || 0
        const totalRate = baseRate + gpsRate
        
        if (totalRate === 0 || gpsRate === 0) return { base: totalAmount, gps: 0 }
        
        // Calculate GPS proportionally
        const gpsRatio = gpsRate / totalRate
        const gpsAmount = Math.round(totalAmount * gpsRatio)
        const baseAmount = totalAmount - gpsAmount
        
        return { base: baseAmount, gps: gpsAmount }
    }, [])

    // Auto-calculate GPS when amount changes (only for NEW installments, not when editing)
    useEffect(() => {
        if (!isEditing && selectedLoan && amount > 0) {
            const { gps: calculatedGps } = calculateGpsFromTotal(selectedLoan, amount)
            form.setValue("gps", calculatedGps)
        }
    }, [selectedLoan, amount, calculateGpsFromTotal, form, isEditing])

    // Load installment data for editing
    useEffect(() => {
        if (installment) {
            setIsEditing(true)
            form.setValue("loanId", installment.loanId)
            // The form uses TOTAL amount (base + GPS), but installment stores them separately
            // So we need to combine them when loading for editing
            const totalAmount = (installment.amount || 0) + (installment.gps || 0)
            form.setValue("amount", totalAmount)
            form.setValue("gps", installment.gps || 0)
            form.setValue("paymentMethod", installment.paymentMethod || "CASH")
            form.setValue("notes", installment.notes || "")
            form.setValue("attachmentUrl", installment.attachmentUrl || "")
            form.setValue("createdById", installment.createdById || user?.id)

            // Use the loan data from the installment if available
            if (installment.loan) {
                // Calculate derived fields that components expect
                const totalAmount = installment.loan.totalAmount || 0
                const downPayment = installment.loan.downPayment || 0
                const financedAmount = totalAmount - downPayment
                const totalPaid = installment.loan.totalPaid || 0
                const baseDailyRate = installment.loan.installmentPaymentAmmount || 0
                const gpsDailyRate = installment.loan.gpsInstallmentPayment || 0
                const totalDailyRate = baseDailyRate + gpsDailyRate

                const loanFromInstallment = {
                    id: installment.loanId,
                    user: installment.loan.user || { name: "Cliente" },
                    vehicle: installment.loan.vehicle || installment.loan.motorcycle || { model: "", plate: "" },
                    motorcycle: installment.loan.motorcycle,
                    debtRemaining: installment.loan.debtRemaining || 0,
                    interestRate: installment.loan.interestRate || 0,
                    interestType: installment.loan.interestType || "FIXED",
                    installments: installment.loan.installments || 0,
                    // Map to expected field names
                    financedAmount: financedAmount,
                    totalCapitalPaid: totalPaid,
                    nextInstallmentNumber: installment.loan.paidInstallments || 0,
                    payments: installment.loan.payments || [],
                    monthlyPayment: totalDailyRate, // Total daily rate (base + GPS)
                    userId: installment.loan.userId || "",
                    contractNumber: installment.loan.contractNumber || "",
                    vehicleId: installment.loan.vehicleId || "",
                    totalAmount: totalAmount,
                    downPayment: downPayment,
                    startDate: installment.loan.startDate ? new Date(installment.loan.startDate) : new Date(),
                    endDate: installment.loan.endDate ? new Date(installment.loan.endDate) : new Date(),
                    status: installment.loan.status || "ACTIVE",
                    paymentFrequency: installment.loan.paymentFrequency || "DAILY",
                    paidInstallments: installment.loan.paidInstallments || 0,
                    totalPaid: totalPaid,
                    createdAt: installment.loan.createdAt ? new Date(installment.loan.createdAt) : new Date(),
                    updatedAt: installment.loan.updatedAt ? new Date(installment.loan.updatedAt) : new Date(),
                    installmentPaymentAmmount: baseDailyRate,
                    gpsInstallmentPayment: gpsDailyRate,
                } as unknown as EnrichedLoan
                setSelectedLoan(loanFromInstallment)
            }

            // Load dueDate from either new dueDate field or legacy latePaymentDate
            // Parse dates preserving the calendar date (not affected by timezone)
            if (installment.dueDate) {
                const dueDateStr = installment.dueDate.split('T')[0]
                const [year, month, day] = dueDateStr.split('-').map(Number)
                form.setValue("dueDate", new Date(year, month - 1, day))
            } else if (installment.latePaymentDate) {
                const lateDateStr = installment.latePaymentDate.split('T')[0]
                const [year, month, day] = lateDateStr.split('-').map(Number)
                form.setValue("dueDate", new Date(year, month - 1, day))
            }
            
            if (installment.paymentDate) {
                // Parse payment date preserving the calendar date
                const paymentDateStr = installment.paymentDate.split('T')[0]
                const [year, month, day] = paymentDateStr.split('-').map(Number)
                form.setValue("paymentDate", new Date(year, month - 1, day))
            }
            if (installment.attachmentUrl) {
                setFilePreview(installment.attachmentUrl)
            }
        } else {
            setIsEditing(false)
            form.setValue("paymentDate", new Date())
            form.setValue("createdById", user?.id)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [installment, form, user])

    // Fetch payment coverage from API
    const fetchPaymentCoverage = useCallback(async (loanId: string, paymentAmount: number, excludeInstallmentId?: string) => {
        if (!loanId || paymentAmount <= 0) {
            setPaymentCoverage(null)
            return
        }

        try {
            setLoadingCoverage(true)
            const response = await HttpService.post<PaymentCoverageResponse>(
                "/api/v1/installments/calculate-coverage",
                { 
                    loanId, 
                    amount: paymentAmount,
                    // When editing, exclude this installment from coverage calculation
                    ...(excludeInstallmentId ? { excludeInstallmentId } : {})
                }
            )
            setPaymentCoverage(response.data)
            
            // Auto-set the dueDate based on coverage calculation (only for new installments)
            if (!isEditing && response.data.isLate && response.data.latePaymentDate) {
                form.setValue("dueDate", new Date(response.data.latePaymentDate))
            } else if (!isEditing && !response.data.isLate) {
                // Payment is on time or ahead, clear the due date
                form.setValue("dueDate", null)
            }
        } catch (error) {
            console.error("Error calculating payment coverage:", error)
            setPaymentCoverage(null)
        } finally {
            setLoadingCoverage(false)
        }
    }, [isEditing, form])

    // Fetch all news for the selected loan (past, present, and future)
    useEffect(() => {
        if (!selectedLoan?.id) {
            setLoanNews([])
            return
        }

        const fetchNews = async () => {
            try {
                setLoadingNews(true)
                const news = await NewsService.getAllLoanNews(selectedLoan.id)
                setLoanNews(news)
            } catch (error) {
                console.error("Error fetching loan news:", error)
                setLoanNews([])
            } finally {
                setLoadingNews(false)
            }
        }

        fetchNews()
    }, [selectedLoan?.id])

    // Debounced effect to fetch payment coverage when amount or loan changes
    useEffect(() => {
        if (!selectedLoan || amount <= 0) {
            setPaymentCoverage(null)
            return
        }

        const timeoutId = setTimeout(() => {
            // When editing, pass the installment ID to exclude it from coverage calculation
            fetchPaymentCoverage(selectedLoan.id, amount, isEditing ? installment?.id : undefined)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [selectedLoan?.id, amount, fetchPaymentCoverage, isEditing, installment?.id])

    // Calculate payment breakdown
    useEffect(() => {
        if (selectedLoan && amount > 0) {
            // Calculate base and GPS from total amount
            const { base, gps: calculatedGps } = calculateGpsFromTotal(selectedLoan, amount)
            calculatePaymentBreakdown(selectedLoan, base, calculatedGps)
        }
    }, [selectedLoan, amount, calculateGpsFromTotal])

    // Load loans when dialog opens
    useEffect(() => {
        if (open) loadLoans()
    }, [open])

    const calculatePaymentBreakdown = (loan: EnrichedLoan, paymentAmount: number, gpsAmount: number) => {
        const paymentAmountNum = Number(paymentAmount) || 0
        const gpsAmountNum = Number(gpsAmount) || 0
        const interestRate = Number(loan.interestRate) || 0
        const installments = Number(loan.installments) || 1
        const financedAmount = Number(loan.financedAmount) || 0
        const remainingPrincipal = Number(loan.debtRemaining) || 0
        
        const monthlyRate = interestRate / 100 / 12
        
        const interestAmount =
            loan.interestType === "FIXED"
                ? Math.min(
                    paymentAmountNum,
                    (financedAmount * (interestRate / 100) * (installments / 12)) / installments,
                )
                : Math.min(paymentAmountNum, remainingPrincipal * monthlyRate)

        const principalAmount = Math.max(0, paymentAmountNum - interestAmount)
        const totalAmount = paymentAmountNum + gpsAmountNum

        setPaymentBreakdown({ principalAmount, interestAmount, totalAmount })

        // Calculate last installment info
        if (loan.payments && loan.payments.length > 0) {
            // Sort payments by the actual payment date to get the most recent one
            const sortedPayments = [...loan.payments].sort(
                (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
            )
            const lastPayment = sortedPayments[0]
            
            // For late payments, calculate days since the DUE date (latePaymentDate)
            // For on-time payments, calculate days since the payment date
            const relevantDate = lastPayment.isLate && lastPayment.latePaymentDate 
                ? new Date(lastPayment.latePaymentDate)  // Due date (how late it was)
                : new Date(lastPayment.paymentDate)      // Payment date (on-time)
            
            // Convert dates to Colombian time
            const today = utcToZonedTime(new Date(), COLOMBIA_TZ)
            const relevantDateColombian = utcToZonedTime(relevantDate, COLOMBIA_TZ)

            // Set time to start of day for accurate day comparison
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            const relevantDateStart = new Date(
                relevantDateColombian.getFullYear(),
                relevantDateColombian.getMonth(),
                relevantDateColombian.getDate(),
            )

            // Calculate days since the relevant date
            const daysSinceLastPayment = Math.floor(
                (todayStart.getTime() - relevantDateStart.getTime()) / (1000 * 60 * 60 * 24),
            )

            setLastInstallmentInfo({
                lastPaymentDate: relevantDate,
                daysSinceLastPayment,
            })
        } else {
            // No payments yet - calculate days since loan start
            const startDate = new Date(loan.startDate)
            const today = utcToZonedTime(new Date(), COLOMBIA_TZ)
            const startDateColombian = utcToZonedTime(startDate, COLOMBIA_TZ)
            
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            const startDateStart = new Date(startDateColombian.getFullYear(), startDateColombian.getMonth(), startDateColombian.getDate())

            const daysSinceStart = Math.floor((todayStart.getTime() - startDateStart.getTime()) / (1000 * 60 * 60 * 24))

            setLastInstallmentInfo({
                lastPaymentDate: null,
                daysSinceLastPayment: daysSinceStart,
            })
        }
    }

    const loadLoans = async () => {
        try {
            const token = document.cookie
                .split("; ")
                .find((c) => c.startsWith("authToken="))
                ?.split("=")[1]
            const res = await HttpService.get<any[]>("/api/v1/loans", {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            })
            const rawData = res.data
            
            // Debug: Log all loans and their archived status
            console.log('📦 All loans from API:', rawData.map(loan => ({
                id: loan.id,
                contractNumber: loan.contractNumber,
                userName: loan.user?.name,
                plate: loan.vehicle?.plate,
                archived: loan.archived,
                status: loan.status
            })))
            
            const mappedLoans: EnrichedLoan[] = rawData
                .filter((loan) => {
                    const shouldInclude = !loan.archived && loan.status !== "ARCHIVED"
                    console.log(`🔍 Loan ${loan.contractNumber} (${loan.user?.name}): archived=${loan.archived}, status=${loan.status}, include=${shouldInclude}`)
                    return shouldInclude
                })
                .map((loan) => {
                    const financedAmount = loan.totalAmount - loan.downPayment
                    // Use the installmentPaymentAmmount directly - it's already the correct amount per installment
                    const monthlyPayment = loan.installmentPaymentAmmount || 0
                    return {
                        ...loan,
                        userName: loan.user?.name ?? "Sin nombre",
                        vehicleModel: loan.vehicle?.model ?? loan.motorcycle?.model ?? "Sin modelo",
                        vehiclePlate: loan.vehicle?.plate ?? loan.motorcycle?.plate ?? "Sin placa",
                        // Keep legacy fields for backwards compatibility
                        motorcycleModel: loan.vehicle?.model ?? loan.motorcycle?.model ?? "Sin modelo",
                        motorcyclePlate: loan.vehicle?.plate ?? loan.motorcycle?.plate ?? "Sin placa",
                        monthlyPayment,
                        financedAmount,
                        totalCapitalPaid: loan.totalPaid || 0,
                        nextInstallmentNumber: (loan.paidInstallments || 0) + 1,
                        payments: loan.payments || [],
                    }
                })
            
            // Deduplicate loans by ID (in case the API returns duplicates)
            const uniqueLoans = Array.from(
                new Map(mappedLoans.map(loan => [loan.id, loan])).values()
            )
            
            console.log(`✅ Filtered loans count: ${mappedLoans.length}, Unique loans: ${uniqueLoans.length}`)
            console.log('Unique loans:', uniqueLoans.map(l => ({
                id: l.id,
                contractNumber: l.contractNumber,
                userName: l.user?.name,
                plate: l.vehicle?.plate || l.motorcycle?.plate,
                archived: l.archived,
                status: l.status
            })))
            
            setLoans(uniqueLoans)
            if (loanId) {
                const loan = uniqueLoans.find((l) => l.id === loanId)
                if (loan) {
                    setSelectedLoan(loan)
                    form.setValue("loanId", loanId)
                    // Set total amount (base + GPS combined)
                    const baseAmount = loan.monthlyPayment || loan.installmentPaymentAmmount || 0
                    const gpsAmount = loan.gpsInstallmentPayment || 0
                    const totalAmount = baseAmount + gpsAmount
                    form.setValue("amount", totalAmount)
                    // GPS will be auto-calculated by the useEffect
                    calculatePaymentBreakdown(loan, baseAmount, gpsAmount)
                }
            }
            setLoadingData(false)
        } catch (err) {
            console.error("Error al cargar contratos:", err)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron cargar los contratos",
            })
        }
    }

    const handleLoanChange = (loanId: string) => {
        const loan = loans.find((l) => l.id === loanId)
        if (loan) {
            setSelectedLoan(loan)
            // Set total amount (base + GPS combined)
            const baseAmount = loan.monthlyPayment || loan.installmentPaymentAmmount || 0
            const gpsAmount = loan.gpsInstallmentPayment || 0
            const totalAmount = baseAmount + gpsAmount
            form.setValue("amount", totalAmount)
            // GPS will be auto-calculated by the useEffect
            calculatePaymentBreakdown(loan, baseAmount, gpsAmount)
        } else {
            setSelectedLoan(null)
            setPaymentBreakdown(null)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > MAX_FILE_SIZE) {
            toast({
                variant: "destructive",
                title: "Archivo demasiado grande",
                description: "El archivo no debe superar los 5MB",
            })
            return
        }

        setSelectedFile(file)
        if (file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setFilePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setFilePreview(null)
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        setFilePreview(null)
        form.setValue("attachmentUrl", "")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const simulateUploadProgress = () => {
        setIsUploading(true)
        setUploadProgress(0)
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsUploading(false)
                    return 100
                }
                return prev + 10
            })
        }, 200)
        return () => clearInterval(interval)
    }

    const onSubmit = async (values: InstallmentFormValues) => {
        try {
            setLoading(true)
            let attachmentUrl: string | undefined = undefined

            if (selectedFile) {
                const cleanupProgress = simulateUploadProgress()
                const url = await uploadImageToCloudinary(selectedFile)
                cleanupProgress()
                if (!url) {
                    toast({
                        variant: "destructive",
                        title: "Error al subir el archivo",
                        description: "No se pudo subir el archivo a Cloudinary",
                    })
                    return
                }
                attachmentUrl = url
                form.setValue("attachmentUrl", url)
            } else if (isEditing && filePreview && !selectedFile) {
                attachmentUrl = filePreview
                form.setValue("attachmentUrl", filePreview)
            }

            // Use the calculated payment coverage from API for isLate/isAdvance
            // daysAheadAfterPayment > 0 means coverage extends BEYOND today (truly ahead)
            // daysAheadAfterPayment === 0 means coverage ends exactly today (up to date)
            // daysAheadAfterPayment < 0 means coverage doesn't reach today (still behind)
            const willBeAhead = paymentCoverage ? paymentCoverage.daysAheadAfterPayment > 0 : false
            const isAdvance = willBeAhead
            const isLate = paymentCoverage ? paymentCoverage.daysAheadAfterPayment < 0 : false

            // Calculate base amount by subtracting GPS from total amount
            // values.amount is the TOTAL payment (base + gps), we need to send just the base
            const gpsAmount = values.gps || 0
            const baseAmount = values.amount - gpsAmount

            const payload: Record<string, any> = {
                loanId: values.loanId,
                amount: baseAmount,  // Send base amount only, not total
                gps: gpsAmount,
                paymentMethod: values.paymentMethod,
                isLate: isLate,
                isAdvance: isAdvance,
                notes: values.notes || "",
                attachmentUrl: values.attachmentUrl || "",
                createdById: values.createdById || user?.id,
            }

            // Set late/advance payment dates from coverage calculation
            if (paymentCoverage) {
                if (isLate && paymentCoverage.latePaymentDate) {
                    payload.latePaymentDate = paymentCoverage.latePaymentDate
                }
                // Always set advancePaymentDate to coverageEndDate (the last day covered by this payment)
                // This is needed for display even when the payment doesn't put the client ahead
                if (paymentCoverage.coverageEndDate) {
                    payload.advancePaymentDate = paymentCoverage.coverageEndDate
                }
            }

            // Always include paymentDate for both create and update
            payload.paymentDate = values.paymentDate ? values.paymentDate.toISOString() : new Date().toISOString()

            console.log('📅 Payment submission payload:', {
                isEditing,
                paymentDate: payload.paymentDate,
                paymentCoverage,
                isLate,
                isAdvance,
                fullPayload: payload
            })

            if (isEditing && installment) {
                await HttpService.patch(`/api/v1/installments/${installment.id}`, payload)
                toast({
                    title: "Cuota actualizada",
                    description: "La cuota ha sido actualizada correctamente",
                })
            } else {
                await HttpService.post("/api/v1/installments", payload)
                toast({
                    title: "Pago registrado",
                    description: "El pago ha sido registrado correctamente",
                })
            }

            // Reset form state immediately after successful submission
            setSelectedFile(null)
            setFilePreview(null)
            setPaymentCoverage(null)
            setSelectedLoan(null)
            setPaymentBreakdown(null)
            setLastInstallmentInfo(null)
            setIsEditing(false)
            setLoanNews([])
            form.reset({
                loanId: "",
                amount: 0,
                gps: 0,
                dueDate: null,
                paymentDate: new Date(),
                notes: "",
                attachmentUrl: "",
                createdById: user?.id,
            })

            onSaved?.()
            setOpen(false)
        } catch (error) {
            console.error(`Error al ${isEditing ? "actualizar" : "registrar"} pago:`, error)
            toast({
                variant: "destructive",
                title: "Error",
                description: `No se pudo ${isEditing ? "actualizar" : "registrar"} el pago`,
            })
        } finally {
            setLoading(false)
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    const handleDialogChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            // Reset all form state when dialog closes
            setLoadingData(true)
            setSelectedFile(null)
            setFilePreview(null)
            setUploadProgress(0)
            setIsUploading(false)
            setPaymentCoverage(null)
            setSelectedLoan(null)
            setPaymentBreakdown(null)
            setLastInstallmentInfo(null)
            setIsEditing(false)
            form.reset({
                loanId: "",
                amount: 0,
                gps: 0,
                dueDate: null,
                paymentDate: new Date(),
                notes: "",
                attachmentUrl: "",
                createdById: user?.id,
            })
        }
    }

    // Use API-calculated coverage for isLate/isAdvance
    // daysAheadAfterPayment > 0 means coverage extends BEYOND today (truly ahead)
    // daysAheadAfterPayment === 0 means coverage ends exactly today (up to date)
    // daysAheadAfterPayment < 0 means coverage doesn't reach today (still behind)
    const effectiveWillBeAhead = paymentCoverage ? paymentCoverage.daysAheadAfterPayment > 0 : false
    const effectiveIsAdvance = effectiveWillBeAhead
    const effectiveIsLate = paymentCoverage ? paymentCoverage.daysAheadAfterPayment < 0 : false

    return {
        // State
        open,
        loading,
        loans,
        loadingData,
        selectedLoan,
        paymentBreakdown,
        selectedFile,
        filePreview,
        uploadProgress,
        isUploading,
        isEditing,
        fileInputRef,
        form,
        amount,
        gps,
        isLate: effectiveIsLate,
        isAdvance: effectiveIsAdvance,
        lastInstallmentInfo,
        paymentCoverage,
        loadingCoverage,
        loanNews,
        loadingNews,

        // Actions
        setOpen,
        handleLoanChange,
        handleFileChange,
        removeFile,
        onSubmit,
        handleDialogChange,
    }
}
