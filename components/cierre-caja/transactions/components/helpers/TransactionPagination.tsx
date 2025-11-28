"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface TransactionPaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    indexOfFirstItem: number
    indexOfLastItem: number
    onPageChange: (page: number) => void
}

export function TransactionPagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    indexOfFirstItem,
    indexOfLastItem,
    onPageChange,
}: TransactionPaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers: number[] = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than or equal to max visible pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else if (currentPage <= 3) {
            // Show first 5 pages if current page is near the beginning
            for (let i = 1; i <= maxVisiblePages; i++) {
                pageNumbers.push(i)
            }
        } else if (currentPage >= totalPages - 2) {
            // Show last 5 pages if current page is near the end
            for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Show current page and 2 pages before and after
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                pageNumbers.push(i)
            }
        }

        return pageNumbers
    }

    if (totalPages <= 1) {
        return (
            <div className="flex justify-center items-center pt-2 text-sm text-muted-foreground">
                Mostrando {totalItems} de {totalItems} transacciones
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 text-sm">
            <div className="text-muted-foreground">
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} de {totalItems} transacciones
            </div>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white dark:bg-slate-950"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    title="Primera página"
                >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">Primera página</span>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white dark:bg-slate-950"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Página anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Página anterior</span>
                </Button>
                <div className="flex items-center gap-1 mx-2">
                    {getPageNumbers().map((pageNumber, index) => (
                        <Button
                            key={`page-${pageNumber}-${index}`}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="icon"
                            className={`h-8 w-8 ${currentPage !== pageNumber ? "bg-white dark:bg-slate-950" : ""}`}
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber}
                        </Button>
                    ))}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white dark:bg-slate-950"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Página siguiente"
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Página siguiente</span>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white dark:bg-slate-950"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    title="Última página"
                >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Última página</span>
                </Button>
            </div>
        </div>
    )
}
