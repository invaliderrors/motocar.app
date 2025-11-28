"use client"

import { Form } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import type { Expense } from "@/lib/types"
import { useExpenseForm } from "./hooks/useExpenseForm"
import { ExpenseAttachmentUpload } from "./form/ExpenseAttachmentUpload"
import { ExpenseFormActions } from "./form/ExpenseFormActions"
import { ExpenseAdditionalDetails } from "./form/ExpenseFormAdditionalDetails"
import { ExpenseBasicInfo } from "./form/ExpenseFormBasicInfo"

interface ExpenseFormProps {
  onSuccess?: () => void
  isModal?: boolean
  expenseData?: Expense
  isEditing?: boolean
}

export function ExpenseForm({ onSuccess, isModal = false, expenseData, isEditing = false }: ExpenseFormProps) {
  const {
    form,
    loading,
    uploadingImage,
    imagePreview,
    fileInputRef,
    handleFileChange,
    removeImage,
    onSubmit,
    isEditing: formIsEditing,
  } = useExpenseForm({
    onSuccess,
    isModal,
    expenseData,
    isEditing,
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <ExpenseBasicInfo control={form.control} />

        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
            <ExpenseAdditionalDetails control={form.control} />
            <div className="mt-6">
              <ExpenseAttachmentUpload
                control={form.control}
                imagePreview={imagePreview}
                uploadingImage={uploadingImage}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
                onRemoveImage={removeImage}
              />
            </div>
          </CardContent>
        </Card>

        <ExpenseFormActions loading={loading} uploadingImage={uploadingImage} isEditing={formIsEditing} />
      </form>
    </Form>
  )
}
