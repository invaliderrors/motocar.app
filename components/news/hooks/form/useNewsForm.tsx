"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { News, NewsType, NewsCategory } from "@/lib/types"
import { NewsService, CreateNewsDto } from "@/lib/services/news.service"
import { useStore } from "@/contexts/StoreContext"
import { useToast } from "@/components/ui/use-toast"

// Date selection mode types
export type DateSelectionMode = "single" | "range" | "multiple" | "recurring" | "weekday"

export const newsSchema = z.object({
    type: z.nativeEnum(NewsType),
    category: z.nativeEnum(NewsCategory),
    title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    notes: z.string().optional(),
    startDate: z.string().min(1, "La fecha de inicio es requerida"),
    endDate: z.string().optional(),
    loanId: z.string().optional(),
    // Date selection mode
    dateSelectionMode: z.enum(["single", "range", "multiple", "recurring", "weekday"]).default("single"),
    // Recurring configuration
    isRecurring: z.boolean().default(false),
    recurringDay: z.number().min(1).max(31).optional(),
    recurringMonths: z.array(z.number().min(1).max(12)).default([]),
    // Multiple dates
    skippedDates: z.array(z.string()).default([]),
    // Weekday skip configuration
    skipWeekday: z.number().min(0).max(6).optional(),
    applyToHistoricalLoans: z.boolean().default(false),
})

export type NewsFormValues = z.infer<typeof newsSchema>

interface UseNewsFormProps {
    news?: News | null
    open: boolean
    onSuccess: () => void
}

