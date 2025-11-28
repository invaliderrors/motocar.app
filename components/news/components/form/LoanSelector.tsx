"use client"

import { UseFormReturn } from "react-hook-form"
import { Loan } from "@/lib/types"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Loader2, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { NewsFormValues } from "../../hooks/form"

interface LoanSelectorProps {
    form: UseFormReturn<NewsFormValues>
    loans: Loan[]
    loadingLoans: boolean
    loanSearchOpen: boolean
    setLoanSearchOpen: (open: boolean) => void
}

export function LoanSelector({
    form,
    loans,
    loadingLoans,
    loanSearchOpen,
    setLoanSearchOpen,
}: LoanSelectorProps) {
    return (
        <FormField
            control={form.control}
            name="loanId"
            render={({ field }) => {
                const selectedLoan = loans.find(loan => loan.id === field.value)
                return (
                    <FormItem className="flex flex-col flex-1 space-y-2">
                        <FormLabel>Contrato</FormLabel>
                        <Popover open={loanSearchOpen} onOpenChange={setLoanSearchOpen} modal={true}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={loanSearchOpen}
                                        disabled={loadingLoans}
                                        className={cn(
                                            "w-full justify-between h-10",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {loadingLoans ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : selectedLoan ? (
                                            <span className="truncate">
                                                {selectedLoan.vehicle?.plate} - {selectedLoan.user?.name}
                                            </span>
                                        ) : (
                                            "Buscar placa..."
                                        )}
                                        <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[350px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Buscar por placa o nombre..." />
                                    <CommandList>
                                        <CommandEmpty>No encontrado.</CommandEmpty>
                                        <CommandGroup>
                                            {loans.map((loan) => (
                                                <CommandItem
                                                    key={loan.id}
                                                    value={`${loan.vehicle?.plate || ""} ${loan.user?.name || ""}`}
                                                    onSelect={() => {
                                                        field.onChange(loan.id)
                                                        setLoanSearchOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            field.value === loan.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <span className="font-medium mr-2">{loan.vehicle?.plate || "N/A"}</span>
                                                    <span className="text-muted-foreground text-sm truncate">
                                                        {loan.user?.name || "Sin nombre"}
                                                    </span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    )
}
