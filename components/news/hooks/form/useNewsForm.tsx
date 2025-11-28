"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { News, NewsType, NewsCategory } from "@/lib/types"
import { NewsService, CreateNewsDto } from "@/lib/services/news.service"
import { useStore } from "@/contexts/StoreContext"
import { useToast } from "@/components/ui/use-toast"

export const newsSchema = z.object({
    type: z.nativeEnum(NewsType),
    category: z.nativeEnum(NewsCategory),
    title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    notes: z.string().optional(),
    startDate: z.string().min(1, "La fecha de inicio es requerida"),
    endDate: z.string().optional(),
    isActive: z.boolean().default(true),
    loanId: z.string().optional(),
    autoCalculateInstallments: z.boolean().default(false),
    daysUnavailable: z.number().min(0).optional(),
    installmentsToSubtract: z.number().min(0).optional(),
})

export type NewsFormValues = z.infer<typeof newsSchema>

interface UseNewsFormProps {
    news?: News | null
    open: boolean
    onSuccess: () => void
}

export function useNewsForm({ news, open, onSuccess }: UseNewsFormProps) {
    const [loading, setLoading] = useState(false)
    const { currentStore } = useStore()
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
            isActive: true,
            loanId: "",
            autoCalculateInstallments: false,
            daysUnavailable: 0,
            installmentsToSubtract: 0,
        },
    })

    const newsType = form.watch("type")
    const autoCalculate = form.watch("autoCalculateInstallments")

    useEffect(() => {
        if (news) {
            form.reset({
                type: news.type,
                category: news.category,
                title: news.title,
                description: news.description,
                notes: news.notes || "",
                startDate: new Date(news.startDate).toISOString().split("T")[0],
                endDate: news.endDate ? new Date(news.endDate).toISOString().split("T")[0] : "",
                isActive: news.isActive,
                loanId: news.loanId || "",
                autoCalculateInstallments: news.autoCalculateInstallments,
                daysUnavailable: news.daysUnavailable || 0,
                installmentsToSubtract: news.installmentsToSubtract || 0,
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
                isActive: true,
                loanId: "",
                autoCalculateInstallments: false,
                daysUnavailable: 0,
                installmentsToSubtract: 0,
            })
        }
    }, [news, open])

    const onSubmit = async (values: NewsFormValues) => {
        if (!currentStore) return

        try {
            setLoading(true)

            const data: CreateNewsDto = {
                ...values,
                storeId: currentStore.id,
                loanId: values.type === NewsType.LOAN_SPECIFIC ? values.loanId : undefined,
                endDate: values.endDate || undefined,
                notes: values.notes || undefined,
                daysUnavailable: values.daysUnavailable || undefined,
                installmentsToSubtract: values.installmentsToSubtract || undefined,
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
        autoCalculate,
        onSubmit,
        isEditing: !!news,
    }
}
