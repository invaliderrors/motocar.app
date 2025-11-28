"use client"

import { News, NewsType } from "@/lib/types"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { useNewsForm, useLoansData } from "../hooks/form"
import {
    TypeSelector,
    CategorySelector,
    LoanSelector,
    TitleField,
    DescriptionFields,
    DateFields,
    DaysPreview,
    FormActions,
} from "./form"

interface NewsFormProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    news?: News | null
}

export function NewsForm({ open, onClose, onSuccess, news }: NewsFormProps) {
    const {
        form,
        loading,
        newsType,
        onSubmit,
        isEditing,
    } = useNewsForm({ news, open, onSuccess })

    const {
        loans,
        loadingLoans,
        loanSearchOpen,
        setLoanSearchOpen,
    } = useLoansData({ open, newsType })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Novedad" : "Nueva Novedad"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Row 1: Type, Category, Contract (if loan-specific) */}
                        <div className="grid grid-cols-3 gap-4">
                            <TypeSelector form={form} />
                            <CategorySelector form={form} newsType={newsType} />
                            {newsType === NewsType.LOAN_SPECIFIC && (
                                <LoanSelector
                                    form={form}
                                    loans={loans}
                                    loadingLoans={loadingLoans}
                                    loanSearchOpen={loanSearchOpen}
                                    setLoanSearchOpen={setLoanSearchOpen}
                                />
                            )}
                        </div>

                        {/* Row 2: Title */}
                        <TitleField form={form} />

                        {/* Row 3: Description and Notes */}
                        <DescriptionFields form={form} />

                        {/* Row 4: Dates */}
                        <DateFields form={form} />

                        {/* Days Preview - shows how many days/installments will be excluded */}
                        <DaysPreview form={form} />

                        {/* Action Buttons */}
                        <FormActions
                            loading={loading}
                            isEditing={isEditing}
                            onClose={onClose}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
