"use client"

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DollarSign, RefreshCw, FileSpreadsheet, Calendar, BarChart3 } from "lucide-react"

interface LoanTableHeaderProps {
    onRefresh: () => void
    onExportCSV: () => void
}

export function LoanTableHeader({ onRefresh, onExportCSV }: LoanTableHeaderProps) {
    return (
        <CardHeader className="bg-primary text-primary-foreground p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-foreground/20 backdrop-blur-sm p-2 rounded-full shadow-lg">
                        <DollarSign className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">Gestión de arrendamientos</CardTitle>
                        <CardDescription className="text-primary-foreground/80">Administra los arrendamientos y financiamientos</CardDescription>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onRefresh}
                                    className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20 shadow-sm hover:shadow-md transition-all"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Actualizar</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Actualizar datos de la tabla</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onExportCSV}
                                    className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20 shadow-sm hover:shadow-md transition-all"
                                >
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Exportar CSV</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Exportar datos a archivo CSV</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20 shadow-sm hover:shadow-md transition-all"
                                    disabled
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Calendario</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ver calendario de pagos (próximamente)</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20 shadow-sm hover:shadow-md transition-all"
                                    disabled
                                >
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Reportes</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ver reportes detallados (próximamente)</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </CardHeader>
    )
}
