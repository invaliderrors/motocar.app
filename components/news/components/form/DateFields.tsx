"use client"

import { useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { NewsFormValues } from "../../hooks/form"
import { NewsCategory } from "@/lib/types"
import { DateModeSelector } from "./DateModeSelector"
import { SingleDateField } from "./SingleDateField"
import { RangeDateFields } from "./RangeDateFields"
import { MultipleDatesField } from "./MultipleDatesField"
import { RecurringDateFields } from "./RecurringDateFields"
import { WeekdaySkipFields } from "./WeekdaySkipFields"

interface DateFieldsProps {
    form: UseFormReturn<NewsFormValues>
}

export function DateFields({ form }: DateFieldsProps) {
    const dateSelectionMode = form.watch("dateSelectionMode")
    const category = form.watch("category")

    // Auto-select weekday mode when WEEKLY_SKIP category is selected
    useEffect(() => {
        if (category === NewsCategory.WEEKLY_SKIP && dateSelectionMode !== "weekday") {
            form.setValue("dateSelectionMode", "weekday")
        }
    }, [category, dateSelectionMode, form])

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

                {dateSelectionMode === "weekday" && (
                    <WeekdaySkipFields form={form} />
                )}
            </div>
        </div>
    )
}
