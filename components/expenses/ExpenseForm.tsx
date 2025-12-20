"use client"

import { Form } from "@/components/ui/form"
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
      <form onSubmit={onSubmit} className="space-y-5">
        <ExpenseBasicInfo control={form.control} />
        <ExpenseAdditionalDetails control={form.control} />
        <ExpenseAttachmentUpload
          control={form.control}
          imagePreview={imagePreview}
          uploadingImage={uploadingImage}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          onRemoveImage={removeImage}
        />
        <ExpenseFormActions loading={loading} uploadingImage={uploadingImage} isEditing={formIsEditing} />
      </form>
    </Form>
  )
}
