"use client"

import { Table, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { StoreTableHeader } from "./components/table-header"
import { StoreTableRow } from "./components/table-row"
import { LoadingRow } from "./components/loading-row"
import { EmptyState } from "./components/empty-state"
import { SearchFilters } from "./components/search-filters"
import { Pagination } from "./components/pagination"
import { DeleteDialog } from "./components/dialogs/delete"
import { SuccessDialog } from "./components/dialogs/success"
import { FilterSummary } from "./components/filter-summary"
import { StoreFormDialog } from "./StoreFormDialog"
import { useStoreActions } from "./hooks/useStoreActions"
import { useStoreManagement } from "./hooks/useStoreManagement"
import { CreateStoreDto, UpdateStoreDto } from "@/lib/services/store.service"
import { useState, useMemo } from "react"
import { Store, StoreStatus } from "@/lib/types"

type SortField = "name" | "code" | "city" | "status"
type SortDirection = "asc" | "desc"

interface StoreTableProps {
    onRefresh?: (refreshFn: () => void) => void
}

export function StoreTable({ onRefresh }: StoreTableProps) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
    
    // Filter and pagination state
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [sortField, setSortField] = useState<SortField>("name")
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(15)

    const {
        stores,
        isLoading: loading,
        loadStores,
        createStore,
        updateStore,
        deleteStore,
    } = useStoreManagement()

    const {
        editingStore,
        setEditingStore,
        deleteConfirmation,
        setDeleteConfirmation,
        isDeleting,
        handleEdit,
        handleDelete,
        confirmDelete,
    } = useStoreActions(loadStores)

    // Client-side filtering
    const filteredStores = useMemo(() => {
        let filtered = [...stores]

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (store) =>
                    store.name.toLowerCase().includes(term) ||
                    store.code.toLowerCase().includes(term) ||
                    store.city.toLowerCase().includes(term) ||
                    (store.nit && store.nit.toLowerCase().includes(term))
            )
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter((store) => store.status === statusFilter)
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0

            if (sortField === "name") {
                comparison = a.name.localeCompare(b.name)
            } else if (sortField === "code") {
                comparison = a.code.localeCompare(b.code)
            } else if (sortField === "city") {
                comparison = a.city.localeCompare(b.city)
            } else if (sortField === "status") {
                comparison = a.status.localeCompare(b.status)
            }

            return sortDirection === "asc" ? comparison : -comparison
        })

        return filtered
    }, [stores, searchTerm, statusFilter, sortField, sortDirection])

    // Client-side pagination
    const totalItems = filteredStores.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const paginatedStores = filteredStores.slice(indexOfFirstItem, indexOfLastItem)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const resetFilters = () => {
        setSearchTerm("")
        setSortField("name")
        setSortDirection("asc")
        setStatusFilter(null)
        setCurrentPage(1)
    }

    const hasActiveFilters = !!(searchTerm || statusFilter !== null)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value)
        setCurrentPage(1)
    }

    const handleOpenCreateDialog = () => {
        setEditingStore(null)
        setIsFormOpen(true)
    }

    const handleEditClick = (store: Store) => {
        setEditingStore(store)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (data: CreateStoreDto | UpdateStoreDto) => {
        try {
            if (editingStore) {
                await updateStore(editingStore.id, data as UpdateStoreDto)
                setSuccessMessage("Punto actualizado correctamente")
            } else {
                await createStore(data as CreateStoreDto)
                setSuccessMessage("Punto creada correctamente")
            }
            setIsSuccessDialogOpen(true)
            setIsFormOpen(false)
        } catch (error) {
            console.error("Error al guardar el punto:", error)
        }
    }

    const handleConfirmDelete = async () => {
        if (!deleteConfirmation) return

        await confirmDelete(async (store) => {
            await deleteStore(store)
        })
    }

    return (
        <>
            <div className="h-full flex flex-col space-y-4">
                <SearchFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    onResetFilters={resetFilters}
                    onRefresh={loadStores}
                    hasActiveFilters={hasActiveFilters}
                    actionButton={
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-1"
                            onClick={handleOpenCreateDialog}
                        >
                            <PlusCircle className="h-4 w-4" />
                            Nuevo Punto
                        </Button>
                    }
                />

                <div className="flex-1 rounded-lg border border-border overflow-hidden shadow-md">
                    <div className="h-full overflow-auto">
                        <Table>
                            <StoreTableHeader sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, index) => <LoadingRow key={index} />)
                                ) : filteredStores.length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    paginatedStores.map((store) => (
                                        <StoreTableRow
                                            key={store.id}
                                            store={store}
                                            onEdit={handleEditClick}
                                            onDelete={handleDelete}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {!loading && filteredStores.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        visibleItems={filteredStores.length}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        indexOfFirstItem={indexOfFirstItem}
                        indexOfLastItem={indexOfLastItem}
                    />
                )}

                <FilterSummary statusFilter={statusFilter} totalFiltered={totalItems} totalItems={stores.length} />
            </div>

            {/* Dialogs */}
            <DeleteDialog
                store={deleteConfirmation}
                isOpen={!!deleteConfirmation}
                onOpenChange={(open) => !open && setDeleteConfirmation(null)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />

            <SuccessDialog isOpen={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen} message={successMessage} />

            {/* Store Form Dialog */}
            <StoreFormDialog
                open={isFormOpen}
                store={editingStore}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingStore(null)
                }}
                onSubmit={handleFormSubmit}
            />
        </>
    )
}
