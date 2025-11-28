"use client"

import type React from "react"
import { FormLabel, FormDescription } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Paperclip, X, FileText, ImageIcon, File } from "lucide-react"

interface FileAttachmentSectionProps {
    selectedFile: File | null
    filePreview: string | null
    uploadProgress: number
    isUploading: boolean
    fileInputRef: React.RefObject<HTMLInputElement | null>
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRemoveFile: () => void
    compact?: boolean
}

export function FileAttachmentSection({
    selectedFile,
    filePreview,
    uploadProgress,
    isUploading,
    fileInputRef,
    onFileChange,
    onRemoveFile,
    compact = false,
}: FileAttachmentSectionProps) {
    const getFileIcon = (file: File) => {
        if (file.type.startsWith("image/")) {
            return <ImageIcon className="h-5 w-5 text-blue-500" />
        } else if (file.type === "application/pdf") {
            return <FileText className="h-5 w-5 text-red-500" />
        } else {
            return <File className="h-5 w-5 text-gray-500" />
        }
    }

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <FormLabel className="text-sm">Adjuntar archivo</FormLabel>
                {!compact && <FormDescription className="text-[10px]">Máximo 5MB</FormDescription>}
            </div>
            <div className="flex flex-col gap-2">
                <div
                    className={`border-2 border-dashed rounded-md text-center cursor-pointer hover:bg-muted/50 transition-colors ${compact ? 'p-2' : 'p-3'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Paperclip className={`mx-auto text-muted-foreground ${compact ? 'h-4 w-4' : 'h-5 w-5 mb-1'}`} />
                    {!compact && (
                        <>
                            <p className="text-xs font-medium">Haga clic para seleccionar un archivo</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">o arrastre y suelte aquí</p>
                        </>
                    )}
                    {compact && <p className="text-xs font-medium inline ml-2">Adjuntar (máx 5MB)</p>}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={onFileChange}
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    />
                </div>
                {(selectedFile || filePreview) && (
                    <div className="bg-muted/30 rounded-md p-2 relative">
                        <div className="flex items-center gap-2">
                            {filePreview ? (
                                <div className="h-10 w-10 rounded-md overflow-hidden border">
                                    <img
                                        src={filePreview || "/placeholder.svg"}
                                        alt="Vista previa"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-10 w-10 rounded-md bg-background flex items-center justify-center border">
                                    {selectedFile && getFileIcon(selectedFile)}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{selectedFile ? selectedFile.name : "Archivo adjunto"}</p>
                                <p className="text-[10px] text-muted-foreground">
                                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Archivo existente"}
                                </p>
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={onRemoveFile}>
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        {isUploading && (
                            <div className="mt-1">
                                <Progress value={uploadProgress} className="h-[3px]" />
                                <p className="text-[10px] text-right mt-0.5 text-muted-foreground">{uploadProgress}%</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
