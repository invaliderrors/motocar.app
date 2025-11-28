"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Download, X } from "lucide-react"
import { useState, useEffect } from "react"

interface PdfViewerDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    pdfUrl: string | null
    title?: string
}

export function PdfViewerDialog({
    isOpen,
    onOpenChange,
    pdfUrl,
    title = "Vista previa del recibo",
}: PdfViewerDialogProps) {
    const [iframeKey, setIframeKey] = useState(0)

    // Reset iframe when URL changes to force reload
    useEffect(() => {
        if (pdfUrl) {
            setIframeKey((prev) => prev + 1)
        }
    }, [pdfUrl])

    const handlePrint = () => {
        if (pdfUrl) {
            const printWindow = window.open(pdfUrl)
            if (printWindow) {
                printWindow.addEventListener("load", () => {
                    printWindow.print()
                })
            }
        }
    }

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement("a")
            link.href = pdfUrl
            link.download = `recibo-${Date.now()}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    if (!pdfUrl) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>{title}</DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimir
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Cerrar</span>
                        </Button>
                    </div>
                </DialogHeader>
                <div className="flex-1 min-h-[500px] mt-4 bg-white rounded-md overflow-hidden">
                    <iframe key={iframeKey} src={pdfUrl} className="w-full h-full border-0" title="PDF Viewer" />
                </div>
            </DialogContent>
        </Dialog>
    )
}
