"use client"
import type React from "react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, CalendarIcon, AlertTriangle, CheckCircle, Clock, Loader2, Paperclip, X, FileText, ImageIcon, File } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Control } from "react-hook-form"

// Payment coverage response type from API
interface PaymentCoverageResponse {
    loanId: string
    dailyRate: number
    loanStartDate: string
    lastCoveredDate: string
    paymentAmount: number
    daysCovered: number
    coverageStartDate: string
    coverageEndDate: string
    isLate: boolean
    latePaymentDate: string | null
    daysBehind: number
    amountNeededToCatchUp: number
    willBeCurrentAfterPayment: boolean
    daysAheadAfterPayment: number
}

interface FileAttachmentProps {
    selectedFile: File | null
    filePreview: string | null
    uploadProgress: number
    isUploading: boolean
    fileInputRef: React.RefObject<HTMLInputElement | null>
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRemoveFile: () => void
}

interface PaymentDetailsCardProps {
    control: Control<any>
    paymentCoverage?: PaymentCoverageResponse | null
    loadingCoverage?: boolean
    fileAttachment?: FileAttachmentProps
}

export function PaymentDetailsCard({ control, paymentCoverage, loadingCoverage, fileAttachment }: PaymentDetailsCardProps) {
    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    // Determine payment status from coverage
    const isLate = paymentCoverage?.isLate ?? false
    const isAdvance = paymentCoverage ? (paymentCoverage.daysAheadAfterPayment > 0 && !paymentCoverage.isLate) : false
    const isOnTime = paymentCoverage ? (!paymentCoverage.isLate && paymentCoverage.daysAheadAfterPayment <= 0) : false

    const getFileIcon = (file: File) => {
        if (file.type.startsWith("image/")) {
            return <ImageIcon className="h-4 w-4 text-blue-500" />
        } else if (file.type === "application/pdf") {
            return <FileText className="h-4 w-4 text-red-500" />
        } else {
            return <File className="h-4 w-4 text-gray-500" />
        }
    }

    return (
        <Card className="border-primary/20 shadow-sm">
            <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Detalles del Pago
                </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-3">
                        {/* Payment Coverage Info Card */}
                        {(paymentCoverage || loadingCoverage) && (
                            <div className={`rounded-lg border p-2 ${
                                loadingCoverage 
                                    ? 'bg-muted/50 border-muted' 
                                    : isLate 
                                        ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800' 
                                        : isAdvance
                                            ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                                            : 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                            }`}>
                                {loadingCoverage ? (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span className="text-xs">Calculando...</span>
                                    </div>
                                ) : paymentCoverage && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                {isLate ? (
                                                    <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                                                ) : isAdvance ? (
                                                    <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                                                ) : (
                                                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                                )}
                                                <span className={`font-medium text-xs ${
                                                    isLate 
                                                        ? 'text-red-700 dark:text-red-400' 
                                                        : isAdvance
                                                            ? 'text-blue-700 dark:text-blue-400'
                                                            : 'text-green-700 dark:text-green-400'
                                                }`}>
                                                    {isLate 
                                                        ? `${paymentCoverage.daysBehind} día(s) atrasado` 
                                                        : isAdvance
                                                            ? `${Math.floor(paymentCoverage.daysAheadAfterPayment)} día(s) adelantado`
                                                            : 'Al día'
                                                    }
                                                </span>
                                            </div>
                                            <Badge variant={isLate ? "destructive" : isAdvance ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                                                {paymentCoverage.daysCovered.toFixed(1)} días
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex justify-between text-[10px] text-muted-foreground">
                                            <span>Cuota: {formatCurrency(paymentCoverage.dailyRate)}</span>
                                            <span>
                                                {format(new Date(paymentCoverage.coverageStartDate), "dd MMM", { locale: es })} - {format(new Date(paymentCoverage.coverageEndDate), "dd MMM", { locale: es })}
                                            </span>
                                        </div>

                                        {isLate && paymentCoverage.amountNeededToCatchUp > 0 && (
                                            <div className="text-[10px] text-red-700 dark:text-red-400 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>Al día: {formatCurrency(paymentCoverage.amountNeededToCatchUp)}</span>
                                                {paymentCoverage.willBeCurrentAfterPayment && <span className="text-green-600 ml-1">✓</span>}
                                            </div>
                                        )}

                                        {isAdvance && (
                                            <div className="text-[10px] text-blue-700 dark:text-blue-400">
                                                🚀 Hasta el {format(new Date(paymentCoverage.coverageEndDate), "dd MMM", { locale: es })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                {/* Amount field - GPS is auto-calculated */}
                <FormField
                    control={control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-xs">Monto Total</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <span className="absolute left-2 top-2 text-muted-foreground text-sm">$</span>
                                    <Input
                                        type="text"
                                        className="pl-6 h-8 text-sm"
                                        value={field.value ? field.value.toLocaleString() : ""}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^\d]/g, "")
                                            field.onChange(value ? Number.parseInt(value) : 0)
                                        }}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Method and Date row */}
                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        control={control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">Método</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-8 text-sm">
                                            <SelectValue placeholder="Método" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="CASH">Efectivo</SelectItem>
                                        <SelectItem value="TRANSACTION">Transferencia</SelectItem>
                                        <SelectItem value="CARD">Tarjeta</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="paymentDate"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">Fecha</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={`w-full pl-2 text-left font-normal h-8 text-sm ${!field.value && "text-muted-foreground"}`}
                                            >
                                                {field.value ? format(field.value, "dd/MM/yy", { locale: es }) : <span>Fecha</span>}
                                                <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={(date) => {
                                                field.onChange(date)
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Notes */}
                <FormField
                    control={control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-xs">Notas (opcional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Notas..."
                                    className="resize-none min-h-[50px] text-sm"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* File Attachment */}
                {fileAttachment && (
                    <div className="space-y-1">
                        <FormLabel className="text-xs">Adjuntar archivo</FormLabel>
                        <div
                            className="border border-dashed rounded-md p-2 text-center cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
                            onClick={() => fileAttachment.fileInputRef.current?.click()}
                        >
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs">Adjuntar (máx 5MB)</span>
                            <input
                                type="file"
                                ref={fileAttachment.fileInputRef}
                                className="hidden"
                                onChange={fileAttachment.onFileChange}
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                            />
                        </div>
                        {(fileAttachment.selectedFile || fileAttachment.filePreview) && (
                            <div className="bg-muted/30 rounded-md p-2 relative">
                                <div className="flex items-center gap-2">
                                    {fileAttachment.filePreview ? (
                                        <div className="h-8 w-8 rounded overflow-hidden border">
                                            <img
                                                src={fileAttachment.filePreview || "/placeholder.svg"}
                                                alt="Vista previa"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-8 w-8 rounded bg-background flex items-center justify-center border">
                                            {fileAttachment.selectedFile && getFileIcon(fileAttachment.selectedFile)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">
                                            {fileAttachment.selectedFile ? fileAttachment.selectedFile.name : "Archivo adjunto"}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {fileAttachment.selectedFile ? `${(fileAttachment.selectedFile.size / 1024).toFixed(1)} KB` : "Archivo existente"}
                                        </p>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={fileAttachment.onRemoveFile}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                                {fileAttachment.isUploading && (
                                    <div className="mt-1">
                                        <Progress value={fileAttachment.uploadProgress} className="h-1" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
