"use client"

import type React from "react"
import { useState } from "react"
import { Form, FormItem, FormLabel, FormDescription, FormMessage, FormField } from "@/components/ui/form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"
import { X, Building, Loader2, Save } from "lucide-react"
import type { Provider } from "@/lib/types"
import { useProviderForm } from "../hooks/useProviderForm"

type Props = {
    children: React.ReactNode
    providerId?: string
    providerData?: Provider
    onCreated?: (provider: Provider) => void
    createProvider: (name: string) => Promise<Provider>
    updateProvider: (id: string, name: string) => Promise<Provider>
}

export function ProviderForm({ children, providerId, providerData, onCreated, createProvider, updateProvider }: Props) {
    const [open, setOpen] = useState(false)

    const { form, loading, onSubmit, resetForm, isEditing } = useProviderForm({
        providerId,
        providerData,
        onCreated,
        createProvider,
        updateProvider,
        onClose: () => {
            setOpen(false)
            resetForm()
        },
    })

    const handleClose = () => {
        setOpen(false)
        resetForm()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card">
                <div className="relative">
                    <div className="absolute top-4 right-4 z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="rounded-full h-8 w-8 bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Cerrar</span>
                        </Button>
                    </div>

                    <div className="bg-primary text-primary-foreground p-6 flex items-center gap-4">
                        <div className="bg-primary-foreground/20 backdrop-blur-sm p-3 rounded-full">
                            <Building className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">
                                {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
                            </DialogTitle>
                            <p className="text-primary-foreground/80 text-sm">
                                {isEditing ? "Actualiza los datos del proveedor" : "Ingresa los datos del nuevo proveedor"}
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        <Form {...form}>
                            <form onSubmit={onSubmit} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                                <Building className="h-4 w-4 text-primary" />
                                                Nombre del Proveedor
                                            </FormLabel>
                                            <Input
                                                placeholder="Nombre del proveedor"
                                                {...field}
                                                className="border-border focus:border-primary"
                                            />
                                            <FormDescription className="text-xs">Ingrese el nombre del proveedor</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-4 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        className="border-border hover:bg-muted bg-transparent"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {isEditing ? "Actualizando..." : "Creando..."}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                {isEditing ? "Actualizar" : "Guardar"}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
