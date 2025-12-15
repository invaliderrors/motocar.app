"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import type { Vehicle } from "@/lib/types"
import { VehicleType } from "@/lib/types"

const vehicleSchema = z.object({
    providerId: z.string({ required_error: "El proveedor es obligatorio" }).uuid(),
    vehicleType: z.nativeEnum(VehicleType, { required_error: "El tipo de vehículo es obligatorio" }),
    brand: z.string().min(2, { message: "La marca debe tener al menos 2 caracteres" }),
    model: z.string().min(2, { message: "El modelo debe tener al menos 2 caracteres" }),
    plate: z.string().min(5, { message: "La placa debe tener al menos 5 caracteres" }),
    price: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
        z.number().min(0, { message: "El precio debe ser un número positivo" }).optional(),
    ).optional(),
    engine: z.string().min(5, { message: "El número de motor debe tener al menos 5 caracteres" }).optional().or(z.literal("")),
    chassis: z.string().min(5, { message: "El número de chasis debe tener al menos 5 caracteres" }).optional().or(z.literal("")),
    color: z.string().optional().or(z.literal("")),
    cc: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
        z.number().min(1, { message: "El cilindraje debe ser un número positivo" }).optional(),
    ).optional(),
    gps: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
        z.number().min(1, { message: "El GPS debe ser un número mayor o igual a 1" }).optional(),
    ).optional(),
    soatDueDate: z.string().optional().or(z.literal("")),
    technomechDueDate: z.string().optional().or(z.literal("")),
})

export type VehicleFormValues = z.infer<typeof vehicleSchema>

interface UseVehicleFormProps {
    vehicleId?: string
    vehicleData?: Vehicle
    onCreated?: (newVehicle?: Vehicle) => void
    onClose?: () => void
}

export function useVehicleForm({ vehicleId, vehicleData, onCreated, onClose }: UseVehicleFormProps) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            providerId: "",
            vehicleType: VehicleType.MOTORCYCLE,
            brand: "",
            model: "",
            plate: "",
            price: undefined,
            engine: "",
            chassis: "",
            color: "",
            cc: undefined,
            gps: undefined,
            soatDueDate: "",
            technomechDueDate: "",
        },
        mode: "onChange",
    })

    // Populate form with existing vehicle data
    useEffect(() => {
        if (vehicleData) {
            form.reset({
                providerId: vehicleData.providerId,
                vehicleType: vehicleData.vehicleType,
                brand: vehicleData.brand,
                model: vehicleData.model,
                plate: vehicleData.plate,
                price: vehicleData.price ?? undefined,
                engine: vehicleData.engine ?? "",
                chassis: vehicleData.chassis ?? "",
                color: vehicleData.color ?? "",
                cc: vehicleData.cc ?? undefined,
                gps: vehicleData.gps ?? undefined,
                soatDueDate: vehicleData.soatDueDate ?? "",
                technomechDueDate: vehicleData.technomechDueDate ?? "",
            })
        }
    }, [vehicleData, form])

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((c) => c.startsWith("authToken="))
            ?.split("=")[1]
    }

    const onSubmit = async (values: VehicleFormValues) => {
        try {
            setLoading(true)
            const token = getAuthToken()

            let response
            if (vehicleId) {
                response = await HttpService.put(`/api/v1/vehicles/${vehicleId}`, values, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                })
            } else {
                response = await HttpService.post("/api/v1/vehicles", values, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                })
            }

            toast({
                title: vehicleId ? "Vehículo actualizado" : "Vehículo creado",
                description: vehicleId
                    ? "El vehículo ha sido actualizado correctamente"
                    : "El vehículo ha sido creado correctamente",
            })

            onClose?.()
            setTimeout(() => {
                onCreated?.(response.data)
            }, 100)

            form.reset({
                providerId: "",
                vehicleType: VehicleType.MOTORCYCLE,
                brand: "",
                model: "",
                plate: "",
                price: undefined,
                engine: "",
                chassis: "",
                color: "",
                cc: undefined,
                gps: undefined,
                soatDueDate: "",
                technomechDueDate: "",
            })
        } catch (error) {
            console.error("Error al guardar vehículo:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: vehicleId ? "No se pudo actualizar el vehículo" : "No se pudo crear el vehículo",
            })
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        form.reset({
            providerId: "",
            vehicleType: VehicleType.MOTORCYCLE,
            brand: "",
            model: "",
            plate: "",
            price: undefined,
            engine: "",
            chassis: "",
            color: "",
            cc: undefined,
            gps: undefined,
            soatDueDate: "",
            technomechDueDate: "",
        })
    }

    return {
        // Form state
        form,
        loading,

        // Actions
        onSubmit: form.handleSubmit(onSubmit),
        resetForm,

        // Computed values
        isEditing: !!vehicleId,
        hasErrors: Object.keys(form.formState.errors).length > 0,
    }
}

export { vehicleSchema }

