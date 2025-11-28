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

interface LoanTablePaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    startIndex: number
    endIndex: number
    onPageChange: (page: number) => void
}

export function LoanTablePagination({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    onPageChange,
}: LoanTablePaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisiblePages = 5
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            let startPage = Math.max(2, currentPage - 1)
            let endPage = Math.min(totalPages - 1, currentPage + 1)
            if (currentPage <= 3) endPage = Math.min(totalPages - 1, 4)
            else if (currentPage >= totalPages - 2) startPage = Math.max(2, totalPages - 3)
            if (startPage > 2) pages.push("ellipsis-start")
            for (let i = startPage; i <= endPage; i++) pages.push(i)
            if (endPage < totalPages - 1) pages.push("ellipsis-end")
            pages.push(totalPages)
        }
        return pages
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
                Mostrando {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} de {totalItems} contratos
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
