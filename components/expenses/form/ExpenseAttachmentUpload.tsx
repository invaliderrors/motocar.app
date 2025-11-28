"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import type { Control } from "react-hook-form"
import { ExpenseFormValues } from "../hooks/useExpenseForm"

interface ExpenseAttachmentUploadProps {
    control: Control<ExpenseFormValues>
    imagePreview: string | null
    uploadingImage: boolean
    fileInputRef: React.RefObject<HTMLInputElement | null>
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRemoveImage: () => void
}

export function ExpenseAttachmentUpload({
    control,
    imagePreview,
    uploadingImage,
    fileInputRef,
    onFileChange,
    onRemoveImage,
}: ExpenseAttachmentUploadProps) {
    return (
        <FormField
            control={control}
            name="attachmentUrl"
            render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel className="flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Comprobante
                    </FormLabel>
                    <div className="space-y-4">
                        {!imagePreview ? (
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 transition-all hover:border-primary/50">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    className="hidden"
                                    onChange={onFileChange}
                                    ref={fileInputRef}
                                    disabled={uploadingImage}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Subiendo...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Subir comprobante
                                        </>
                                    )}
                                </Button>
                                <p className="text-sm text-muted-foreground">JPG, PNG o WEBP (máx. 5MB)</p>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="relative rounded-lg overflow-hidden border border-border">
                                    <img
                                        src={imagePreview || "/placeholder.svg"}
                                        alt="Comprobante"
                                        className="w-full h-auto max-h-[300px] object-contain"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                        onClick={onRemoveImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground flex items-center">
                                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                    Comprobante adjunto
                                </p>
                            </div>
                        )}
                        <FormDescription className="text-xs">Adjunte una imagen del comprobante de pago (opcional)</FormDescription>
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    )
}
