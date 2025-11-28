"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Newspaper, User, Calendar, FileText, Clock, Activity, Settings } from "lucide-react"
import { NewsTableControls } from "./components/NewsTableControls"
import { NewsTableDialogs } from "./components/NewsTableDialogs"
import { NewsTablePagination } from "./components/NewsTablePagination"
import { NewsTableRow } from "./components/NewsTableRow"
import { useNewsTable } from "./hooks/useNewsTable"

export function NewsTable() {
    const {
        news,
        loading,
        searchTerm,
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        startIndex,
        endIndex,
        deleteDialogOpen,
        setSearchTerm,
        setCurrentPage,
        setItemsPerPage,
        setDeleteDialogOpen,
        handleDelete,
        confirmDelete,
        refreshData,
    } = useNewsTable()

    return (
        <div className="h-full flex flex-col space-y-4">
            <NewsTableControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={refreshData}
            />

            <div className="flex-1 rounded-lg border border-border overflow-hidden shadow-md">
                <div className="h-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted hover:bg-muted">
                                <TableHead className="text-foreground font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="h-4 w-4" />
                                        <span>Tipo</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-foreground font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Activity className="h-4 w-4" />
                                        <span>Categoría</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-foreground font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Newspaper className="h-4 w-4" />
                                        <span>Título</span>
                                    </div>
                                </TableHead>
                                <TableHead className="hidden md:table-cell text-foreground font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-4 w-4" />
                                        <span>Cliente / Vehículo</span>
                                    </div>
                                </TableHead>
                                <TableHead className="hidden lg:table-cell text-foreground font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        <span>Fechas</span>
                                    </div>
                                </TableHead>
                                <TableHead className="hidden xl:table-cell text-foreground font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>Días / Cuotas</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-foreground font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Activity className="h-4 w-4" />
                                        <span>Estado</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-right text-foreground font-medium">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <Settings className="h-4 w-4" />
                                        <span>Acciones</span>
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <TableRow
                                        key={`skeleton-${index}`}
                                        className="border-border hover:bg-muted/50"
                                    >
                                        <TableCell>
                                            <Skeleton className="h-5 w-[100px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-[100px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-[150px]" />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Skeleton className="h-5 w-[120px]" />
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <Skeleton className="h-5 w-[100px]" />
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            <Skeleton className="h-5 w-[80px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-[60px]" />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {Array.from({ length: 2 }).map((_, i) => (
                                                    <Skeleton
                                                        key={`action-skeleton-${index}-${i}`}
                                                        className="h-8 w-8 rounded-md"
                                                    />
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : news.length === 0 ? (
                                <TableRow className="border-border">
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Newspaper className="h-10 w-10 text-muted-foreground/30" />
                                            <p className="text-sm">
                                                No se encontraron novedades
                                            </p>
                                            {searchTerm && (
                                                <Button
                                                    variant="link"
                                                    onClick={() => setSearchTerm("")}
                                                    className="text-primary"
                                                >
                                                    Limpiar búsqueda
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                news.map((item) => (
                                    <NewsTableRow
                                        key={item.id}
                                        news={item}
                                        onDelete={handleDelete}
                                        onRefresh={refreshData}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {!loading && totalItems > 0 && (
                <NewsTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            )}

            <NewsTableDialogs
                deleteDialogOpen={deleteDialogOpen}
                onDeleteDialogChange={setDeleteDialogOpen}
                onConfirmDelete={confirmDelete}
            />
        </div>
    )
}
