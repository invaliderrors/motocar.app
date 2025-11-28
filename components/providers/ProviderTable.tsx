"use client"

import { useState, useEffect } from "react"
import { Table, TableBody } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ProviderSummaryCards } from "./components/ProviderSummaryCards"
import { useProviders } from "./hooks/useProviders"
import { useProviderTable } from "./hooks/useProviderTable"
import { ProviderDeleteDialog } from "./ProviderDeleteDialog"
import { ProviderTableControls } from "./table/ProviderTableControls"
import { ProviderTableEmptyState } from "./table/ProviderTableEmptyState"
import { ProviderTableHeaders } from "./table/ProviderTableHeaders"
import { ProviderTablePagination } from "./table/ProviderTablePagination"
import { ProviderTableRow } from "./table/ProviderTableRow"
import { ProviderTableSkeleton } from "./table/ProviderTableSkeleton"
import { ProviderDetailsModal } from "./ProviderDetailsModal"
import { providerStatsService } from "@/lib/services/provider-stats.service"
import type { ProviderStats } from "@/lib/types"

export function ProviderTable() {
    const { providers: allProviders, loading: allProvidersLoading } = useProviders()
    const [providerStats, setProviderStats] = useState<ProviderStats[]>([])
    const [statsLoading, setStatsLoading] = useState(false)
    const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)

    const {
        providers,
        loading,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        deleteDialogOpen,
        setDeleteDialogOpen,
        handleProviderCreated,
        handleDelete,
        confirmDelete,
        refreshProviders,
        exportToCSV,
        createProvider,
        updateProvider,
        totalItems,
        totalPages,
        startIndex,
        endIndex,
        getPageNumbers,
    } = useProviderTable()

    useEffect(() => {
        loadProviderStats()
    }, [])

    const loadProviderStats = async () => {
        setStatsLoading(true)
        try {
            const stats = await providerStatsService.getProvidersStats()
            setProviderStats(stats)
        } catch (error) {
            console.error("Error loading provider stats:", error)
        } finally {
            setStatsLoading(false)
        }
    }

    const handleViewDetails = (providerId: string) => {
        setSelectedProviderId(providerId)
        setDetailsModalOpen(true)
    }

    const getProviderStats = (providerId: string) => {
        return providerStats.find(stat => stat.id === providerId)
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <Card className="bg-card border-border shadow-md flex-1 flex flex-col overflow-hidden">
                <CardContent className="p-6 flex-1 flex flex-col overflow-hidden">
                    <div className="space-y-6 h-full flex flex-col">
                        <ProviderTableControls
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            setCurrentPage={setCurrentPage}
                            onProviderCreated={handleProviderCreated}
                            createProvider={createProvider}
                            updateProvider={updateProvider}
                            onRefresh={() => {
                                refreshProviders()
                                loadProviderStats()
                            }}
                            onExport={exportToCSV}
                        />

                        <div className="flex-1 rounded-lg border border-blue-100 dark:border-blue-900/30 overflow-hidden">
                            <div className="overflow-auto h-full">
                                <Table>
                                    <ProviderTableHeaders />
                                    <TableBody>
                                        {loading || statsLoading ? (
                                            <ProviderTableSkeleton />
                                        ) : providers.length === 0 ? (
                                            <ProviderTableEmptyState searchTerm={searchTerm} onClearSearch={() => setSearchTerm("")} />
                                        ) : (
                                            providers.map((provider, index) => (
                                                <ProviderTableRow
                                                    key={`provider-row-${provider.id}-${index}`}
                                                    provider={provider}
                                                    stats={getProviderStats(provider.id)}
                                                    index={index}
                                                    onEdit={handleProviderCreated}
                                                    onDelete={handleDelete}
                                                    onViewDetails={handleViewDetails}
                                                    createProvider={createProvider}
                                                    updateProvider={updateProvider}
                                                />
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <ProviderTablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            startIndex={startIndex}
                            endIndex={endIndex}
                            onPageChange={setCurrentPage}
                            getPageNumbers={getPageNumbers}
                        />
                    </div>
                </CardContent>

                <ProviderDeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={confirmDelete} />
            </Card>

            <ProviderDetailsModal 
                providerId={selectedProviderId} 
                open={detailsModalOpen} 
                onOpenChange={setDetailsModalOpen} 
            />
        </div>
    )
}
