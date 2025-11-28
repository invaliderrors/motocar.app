import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AttachmentDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    attachmentUrl: string
}

export function AttachmentDialog({ isOpen, onOpenChange, attachmentUrl }: AttachmentDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-dark-blue-900 border-dark-blue-800 text-white max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-blue-100">Comprobante de pago</DialogTitle>
                </DialogHeader>
                {attachmentUrl && (
                    <div className="flex justify-center p-2">
                        <img
                            src={attachmentUrl || "/placeholder.svg"}
                            alt="Comprobante de pago"
                            className="max-h-[70vh] object-contain rounded-md border border-dark-blue-700"
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
