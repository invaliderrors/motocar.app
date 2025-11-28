"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import { User as UserType } from "@/lib/types"

const userSchema = z.object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    identification: z.string().min(5, { message: "La identificación debe tener al menos 5 caracteres" }),
    idIssuedAt: z.string().min(2, { message: "El lugar de expedición debe tener al menos 2 caracteres" }),
    age: z.coerce.number().min(18, { message: "La edad debe ser mayor o igual a 18" }),
    phone: z.string().min(7, { message: "El teléfono debe tener al menos 7 caracteres" }),
    address: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
    city: z.string().min(2, { message: "La ciudad debe tener al menos 2 caracteres" }),
    refName: z.string().min(2, { message: "El nombre del referente debe tener al menos 2 caracteres" }),
    refID: z.string().min(5, { message: "La identificación del referente debe tener al menos 5 caracteres" }),
    refPhone: z.string().min(7, { message: "El teléfono del referente debe tener al menos 7 caracteres" }),
})

export type UserFormValues = z.infer<typeof userSchema>

interface UseUserFormProps {
    userId?: string
    userData?: UserType
    onCreated?: (user: UserType) => void
    onClose?: () => void
}

export function useUserForm({ userId, userData, onCreated, onClose }: UseUserFormProps) {
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("personal")
    const { toast } = useToast()

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            identification: "",
            idIssuedAt: "",
            age: 18,
            phone: "",
            address: "",
            city: "",
            refName: "",
            refID: "",
            refPhone: "",
        },
    })

    // Populate form with existing user data
    useEffect(() => {
        if (userData) {
            form.reset({
                name: userData.name,
                identification: userData.identification,
                idIssuedAt: userData.idIssuedAt || "",
                age: userData.age,
                phone: userData.phone,
                address: userData.address,
                city: userData.city || "",
                refName: userData.refName,
                refID: userData.refID,
                refPhone: userData.refPhone,
            })
        }
    }, [userData, form])

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((c) => c.startsWith("authToken="))
            ?.split("=")[1]
    }

    const onSubmit = async (values: UserFormValues) => {
        try {
            setLoading(true)
            const token = getAuthToken()

            let response
            if (userId) {
                response = await HttpService.put(`/api/v1/users/${userId}`, values, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                })
            } else {
                response = await HttpService.post("/api/v1/users", values, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                })
            }

            toast({
                title: userId ? "Usuario actualizado" : "Usuario creado",
                description: userId
                    ? "El usuario ha sido actualizado correctamente"
                    : "El usuario ha sido creado correctamente",
            })

            onCreated?.(response.data)
            onClose?.()
            form.reset()
        } catch (error) {
            console.error("Error al guardar usuario:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: userId ? "No se pudo actualizar el usuario" : "No se pudo crear el usuario",
            })
        } finally {
            setLoading(false)
        }
    }

    const goToNextTab = () => {
        setActiveTab("reference")
    }

    const goToPreviousTab = () => {
        setActiveTab("personal")
    }

    const resetForm = () => {
        form.reset()
        setActiveTab("personal")
    }

    return {
        // Form state
        form,
        loading,
        activeTab,
        setActiveTab,

        // Actions
        onSubmit: form.handleSubmit(onSubmit),
        goToNextTab,
        goToPreviousTab,
        resetForm,

        // Computed values
        isEditing: !!userId,
    }
}
