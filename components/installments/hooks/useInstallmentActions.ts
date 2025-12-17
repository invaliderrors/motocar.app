"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import { utcToZonedTime, format } from "date-fns-tz"
import { Installment } from "@/lib/types"
import { useStore } from "@/contexts/StoreContext"

export function useInstallmentActions(refreshInstallments: () => void) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
    const [selectedAttachmentUrl, setSelectedAttachmentUrl] = useState("")
    const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState<Installment | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [selectedNotes, setSelectedNotes] = useState<string>("")
    const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false)
    const { toast } = useToast()
    const { currentStore } = useStore()

    const handlePrint = async (installment: Installment) => {
        setIsGenerating(true)

        console.table({
            paymentDate: installment.paymentDate,
            asString: String(installment.paymentDate),
            iso: new Date(installment.paymentDate).toISOString(),
        })

        // The last payment date should be THIS installment's closing date
        // Use latePaymentDate if exists (original due date), advancePaymentDate for advance, otherwise paymentDate
        const lastPaymentDate = installment.latePaymentDate || installment.advancePaymentDate || installment.paymentDate
        
        // Determine if it's an advance payment (has advancePaymentDate and not late)
        const isAdvance = !installment.isLate && !!installment.advancePaymentDate

        // Calculate days ahead/behind for the receipt
        // For historical payments, always calculate from the payment's specific dates
        // Don't use currentDaysBehind as it reflects the CURRENT loan status, not this payment's status
        let daysAhead = 0
        let daysBehind = 0
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (isAdvance && installment.advancePaymentDate) {
            const advanceDate = new Date(installment.advancePaymentDate)
            advanceDate.setHours(0, 0, 0, 0)
            const diffTime = advanceDate.getTime() - today.getTime()
            daysAhead = diffTime / (1000 * 60 * 60 * 24) // Keep fractional days
        } else if (installment.isLate && installment.latePaymentDate) {
            const lateDate = new Date(installment.latePaymentDate)
            lateDate.setHours(0, 0, 0, 0)
            const diffTime = today.getTime() - lateDate.getTime()
            daysBehind = diffTime / (1000 * 60 * 60 * 24) // Keep fractional days
        }

        const payload = {
            name: installment.loan.user.name.trim(),
            identification: installment.loan.vehicle?.plate || installment.loan.motorcycle?.plate || "N/A",
            concept: "Monto",
            contractCode: installment.loan.contractNumber || installment.loanId, // Add contract number
            amount: installment.amount,
            isLate: installment.isLate, // Include isLate flag
            latePaymentDate: installment.latePaymentDate, // Include late payment date
            isAdvance: isAdvance, // Include isAdvance flag
            advancePaymentDate: installment.advancePaymentDate, // Include advance payment date
            gps: installment.gps,
            total: installment.amount + (installment.gps || 0),
            date: installment.paymentDate, // Actual payment date
            paymentDate: installment.paymentDate, // Actual payment date
            notes: installment.notes,
            receiptNumber: installment.id,
            storeId: currentStore?.id, // Add storeId
            paidInstallments: installment.loan.paidInstallments, // Payment status
            remainingInstallments: installment.loan.remainingInstallments, // Payment status
            totalInstallments: installment.loan.installments, // Payment status
            paymentFrequency: installment.loan.paymentFrequency, // Payment frequency for calculating installments owed
            installmentPaymentAmmount: installment.loan.installmentPaymentAmmount, // Contract's installment amount for debt calculation
            lastPaymentDate: lastPaymentDate, // Previous payment date (latePaymentDate if late, advancePaymentDate if advance, otherwise paymentDate)
            // Pre-calculated days for receipt to use directly
            daysAhead: daysAhead,
            daysBehind: daysBehind,
            // Exact decimal precision values for accurate receipt display
            exactInstallmentsOwed: installment.exactInstallmentsOwed, // e.g., 0.67 installments
            remainingAmountOwed: installment.remainingAmountOwed, // e.g., $21,000
        }


        console.table(payload)

        try {
            const res = await HttpService.post("/api/v1/receipt", payload, {
                responseType: "blob",
                headers: {
                    Accept: "application/pdf",
                },
            })

            const blob = new Blob([res.data], { type: "application/pdf" })
            const fileURL = URL.createObjectURL(blob)

            // Detect if running on macOS
            const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || 
                           navigator.userAgent.toUpperCase().indexOf('MAC') >= 0

            // For macOS, use an iframe approach which works better with Safari
            if (isMacOS) {
                // Create a hidden iframe for printing
                const iframe = document.createElement('iframe')
                iframe.style.position = 'fixed'
                iframe.style.right = '0'
                iframe.style.bottom = '0'
                iframe.style.width = '0'
                iframe.style.height = '0'
                iframe.style.border = 'none'
                iframe.src = fileURL
                
                document.body.appendChild(iframe)
                
                iframe.onload = () => {
                    setTimeout(() => {
                        try {
                            iframe.contentWindow?.focus()
                            iframe.contentWindow?.print()
                        } catch (e) {
                            // If iframe print fails, fallback to opening in new tab
                            window.open(fileURL, '_blank')
                        }
                        
                        // Clean up iframe after printing
                        setTimeout(() => {
                            document.body.removeChild(iframe)
                            URL.revokeObjectURL(fileURL)
                        }, 1000)
                    }, 500)
                }
            } else {
                // For Windows/Linux, use the original approach
                const printWindow = window.open(fileURL, "_blank")

                if (!printWindow) {
                    // Fallback: download the file if popup is blocked
                    const link = document.createElement('a')
                    link.href = fileURL
                    link.download = `recibo-${installment.id}.pdf`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    
                    toast({
                        title: "Recibo descargado",
                        description: "El recibo se ha descargado. Ábralo para imprimir.",
                        variant: "default",
                    })
                    return
                }

                printWindow.addEventListener("load", () => {
                    setTimeout(() => {
                        printWindow.print()
                    }, 1000) // pequeña pausa para asegurar carga completa
                })
            }

            toast({
                title: "Recibo generado",
                description: "El recibo se ha enviado a la impresora",
                variant: "default",
            })
        } catch (error) {
            console.error("Error al imprimir el recibo:", error)
            toast({
                variant: "destructive",
                title: "Error al imprimir",
                description: "No se pudo generar o imprimir el recibo",
            })
        } finally {
            setIsGenerating(false)
        }
    }


    const handleSendWhatsapp = async (installment: Installment) => {
        try {
            // Get the phone number from the installment data
            const phoneNumber = `+57${installment.loan.user.phone}`

            if (!phoneNumber) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se encontró un número de teléfono para este cliente",
                })
                return
            }

            setIsGenerating(true)

            // The last payment date should be THIS installment's closing date
            // Use latePaymentDate if exists (original due date), otherwise paymentDate
            const lastPaymentDate = installment.latePaymentDate || installment.advancePaymentDate || installment.paymentDate

            // Determine if it's an advance payment
            const isAdvance = !installment.isLate && !!installment.advancePaymentDate

            // Calculate days ahead/behind for the receipt (same as table calculation)
            // For historical payments, always calculate from the payment's specific dates
            // Don't use currentDaysBehind as it reflects the CURRENT loan status, not this payment's status
            let daysAhead = 0
            let daysBehind = 0
            
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            
            if (isAdvance && installment.advancePaymentDate) {
                const advanceDate = new Date(installment.advancePaymentDate)
                advanceDate.setHours(0, 0, 0, 0)
                const diffTime = advanceDate.getTime() - today.getTime()
                daysAhead = diffTime / (1000 * 60 * 60 * 24) // Keep fractional days
            } else if (installment.isLate && installment.latePaymentDate) {
                const lateDate = new Date(installment.latePaymentDate)
                lateDate.setHours(0, 0, 0, 0)
                const diffTime = today.getTime() - lateDate.getTime()
                daysBehind = diffTime / (1000 * 60 * 60 * 24) // Keep fractional days
            }

            // Prepare the receipt data
            const receiptData = {
                phoneNumber,
                name: installment.loan.user.name,
                identification: installment.loan.vehicle?.plate || installment.loan.motorcycle?.plate || "N/A",
                concept: `Monto`,
                amount: installment.amount,
                isLate: installment.isLate, // Include isLate flag
                latePaymentDate: installment.latePaymentDate, // Include late payment date
                isAdvance: isAdvance, // Include isAdvance flag
                advancePaymentDate: installment.advancePaymentDate, // Include advance payment date
                gps: installment.gps,
                total: installment.amount,
                date: installment.paymentDate,
                paymentDate: installment.paymentDate,
                notes: installment.notes,
                receiptNumber: installment.id,
                caption: `Recibo de pago - ${installment.loan.user.name}`,
                storeId: currentStore?.id, // Add storeId
                paidInstallments: installment.loan.paidInstallments, // Payment status
                remainingInstallments: installment.loan.remainingInstallments, // Payment status
                totalInstallments: installment.loan.installments, // Payment status
                paymentFrequency: installment.loan.paymentFrequency, // Payment frequency for calculating installments owed
                lastPaymentDate: lastPaymentDate, // Previous payment date
                // Pre-calculated days for receipt to use directly
                daysAhead: daysAhead,
                daysBehind: daysBehind,
            }

            // Send the request to the whatsapp endpoint
            await HttpService.post("/api/v1/receipt/whatsapp", receiptData)

            // Show success dialog
            setSuccessMessage(`El recibo ha sido enviado exitosamente a ${installment.loan.user.name} por WhatsApp.`)
            setIsSuccessDialogOpen(true)
        } catch (error) {
            console.error("Error al enviar el recibo por WhatsApp:", error)
            toast({
                variant: "destructive",
                title: "Error al enviar",
                description: "No se pudo enviar el recibo por WhatsApp",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const handleViewAttachment = (installment: Installment) => {
        const attachmentUrl = installment.attachmentUrl || ""
        if (attachmentUrl) {
            setSelectedAttachmentUrl(attachmentUrl)
            setIsAttachmentDialogOpen(true)
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No hay comprobante adjunto para esta cuota",
            })
        }
    }

    const handleViewNotes = (notes: string) => {
        setSelectedNotes(notes)
        setIsNotesDialogOpen(true)
    }

    const handleEdit = (installment: Installment) => {
        setEditingInstallment(installment)
        setIsEditFormOpen(true)
        document.getElementById("edit-form-trigger")?.click()
    }

    const handleDelete = (installment: Installment) => {
        setDeleteConfirmation(installment)
    }

    const confirmDelete = async () => {
        if (!deleteConfirmation) return

        try {
            setIsDeleting(true)

            // Llamada a la API para eliminar la cuota
            await HttpService.delete(`/api/v1/installments/${deleteConfirmation.id}`)

            toast({
                title: "Cuota eliminada",
                description: "La cuota ha sido eliminada correctamente",
                variant: "default",
            })

            // Refresh the installments list
            refreshInstallments()

            // Cerrar el diálogo de confirmación
            setDeleteConfirmation(null)
        } catch (error) {
            console.error("Error al eliminar la cuota:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar la cuota",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return {
        isGenerating,
        successMessage,
        isSuccessDialogOpen,
        setIsSuccessDialogOpen,
        selectedAttachmentUrl,
        isAttachmentDialogOpen,
        setIsAttachmentDialogOpen,
        deleteConfirmation,
        setDeleteConfirmation,
        isDeleting,
        editingInstallment,
        setEditingInstallment,
        isEditFormOpen,
        setIsEditFormOpen,
        selectedNotes,
        isNotesDialogOpen,
        setIsNotesDialogOpen,
        handlePrint,
        handleSendWhatsapp,
        handleViewAttachment,
        handleViewNotes,
        handleEdit,
        handleDelete,
        confirmDelete,
    }
}

export function formatToColombiaTime(date: string | Date) {
    const timeZone = "America/Bogota"
    const zonedDate = utcToZonedTime(date, timeZone)
    return format(zonedDate, "yyyy-MM-dd HH:mm:ss", { timeZone })
}
