"use client"

import { useState } from "react"
import { toast } from "@/hooks/useToast"
import { HttpService } from "@/lib/http"

export const usePrintPdf = () => {
    const [isGenerating, setIsGenerating] = useState(false)

    const handlePrint = async (id: string) => {
        setIsGenerating(true)
        try {
            const res = await HttpService.get(`/api/v1/closing/print/${id}`, {
                responseType: "blob",
                headers: { Accept: "application/pdf" },
            })
            const blob = new Blob([res.data], { type: "application/pdf" })
            const fileURL = URL.createObjectURL(blob)
            const printWindow = window.open(fileURL, "_blank")

            if (!printWindow) {
                toast({
                    variant: "destructive",
                    title: "Ventana bloqueada",
                    description: "Por favor, permita ventanas emergentes para imprimir el PDF",
                })
                throw new Error("No se pudo abrir la ventana de impresión")
            }

            printWindow.addEventListener("load", () => {
                setTimeout(() => printWindow.print(), 1000)
            })

            toast({
                title: "PDF generado",
                description: "El documento se ha enviado a la impresora",
            })
        } catch (error) {
            console.error("Error al imprimir el PDF:", error)
            toast({
                variant: "destructive",
                title: "Error al imprimir",
                description: "No se pudo generar o imprimir el PDF",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return {
        handlePrint,
        isGenerating,
    }
}
