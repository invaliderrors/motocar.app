"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    itemsPerPage: string
    totalItems: number
    onPageChange: (page: number) => void
    onItemsPerPageChange: (value: string) => void
}

// Fixed getPageNumbers function to avoid duplicates
const getPageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
        // Show all pages if total pages is less than or equal to max visible pages
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i)
        }
    } else if (currentPage <= 3) {
        // Show first pages
        for (let i = 1; i <= Math.min(4, totalPages); i++) {
            pages.push(i)
        }
        if (totalPages > 4) {
            pages.push("ellipsis-end")
            pages.push(totalPages)
        }
    } else if (currentPage >= totalPages - 2) {
        // Show last pages
        pages.push(1)
        if (totalPages > 4) {
            pages.push("ellipsis-start")
        }
        for (let i = Math.max(totalPages - 3, 2); i <= totalPages; i++) {
            pages.push(i)
        }
    } else {
        // Show middle pages
        pages.push(1)
        pages.push("ellipsis-start")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i)
        }
        pages.push("ellipsis-end")
        pages.push(totalPages)
    }

    return pages
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
}) => {
    const itemsPerPageNumber = Number.parseInt(itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPageNumber
    const indexOfFirstItem = indexOfLastItem - itemsPerPageNumber

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                    Mostrando {totalItems > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, totalItems)} de {totalItems}{" "}
                    registros
                </p>
                <Select value={itemsPerPage} onValueChange={onItemsPerPageChange}>
                    <SelectTrigger className="w-[70px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                        <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">por página</p>
            </div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    {getPageNumbers(currentPage, totalPages).map((n, idx) =>
                        typeof n === "string" ? (
                            <PaginationItem key={`${n}-${idx}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={`page-${n}-${idx}`}>
                                <PaginationLink isActive={currentPage === n} onClick={() => onPageChange(n)}>
                                    {n}
                                </PaginationLink>
                            </PaginationItem>
                        ),
                    )}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                            className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