export function useNewsForm({ news, open, onSuccess }: UseNewsFormProps) {
    const [loading, setLoading] = useState(false)
    const { currentStore, triggerLoanRefresh } = useStore()
    const { toast } = useToast()

    const form = useForm<NewsFormValues>({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            type: NewsType.LOAN_SPECIFIC,
            category: NewsCategory.WORKSHOP,
            title: "",
            description: "",
            notes: "",
            startDate: new Date().toISOString().split("T")[0],
            endDate: "",
            loanId: "",
            dateSelectionMode: "single",
            isRecurring: false,
            recurringDay: undefined,
            recurringMonths: [],
            skippedDates: [],
            skipWeekday: 0, // Default to Sunday
            applyToHistoricalLoans: false,
        },
    })

    const newsType = form.watch("type")
    const startDate = form.watch("startDate")
    const endDate = form.watch("endDate")
    const dateSelectionMode = form.watch("dateSelectionMode")
    const skippedDates = form.watch("skippedDates")

    // Calculate days unavailable based on date selection mode
    const calculateDaysUnavailable = (): number => {
        switch (dateSelectionMode) {
            case "single":
                return 1
            case "range":
                if (!startDate || !endDate) return 0
                const start = new Date(startDate)
                const end = new Date(endDate)
                const diffTime = end.getTime() - start.getTime()
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
                return diffDays > 0 ? diffDays : 0
            case "multiple":
                return skippedDates.length
            case "recurring":
                return 0 // Recurring dates are calculated dynamically
            case "weekday":
                // Calculate approximate occurrences per year (52 weeks = ~52 occurrences)
                // More precise: count actual occurrences in current year
                const year = new Date().getFullYear()
                const startOfYear = new Date(year, 0, 1)
                const endOfYear = new Date(year, 11, 31)
                let count = 0
                const current = new Date(startOfYear)
                
                while (current <= endOfYear) {
                    if (skipWeekday !== undefined && current.getDay() === skipWeekday) {
                        count++
                    }
                    current.setDate(current.getDate() + 1)
                }
                
                return count
            default:
                return 0
        }
    }

    useEffect(() => {
        if (news) {
            // Determine date selection mode from existing data
            let mode: DateSelectionMode = "single"
            if (news.skipWeekday !== null && news.skipWeekday !== undefined) {
                mode = "weekday"
            } else if (news.isRecurring) {
                mode = "recurring"
            } else if (news.skippedDates && news.skippedDates.length > 1) {
                mode = "multiple"
            } else if (news.endDate && news.startDate !== news.endDate) {
                mode = "range"
            }

            form.reset({
                type: news.type,
                category: news.category,
                title: news.title,
                description: news.description,
                notes: news.notes || "",
                startDate: new Date(news.startDate).toISOString().split("T")[0],
                endDate: news.endDate ? new Date(news.endDate).toISOString().split("T")[0] : "",
                loanId: news.loanId || "",
                dateSelectionMode: mode,
                isRecurring: news.isRecurring || false,
                recurringDay: news.recurringDay || undefined,
                recurringMonths: news.recurringMonths || [],
                skippedDates: news.skippedDates?.map(d => new Date(d).toISOString().split("T")[0]) || [],
                skipWeekday: news.skipWeekday ?? undefined,
                applyToHistoricalLoans: news.applyToHistoricalLoans || false,
            })
        } else {
            form.reset({
                type: NewsType.LOAN_SPECIFIC,
                category: NewsCategory.WORKSHOP,
                title: "",
                description: "",
                notes: "",
                startDate: new Date().toISOString().split("T")[0],
                endDate: "",
                loanId: "",
                dateSelectionMode: "single",
                isRecurring: false,
                recurringDay: undefined,
                recurringMonths: [],
                skippedDates: [],
                skipWeekday: 0, // Default to Sunday
                applyToHistoricalLoans: false,
            })
        }
    }, [news, open])

    const onSubmit = async (values: NewsFormValues) => {
        if (!currentStore) return

        try {
            setLoading(true)

            // Build data based on date selection mode
            let finalSkippedDates: string[] = []
            let autoCalc = false
            let finalEndDate: string | undefined = undefined

            switch (values.dateSelectionMode) {
                case "single":
                    finalSkippedDates = [values.startDate]
                    break
                case "range":
                    autoCalc = true
                    finalEndDate = values.endDate
                    break
                case "multiple":
                    finalSkippedDates = values.skippedDates
                    break
                case "recurring":
                    // Recurring mode uses recurringDay and recurringMonths
                    break
                case "weekday":
                    // Weekday mode uses skipWeekday and applyToHistoricalLoans
                    break
            }

            const daysUnavailable = calculateDaysUnavailable()

            const data: CreateNewsDto = {
                type: values.type,
                category: values.category,
                title: values.title,
                description: values.description,
                notes: values.notes || undefined,
                startDate: values.startDate,
                endDate: finalEndDate,
                storeId: currentStore.id,
                loanId: values.type === NewsType.LOAN_SPECIFIC ? values.loanId : undefined,
                isActive: true,
                autoCalculateInstallments: autoCalc,
                daysUnavailable: daysUnavailable > 0 ? daysUnavailable : undefined,
                installmentsToSubtract: daysUnavailable > 0 ? daysUnavailable : undefined,
                isRecurring: values.dateSelectionMode === "recurring",
                recurringDay: values.dateSelectionMode === "recurring" ? values.recurringDay : undefined,
                recurringMonths: values.dateSelectionMode === "recurring" ? values.recurringMonths : [],
                skippedDates: finalSkippedDates,
                skipWeekday: values.dateSelectionMode === "weekday" ? values.skipWeekday : undefined,
                applyToHistoricalLoans: values.dateSelectionMode === "weekday" ? values.applyToHistoricalLoans : undefined,
            }

            if (news) {
                await NewsService.update(news.id, data)
                toast({
                    title: "Novedad actualizada",
                    description: "La novedad ha sido actualizada correctamente",
                })
            } else {
                await NewsService.create(data)
                toast({
                    title: "Novedad creada",
                    description: "La novedad ha sido creada correctamente",
                })
            }

            // Trigger loan table refresh to update coverage dates
            triggerLoanRefresh()
            
            onSuccess()
        } catch (error) {
            console.error("Error saving news:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo guardar la novedad",
            })
        } finally {
            setLoading(false)
        }
    }

    return {
        form,
        loading,
        newsType,
        onSubmit,
        isEditing: !!news,
    }
}
