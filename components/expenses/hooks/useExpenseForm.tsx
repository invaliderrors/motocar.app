"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import { format } from "date-fns"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"
import type { Expense } from "@/lib/types"

export const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_EXPENSES!)

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        )
        if (response.data.secure_url) {
            return response.data.secure_url
        } else {
            console.error("Error uploading to Cloudinary", response.data)
            return null
        }
    } catch (error) {
        console.error("Upload error", error)
        return null
    }
}

const expenseSchema = z.object({
    category: z.string().min(1, { message: "La categoría es obligatoria" }),
    amount: z.coerce.number().positive({ message: "El monto debe ser mayor a 0" }),
    paymentMethod: z.string().min(1, { message: "El método de pago es obligatorio" }),
    beneficiary: z.string().min(1, { message: "El beneficiario es obligatorio" }),
    reference: z.string().optional(),
    description: z.string().min(1, { message: "La descripción es obligatoria" }),
    date: z.string().min(1, { message: "La fecha es obligatoria" }),
    attachmentUrl: z.string().optional(),
    provider: z.string(),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>

interface UseExpenseFormProps {
    onSuccess?: () => void
    isModal?: boolean
    expenseData?: Expense
    isEditing?: boolean
}

export function useExpenseForm({ onSuccess, isModal = false, expenseData, isEditing = false }: UseExpenseFormProps) {
    const [loading, setLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const { toast } = useToast()
    const { user } = useAuth()

    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            category: "",
            amount: 0,
            paymentMethod: "",
            beneficiary: "",
            reference: "",
            description: "",
            date: format(new Date(), "yyyy-MM-dd"),
            attachmentUrl: "",
            provider: "",
        },
    })

    useEffect(() => {
        if (expenseData && isEditing) {
            form.reset({
                category: expenseData.category,
                amount: expenseData.amount,
                paymentMethod: expenseData.paymentMethod,
                beneficiary: expenseData.beneficiary,
                reference: expenseData.reference || "",
                description: expenseData.description,
                date: format(new Date(expenseData.date), "yyyy-MM-dd"),
                attachmentUrl: expenseData.attachmentUrl || "",
                provider: expenseData.provider?.name || "",
            })
            if (expenseData.attachmentUrl) {
                setImagePreview(expenseData.attachmentUrl)
            }
        }
    }, [expenseData, isEditing, form])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
        if (!validTypes.includes(file.type)) {
            toast({
                variant: "destructive",
                title: "Formato no válido",
                description: "Por favor seleccione una imagen en formato JPG, PNG o WEBP.",
            })
            return
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            toast({
                variant: "destructive",
                title: "Archivo demasiado grande",
                description: "El tamaño máximo permitido es 5MB.",
            })
            return
        }

        try {
            setUploadingImage(true)
            // Create a local preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)

            // Upload to Cloudinary
            const imageUrl = await uploadImageToCloudinary(file)
            if (imageUrl) {
                form.setValue("attachmentUrl", imageUrl)
                toast({
                    title: "Imagen cargada",
                    description: "La imagen se ha subido correctamente.",
                })
            } else {
                setImagePreview(null)
                toast({
                    variant: "destructive",
                    title: "Error al subir imagen",
                    description: "No se pudo cargar la imagen. Intente nuevamente.",
                })
            }
        } catch (error) {
            console.error("Error uploading image:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Ocurrió un error al subir la imagen. Intente nuevamente.",
            })
        } finally {
            setUploadingImage(false)
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        form.setValue("attachmentUrl", "")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const onSubmit = async (values: ExpenseFormValues) => {
        try {
            setLoading(true)
            const payload = {
                ...values,
                createdById: user?.id,
            }

            if (isEditing && expenseData) {
                await HttpService.put(`/api/v1/expense/${expenseData.id}`, payload)
                toast({
                    title: "Egreso actualizado",
                    description: "El egreso ha sido actualizado correctamente",
                })
            } else {
                await HttpService.post("/api/v1/expense", payload)
                toast({
                    title: "Egreso registrado",
                    description: "El egreso ha sido registrado correctamente",
                })
            }

            if (onSuccess) onSuccess()
            if (!isModal) {
                form.reset({
                    category: "",
                    amount: 0,
                    paymentMethod: "",
                    beneficiary: "",
                    reference: "",
                    description: "",
                    date: format(new Date(), "yyyy-MM-dd"),
                    attachmentUrl: "",
                    provider: "",
                })
                setImagePreview(null)
            }
        } catch (error) {
            console.error("Error al guardar egreso:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: isEditing
                    ? "No se pudo actualizar el egreso. Intente nuevamente."
                    : "No se pudo registrar el egreso. Intente nuevamente.",
            })
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        form.reset({
            category: "",
            amount: 0,
            paymentMethod: "",
            beneficiary: "",
            reference: "",
            description: "",
            date: format(new Date(), "yyyy-MM-dd"),
            attachmentUrl: "",
            provider: "",
        })
        setImagePreview(null)
    }

    return {
        // Form state
        form,
        loading,
        uploadingImage,
        imagePreview,
        fileInputRef,

        // Actions
        handleFileChange,
        removeImage,
        onSubmit: form.handleSubmit(onSubmit),
        resetForm,

        // Computed values
        isEditing,
    }
}

export { expenseSchema }
