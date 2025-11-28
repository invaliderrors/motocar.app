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

interface VehicleTablePaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    startIndex: number
    endIndex: number
    onPageChange: (page: number) => void
    getPageNumbers: () => (number | string)[]
}

export function VehicleTablePagination({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    onPageChange,
    getPageNumbers,
}: VehicleTablePaginationProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
                Mostrando {totalItems > 0 ? startIndex : 0}-{endIndex} de {totalItems} vehículos
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

