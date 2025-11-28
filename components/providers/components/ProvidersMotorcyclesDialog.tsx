"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bike, Palette, Gauge, Navigation } from "lucide-react"
import type { Provider } from "@/lib/types"

interface ProviderMotorcyclesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    provider: Provider | null
}

export function ProviderMotorcyclesDialog({ open, onOpenChange, provider }: ProviderMotorcyclesDialogProps) {
    if (!provider) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Bike className="h-5 w-5" />
                        Motocicletas de {provider.name}
                    </DialogTitle>
                    <DialogDescription>
                        Lista completa de motocicletas asociadas a este proveedor ({provider.motorcylces?.length || 0} motocicletas)
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[60vh]">
                    {provider.motorcylces && provider.motorcylces.length > 0 ? (
                        <div className="rounded-lg border border-blue-100 dark:border-blue-900/30 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-50 dark:bg-blue-950/30">
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium">Marca/Modelo</TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium">Placa</TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium">Color</TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium">CC</TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium">GPS</TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium">Motor</TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium">Chasis</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {provider.motorcylces.map((motorcycle) => (
                                        <TableRow key={motorcycle.id} className="border-blue-100 dark:border-blue-900/30">
                                            <TableCell>
                                                <div className="font-medium">
                                                    <div className="text-sm font-semibold">{motorcycle.brand}</div>
                                                    <div className="text-xs text-muted-foreground">{motorcycle.model}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                                >
                                                    {motorcycle.plate}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <Palette className="h-3 w-3 text-purple-500" />
                                                    <span className="text-sm">{motorcycle.color || "—"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <Gauge className="h-3 w-3 text-orange-500" />
                                                    <span className="text-sm">{motorcycle.cc ? `${motorcycle.cc} cc` : "—"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {motorcycle.gps ? (
                                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                        <Navigation className="h-3 w-3 mr-1" />
                                                        {motorcycle.gps}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-gray-500 dark:text-gray-400">
                                                        Sin GPS
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-mono text-xs bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded border">
                                                    {motorcycle.engine}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-mono text-xs bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded border">
                                                    {motorcycle.chassis}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                            <Bike className="h-12 w-12 mb-4 text-blue-300/50 dark:text-blue-700/30" />
                            <p className="text-sm">No hay motocicletas registradas para este proveedor</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30"
                    >
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
