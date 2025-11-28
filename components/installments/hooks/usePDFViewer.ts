"use client"

import { useState } from "react"

export function usePdfViewer() {
    const [pdfUrl, setPdfUrl] = useState<string>("")
    const [isPdfViewerOpen, setPdfViewerOpen] = useState(false)

    const openPdfViewer = (url: string) => {
        setPdfUrl(url)
        setPdfViewerOpen(true)
    }

    const closePdfViewer = () => {
        setPdfViewerOpen(false)
        // Clean up the URL object when closing to prevent memory leaks
        if (pdfUrl && pdfUrl.startsWith("blob:")) {
            URL.revokeObjectURL(pdfUrl)
            setPdfUrl("")
        }
    }

    return {
        pdfUrl,
        isPdfViewerOpen,
        openPdfViewer,
        setPdfViewerOpen: (open: boolean) => {
            if (!open) closePdfViewer()
            else setPdfViewerOpen(true)
        },
    }
}
