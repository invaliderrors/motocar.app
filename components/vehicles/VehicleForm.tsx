"use client"

import type React from "react"
import { useState } from "react"
import { Form } from "@/components/ui/form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import type { Vehicle } from "@/lib/types"
import { useVehicleForm } from "./hooks/useVehicleForm"
import { VehicleDialogHeader } from "./form/VehicleDialogHeader"
import { BasicInfoSection } from "./form/VehicleBasicInfoSection"
import { FormErrorSummary } from "./form/VehicleErrorFormSummary"
import { FormActions } from "./form/VehicleFormActions"
import { IdentificationSection } from "./form/VehicleIdentificationSection"
import { CharacteristicsSection } from "./form/VehicleCharacteristicsSection"

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[1200px] p-0 overflow-hidden bg-card max-h-[90vh] overflow-y-auto">
        <VehicleDialogHeader isEditing={isEditing} onClose={handleClose} />

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Provider Selection - Full Width */}
              <IdentificationSection control={form.control} />

              {/* Two Column Layout for Basic Info and Characteristics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BasicInfoSection control={form.control} />
                <CharacteristicsSection control={form.control} />
              </div>

              {hasErrors && <FormErrorSummary errors={form.formState.errors} />}

              <FormActions loading={loading} isEditing={isEditing} onCancel={handleClose} />
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

