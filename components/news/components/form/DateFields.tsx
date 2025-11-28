"use client"

import { UseFormReturn } from "react-hook-form"
import { NewsFormValues } from "../../hooks/form"
import { DateModeSelector } from "./DateModeSelector"
import { SingleDateField } from "./SingleDateField"
import { RangeDateFields } from "./RangeDateFields"
import { MultipleDatesField } from "./MultipleDatesField"
import { RecurringDateFields } from "./RecurringDateFields"

interface DateFieldsProps {
    form: UseFormReturn<NewsFormValues>
}

export function DateFields({ form }: DateFieldsProps) {
    const dateSelectionMode = form.watch("dateSelectionMode")

    return (
        <div className="space-y-4">
            {/* Date Mode Selector */}
            <DateModeSelector form={form} />

            {/* Conditional Date Fields based on mode */}
            <div className="p-4 border rounded-lg bg-muted/30">
                {dateSelectionMode === "single" && (
                    <SingleDateField form={form} />
                )}

                {dateSelectionMode === "range" && (
                    <RangeDateFields form={form} />
                )}

                {dateSelectionMode === "multiple" && (
                    <MultipleDatesField form={form} />
                )}

                {dateSelectionMode === "recurring" && (
                    <RecurringDateFields form={form} />
                )}
            </div>
        </div>
    )
}
