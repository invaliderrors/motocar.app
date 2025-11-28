"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Provider } from "@/lib/types"

const providerSchema = z.object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
})

export type ProviderFormValues = z.infer<typeof providerSchema>

interface UseProviderFormProps {
    providerId?: string
    providerData?: Provider
    onCreated?: (provider: Provider) => void
    onClose?: () => void
    createProvider: (name: string) => Promise<Provider>
    updateProvider: (id: string, name: string) => Promise<Provider>
}

export function useProviderForm({
    providerId,
    providerData,
    onCreated,
    onClose,
    createProvider,
    updateProvider,
}: UseProviderFormProps) {
    const [loading, setLoading] = useState(false)

    const form = useForm<ProviderFormValues>({
        resolver: zodResolver(providerSchema),
        defaultValues: {
            name: "",
        },
    })

    // Populate form with existing provider data
    useEffect(() => {
        if (providerData) {
            form.reset({
                name: providerData.name,
            })
        }
    }, [providerData, form])

    const onSubmit = async (values: ProviderFormValues) => {
        try {
            setLoading(true)

            let response
            if (providerId) {
                response = await updateProvider(providerId, values.name)
            } else {
                response = await createProvider(values.name)
            }

            onCreated?.(response)
            onClose?.()
            form.reset()
        } catch (error) {
            console.error("Error al guardar proveedor:", error)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        form.reset()
    }

    return {
        // Form state
        form,
        loading,

        // Actions
        onSubmit: form.handleSubmit(onSubmit),
        resetForm,

        // Computed values
        isEditing: !!providerId,
    }
}

export { providerSchema }
