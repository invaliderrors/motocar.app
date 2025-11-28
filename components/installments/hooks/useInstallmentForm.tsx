"use client"

import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loan as BaseLoan, Installment } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import { useAuth } from "@/hooks/useAuth"
import { uploadImageToCloudinary } from "@/lib/services/cloudinary"
import { utcToZonedTime } from "date-fns-tz"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const COLOMBIA_TZ = "America/Bogota"

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
    const dueDate = form.watch("dueDate")
    const paymentMethod = form.watch("paymentMethod")

    // Load installment data for editing
    useEffect(() => {
        if (installment) {
            setIsEditing(true)
            form.setValue("loanId", installment.loanId)
            form.setValue("amount", installment.amount)
            form.setValue("gps", installment.gps || 0)
            form.setValue("paymentMethod", installment.paymentMethod || "CASH")
            form.setValue("notes", installment.notes || "")
            form.setValue("attachmentUrl", installment.attachmentUrl || "")
            form.setValue("createdById", installment.createdById || user?.id)

            if (!selectedLoan) {
                const tempLoan = {
                    id: installment.loanId,
                    user: { name: "Cliente cargando..." },
                    vehicle: { model: "Cargando...", plate: "" },
                    debtRemaining: 0,
                    interestRate: 0,
                    interestType: "FIXED",
                    installments: 0,
                    financedAmount: 0,
                    totalCapitalPaid: 0,
                    nextInstallmentNumber: 0,
                    payments: [],
                    monthlyPayment: 0,
                    userId: "",
                    contractNumber: "",
                    vehicleId: "",
                    totalAmount: 0,
                    downPayment: 0,
                    startDate: new Date(),
                    endDate: new Date(),
                    status: "ACTIVE",
                    paymentFrequency: "MONTHLY",
                    paidInstallments: 0,
                    totalPaid: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as unknown as EnrichedLoan
                setSelectedLoan(tempLoan)
            }

            // Load dueDate from either new dueDate field or legacy latePaymentDate
            if (installment.dueDate) {
                form.setValue("dueDate", new Date(installment.dueDate))
            } else if (installment.latePaymentDate) {
                form.setValue("dueDate", new Date(installment.latePaymentDate))
            }
            
            if (installment.paymentDate) {
                form.setValue("paymentDate", new Date(installment.paymentDate))
            }
            if (installment.attachmentUrl) {
                setFilePreview(installment.attachmentUrl)
            }
        } else {
            setIsEditing(false)
            form.setValue("paymentDate", new Date())
            form.setValue("createdById", user?.id)
        }
    }, [installment, form, user, selectedLoan])

    // Calculate payment breakdown
    useEffect(() => {
        if (selectedLoan) {
            // Always show breakdown for TRANSACTION method, or when amount is entered
            if (paymentMethod === "TRANSACTION" || amount) {
                calculatePaymentBreakdown(selectedLoan, amount, gps)
            }
        }
    }, [selectedLoan, amount, gps, dueDate, paymentMethod])

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
                    // Use the actual loan's payment amount
                    const paymentAmount = loan.monthlyPayment || loan.installmentPaymentAmmount || 0
                    const gpsAmount = loan.gpsInstallmentPayment || 0
                    form.setValue("amount", paymentAmount)
                    form.setValue("gps", gpsAmount)
                    calculatePaymentBreakdown(loan, paymentAmount, gpsAmount)
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
            // Use the actual loan's payment amount
            form.setValue("amount", loan.monthlyPayment || loan.installmentPaymentAmmount || 0)
            // Use the actual GPS amount from the loan
            form.setValue("gps", loan.gpsInstallmentPayment || 0)
            calculatePaymentBreakdown(loan, loan.monthlyPayment || loan.installmentPaymentAmmount || 0, loan.gpsInstallmentPayment || 0)
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

            // Determine if payment is late or advance based on dueDate
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            
            let isLate = false
            let isAdvance = false
            
            if (values.dueDate) {
                const due = new Date(values.dueDate)
                due.setHours(0, 0, 0, 0)
                
                if (due < today) {
                    isLate = true
                } else if (due > today) {
                    isAdvance = true
                }
            }

            const payload: Record<string, any> = {
                loanId: values.loanId,
                amount: values.amount,
                gps: values.gps,
                paymentMethod: values.paymentMethod,
                isLate: isLate,
                isAdvance: isAdvance,
                notes: values.notes || "",
                attachmentUrl: values.attachmentUrl || "",
                createdById: values.createdById || user?.id,
            }

            if (values.dueDate) {
                payload.dueDate = values.dueDate.toISOString()
                // For backward compatibility, also send latePaymentDate if late
                if (isLate) {
                    payload.latePaymentDate = values.dueDate.toISOString()
                } else if (isAdvance) {
                    payload.advancePaymentDate = values.dueDate.toISOString()
                }
            }

            // Always include paymentDate for both create and update
            payload.paymentDate = values.paymentDate ? values.paymentDate.toISOString() : new Date().toISOString()

            console.log('📅 Payment submission payload:', {
                isEditing,
                paymentDate: payload.paymentDate,
                dueDate: payload.dueDate,
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
            setLoadingData(true)
            setSelectedFile(null)
            setFilePreview(null)
            setUploadProgress(0)
            setIsUploading(false)
            if (!isEditing) {
                form.reset()
            }
        }
    }

    // Calculate payment status based on dueDate
    const getPaymentStatus = () => {
        if (!dueDate) return { isLate: false, isAdvance: false }
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const due = new Date(dueDate)
        due.setHours(0, 0, 0, 0)
        
        return {
            isLate: due < today,
            isAdvance: due > today
        }
    }
    
    const paymentStatus = getPaymentStatus()

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
        isLate: paymentStatus.isLate,
        isAdvance: paymentStatus.isAdvance,
        dueDate,
        lastInstallmentInfo,

        // Actions
        setOpen,
        handleLoanChange,
        handleFileChange,
        removeFile,
        onSubmit,
        handleDialogChange,
    }
}
