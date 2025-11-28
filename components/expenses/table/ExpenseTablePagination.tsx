"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface ExpenseTablePaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    startIndex: number
    endIndex: number
    onPageChange: (page: number) => void
    getPageNumbers: () => (number | string)[]
}

export function ExpenseTablePagination({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    onPageChange,
    getPageNumbers,
}: ExpenseTablePaginationProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
                Mostrando {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} de {totalItems} egresos
            </div>
            <Pagination className="order-1 sm:order-2">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) onPageChange(currentPage - 1)
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    {getPageNumbers().map((page, i) =>
                        page === "ellipsis-start" || page === "ellipsis-end" ? (
                            <PaginationItem key={`ellipsis-${i}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={`page-${page}-${i}`}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onPageChange(page as number)
                                    }}
                                    isActive={currentPage === page}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ),
                    )}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) onPageChange(currentPage + 1)
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
