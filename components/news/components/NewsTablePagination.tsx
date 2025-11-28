"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface NewsTablePaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    startIndex: number
    endIndex: number
    onPageChange: (page: number) => void
    onItemsPerPageChange: (value: number) => void
}

export function NewsTablePagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex,
    onPageChange,
    onItemsPerPageChange,
}: NewsTablePaginationProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 text-blue-300/70">
            <div className="flex items-center gap-2">
                <span className="text-sm">Filas por página:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
                    <SelectTrigger className="w-[80px] h-8 bg-dark-blue-800/50 border-dark-blue-700/50 text-blue-300">
                        <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-blue-800 border-dark-blue-700 text-white">
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-center text-sm">
                <p>
                    Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} novedades
                </p>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-dark-blue-800/50 border-dark-blue-700/50 text-blue-300 hover:bg-dark-blue-700/70 disabled:opacity-50"
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
                    className="h-8 w-8 bg-dark-blue-800/50 border-dark-blue-700/50 text-blue-300 hover:bg-dark-blue-700/70 disabled:opacity-50"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Página anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Página anterior</span>
                </Button>

                <div className="flex items-center mx-2">
                    <span className="text-sm font-medium">
                        Página {currentPage} de {totalPages || 1}
                    </span>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-dark-blue-800/50 border-dark-blue-700/50 text-blue-300 hover:bg-dark-blue-700/70 disabled:opacity-50"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    title="Página siguiente"
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Página siguiente</span>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-dark-blue-800/50 border-dark-blue-700/50 text-blue-300 hover:bg-dark-blue-700/70 disabled:opacity-50"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    title="Última página"
                >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Última página</span>
                </Button>
            </div>
        </div>
    )
}
