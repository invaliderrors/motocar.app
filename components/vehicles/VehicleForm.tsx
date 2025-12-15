"use client"

import type React from "react"
import { useState } from "react"
import { Form } from "@/components/ui/form"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { Vehicle } from "@/lib/types"
import { useVehicleForm } from "./hooks/useVehicleForm"
import { FormErrorSummary } from "./form/VehicleErrorFormSummary"
import {
  Bike,
  Car,
  X,
  Save,
  Loader2,
  Settings,
  Shield,
  Truck,
  Palette,
  Gauge,
  Cog,
  FileText,
  Hash,
  Building2
} from "lucide-react"
import { VehicleFormField } from "./form/VehicleFormField"
import { VehicleTypeSelectField } from "./form/VehicleTypeSelectField"
import { ProviderSelectField } from "./form/ProviderSelectField"

type Props = {
  children: React.ReactNode
  vehicleId?: string
  vehicleData?: Vehicle
  onCreated?: (newVehicle?: Vehicle) => void
}

export function VehicleForm({ children, vehicleId, vehicleData, onCreated }: Props) {
  const [open, setOpen] = useState(false)

  const { form, loading, onSubmit, resetForm, isEditing, hasErrors } = useVehicleForm({
    vehicleId,
    vehicleData,
    onCreated,
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
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
        resetForm()
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[1100px] p-0 overflow-hidden bg-background border-0 shadow-2xl max-h-[90vh]">
        <VisuallyHidden>
          <DialogTitle>{isEditing ? "Editar Vehículo" : "Nuevo Vehículo"}</DialogTitle>
        </VisuallyHidden>
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 rounded-full h-9 w-9 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="relative p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Bike className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {isEditing ? "Editar Vehículo" : "Nuevo Vehículo"}
                </h2>
                <p className="text-white/70 text-sm">
                  {isEditing ? "Actualiza la información del vehículo" : "Registra un nuevo vehículo en el sistema"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-5">
              
              {/* Row 1: Type & Provider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Car className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium">Tipo de Vehículo</span>
                  </div>
                  <VehicleTypeSelectField control={form.control} name="vehicleType" />
                </div>

                <div className="p-4 rounded-xl border border-border/50 bg-muted/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-violet-500" />
                    </div>
                    <span className="text-sm font-medium">Proveedor</span>
                  </div>
                  <ProviderSelectField control={form.control} name="providerId" />
                </div>
              </div>

              {/* Row 2: Identification Section */}
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-amber-500" />
                  </div>
                  <span className="font-medium">Identificación</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Placa</span>
                    </div>
                    <VehicleFormField
                      control={form.control}
                      name="plate"
                      label=""
                      placeholder="ABC123"
                      description=""
                      className="uppercase font-mono tracking-wider"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Marca</span>
                    </div>
                    <VehicleFormField
                      control={form.control}
                      name="brand"
                      label=""
                      placeholder="Honda, Yamaha..."
                      description=""
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Bike className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Modelo</span>
                    </div>
                    <VehicleFormField
                      control={form.control}
                      name="model"
                      label=""
                      placeholder="CBR 600, NMax..."
                      description=""
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Technical Specs */}
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-slate-500/10 flex items-center justify-center">
                    <Settings className="h-4 w-4 text-slate-500" />
                  </div>
                  <span className="font-medium">Especificaciones Técnicas</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Color</span>
                    </div>
                    <VehicleFormField
                      control={form.control}
                      name="color"
                      label=""
                      placeholder="Rojo, Negro..."
                      description=""
                      required={false}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Cilindraje</span>
                    </div>
                    <VehicleFormField
                      control={form.control}
                      name="cc"
                      label=""
                      placeholder="150"
                      description=""
                      type="number"
                      required={false}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Cog className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">N° Motor</span>
                    </div>
                    <VehicleFormField
                      control={form.control}
                      name="engine"
                      label=""
                      placeholder="HA11EPR9M01101"
                      description=""
                      className="font-mono uppercase text-xs"
                      required={false}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">N° Chasis</span>
                    </div>
                    <VehicleFormField
                      control={form.control}
                      name="chassis"
                      label=""
                      placeholder="Número de chasis"
                      description=""
                      className="font-mono uppercase text-xs"
                      required={false}
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Documents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">SOAT</p>
                      <p className="text-xs text-emerald-600/60 dark:text-emerald-500/60">Seguro Obligatorio</p>
                    </div>
                  </div>
                  <VehicleFormField
                    control={form.control}
                    name="soatDueDate"
                    label=""
                    placeholder="25 Noviembre 2026"
                    description=""
                    type="text"
                    required={false}
                  />
                </div>

                <div className="p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800/50 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-700 dark:text-blue-400 text-sm">Tecnomecánica</p>
                      <p className="text-xs text-blue-600/60 dark:text-blue-500/60">Revisión Técnica</p>
                    </div>
                  </div>
                  <VehicleFormField
                    control={form.control}
                    name="technomechDueDate"
                    label=""
                    placeholder="25 Noviembre 2026"
                    description=""
                    type="text"
                    required={false}
                  />
                </div>
              </div>

              {hasErrors && <FormErrorSummary errors={form.formState.errors} />}
            </form>
          </Form>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border/50 bg-muted/30 px-5 py-4">
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              onClick={onSubmit}
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Actualizando..." : "Guardando..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Actualizar" : "Guardar Vehículo"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

