"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { News, NewsType, NewsCategory, Loan, VehicleType } from "@/lib/types"
import { NewsService, CreateNewsDto } from "@/lib/services/news.service"
import { HttpService } from "@/lib/http"
import { useStore } from "@/contexts/StoreContext"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

// Categories for loan-specific news
const LOAN_CATEGORIES = [
    NewsCategory.WORKSHOP,
    NewsCategory.MAINTENANCE,
    NewsCategory.ACCIDENT,
    NewsCategory.THEFT,
]

// Categories for store-wide news
const STORE_CATEGORIES = [
    NewsCategory.DAY_OFF,
    NewsCategory.HOLIDAY,
    NewsCategory.SYSTEM_MAINTENANCE,
    NewsCategory.OTHER,
]

const newsSchema = z.object({
    type: z.nativeEnum(NewsType),
    category: z.nativeEnum(NewsCategory),
    title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    notes: z.string().optional(),
    startDate: z.string().min(1, "La fecha de inicio es requerida"),
    endDate: z.string().optional(),
    isActive: z.boolean().default(true),
    loanId: z.string().optional(),
    vehicleType: z.nativeEnum(VehicleType).optional(),
    autoCalculateInstallments: z.boolean().default(false),
    daysUnavailable: z.number().min(0).optional(),
    installmentsToSubtract: z.number().min(0).optional(),
})

type NewsFormValues = z.infer<typeof newsSchema>

interface NewsFormProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    news?: News | null
}

export function NewsForm({ open, onClose, onSuccess, news }: NewsFormProps) {
    const [loading, setLoading] = useState(false)
    const [loans, setLoans] = useState<Loan[]>([])
    const [loadingLoans, setLoadingLoans] = useState(false)
    const { currentStore } = useStore()
    const { toast } = useToast()

    const form = useForm<NewsFormValues>({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            type: NewsType.LOAN_SPECIFIC,
            category: NewsCategory.WORKSHOP,
            title: "",
            description: "",
            notes: "",
            startDate: new Date().toISOString().split("T")[0],
            endDate: "",
            isActive: true,
            loanId: "",
            vehicleType: undefined,
            autoCalculateInstallments: false,
            daysUnavailable: 0,
            installmentsToSubtract: 0,
        },
    })

    const newsType = form.watch("type")
    const autoCalculate = form.watch("autoCalculateInstallments")
    const daysUnavailable = form.watch("daysUnavailable")

    useEffect(() => {
        if (open && currentStore && newsType === NewsType.LOAN_SPECIFIC) {
            loadLoans()
        }
    }, [open, currentStore, newsType])

    useEffect(() => {
        if (news) {
            form.reset({
                type: news.type,
                category: news.category,
                title: news.title,
                description: news.description,
                notes: news.notes || "",
                startDate: new Date(news.startDate).toISOString().split("T")[0],
                endDate: news.endDate ? new Date(news.endDate).toISOString().split("T")[0] : "",
                isActive: news.isActive,
                loanId: news.loanId || "",
                vehicleType: news.vehicleType || undefined,
                autoCalculateInstallments: news.autoCalculateInstallments,
                daysUnavailable: news.daysUnavailable || 0,
                installmentsToSubtract: news.installmentsToSubtract || 0,
            })
        } else {
            form.reset({
                type: NewsType.LOAN_SPECIFIC,
                category: NewsCategory.WORKSHOP,
                title: "",
                description: "",
                notes: "",
                startDate: new Date().toISOString().split("T")[0],
                endDate: "",
                isActive: true,
                loanId: "",
                vehicleType: undefined,
                autoCalculateInstallments: false,
                daysUnavailable: 0,
                installmentsToSubtract: 0,
            })
        }
    }, [news, open])

    const loadLoans = async () => {
        if (!currentStore) return

        try {
            setLoadingLoans(true)
            const token = document.cookie
                .split("; ")
                .find((c) => c.startsWith("authToken="))
                ?.split("=")[1]

            const response = await HttpService.get<Loan[]>(
                `/api/v1/loans`,
                {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                }
            )
            
            console.log("Loans response:", response)
            const loansData = Array.isArray(response.data) ? response.data : []
            setLoans(loansData)
            
            toast({
                title: "contratos cargados",
                description: `${loansData.length} contratos disponibles`,
            })
        } catch (error: any) {
            console.error("Error loading loans:", error)
            toast({
                variant: "destructive",
                title: "Error al cargar contratos",
                description: error?.message || "No se pudieron cargar los contratos",
            })
        } finally {
            setLoadingLoans(false)
        }
    }

    const onSubmit = async (values: NewsFormValues) => {
        if (!currentStore) return

        try {
            setLoading(true)

            const data: CreateNewsDto = {
                ...values,
                storeId: currentStore.id,
                loanId: values.type === NewsType.LOAN_SPECIFIC ? values.loanId : undefined,
                vehicleType: values.type === NewsType.STORE_WIDE ? values.vehicleType : undefined,
                endDate: values.endDate || undefined,
                notes: values.notes || undefined,
                daysUnavailable: values.daysUnavailable || undefined,
                installmentsToSubtract: values.installmentsToSubtract || undefined,
            }

            if (news) {
                await NewsService.update(news.id, data)
                toast({
                    title: "Novedad actualizada",
                    description: "La novedad ha sido actualizada correctamente",
                })
            } else {
                await NewsService.create(data)
                toast({
                    title: "Novedad creada",
                    description: "La novedad ha sido creada correctamente",
                })
            }

            onSuccess()
        } catch (error) {
            console.error("Error saving news:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo guardar la novedad",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {news ? "Editar Novedad" : "Nueva Novedad"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* SECTION 1: Type and Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">Información General</h3>
                                <p className="text-sm text-muted-foreground">
                                    Tipo y detalles básicos de la novedad
                                </p>
                            </div>

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Novedad</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                // Reset category when type changes
                                                const defaultCategory = value === NewsType.LOAN_SPECIFIC 
                                                    ? NewsCategory.WORKSHOP 
                                                    : NewsCategory.DAY_OFF
                                                form.setValue("category", defaultCategory)
                                            }}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={NewsType.LOAN_SPECIFIC}>
                                                    contrato Específico
                                                </SelectItem>
                                                <SelectItem value={NewsType.STORE_WIDE}>
                                                    Todo el punto
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            {newsType === NewsType.LOAN_SPECIFIC
                                                ? "Afecta solo a un contrato específico (vehículo en taller, accidente, etc.)"
                                                : "Afecta a todo el punto (festivos, días libres, mantenimiento del sistema)"}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {newsType === NewsType.LOAN_SPECIFIC && (
                                <FormField
                                    control={form.control}
                                    name="loanId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>contrato</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={loadingLoans}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={
                                                            loadingLoans 
                                                                ? "Cargando contratos..." 
                                                                : loans.length === 0 
                                                                    ? "No hay contratos disponibles"
                                                                    : "Selecciona un contrato"
                                                        } />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {loans.map((loan) => (
                                                        <SelectItem key={loan.id} value={loan.id}>
                                                            {loan.user?.name || "Sin nombre"} - {loan.vehicle?.plate || "N/A"}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                {loadingLoans && "Cargando contratos..."}
                                                {!loadingLoans && loans.length === 0 && "No hay contratos activos en este punto"}
                                                {!loadingLoans && loans.length > 0 && `${loans.length} contratos disponibles`}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {newsType === NewsType.STORE_WIDE && (
                                <FormField
                                    control={form.control}
                                    name="vehicleType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Vehículo (Opcional)</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    // Allow clearing the selection
                                                    field.onChange(value === "all" ? undefined : value)
                                                }}
                                                value={field.value || "all"}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Todos los vehículos" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos los tipos de vehículos</SelectItem>
                                                    <SelectItem value={VehicleType.MOTORCYCLE}>Motocicleta</SelectItem>
                                                    <SelectItem value={VehicleType.MOTOCAR}>Motocar</SelectItem>
                                                    <SelectItem value={VehicleType.MOTOLOAD}>Motocarga</SelectItem>
                                                    <SelectItem value={VehicleType.OTHER}>Otro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Si no seleccionas un tipo específico, la novedad afectará a todos los contratos activos en el punto.
                                                Si seleccionas un tipo, solo afectará a los contratos con ese tipo de vehículo.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoría</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una categoría" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {newsType === NewsType.LOAN_SPECIFIC ? (
                                                    <>
                                                        <SelectItem value={NewsCategory.WORKSHOP}>Taller</SelectItem>
                                                        <SelectItem value={NewsCategory.MAINTENANCE}>Mantenimiento</SelectItem>
                                                        <SelectItem value={NewsCategory.ACCIDENT}>Accidente</SelectItem>
                                                        <SelectItem value={NewsCategory.THEFT}>Robo</SelectItem>
                                                    </>
                                                ) : (
                                                    <>
                                                        <SelectItem value={NewsCategory.DAY_OFF}>Día Libre</SelectItem>
                                                        <SelectItem value={NewsCategory.HOLIDAY}>Festivo</SelectItem>
                                                        <SelectItem value={NewsCategory.SYSTEM_MAINTENANCE}>
                                                            Mantenimiento del Sistema
                                                        </SelectItem>
                                                        <SelectItem value={NewsCategory.OTHER}>Otro</SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            {newsType === NewsType.LOAN_SPECIFIC
                                                ? "Tipo de incidente o situación del vehículo"
                                                : "Tipo de evento que afecta a todo el punto"}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Título de la novedad" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descripción</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descripción detallada"
                                                {...field}
                                                rows={3}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notas (Opcional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Notas adicionales"
                                                {...field}
                                                rows={2}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Inicio</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Fin (Opcional)</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Activa</FormLabel>
                                            <FormDescription>
                                                Marcar como activa o inactiva
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator />

                        {/* SECTION 2: Loan-Specific Settings (only for loan-specific news) */}
                        {newsType === NewsType.LOAN_SPECIFIC && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Configuración de Cuotas</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Define los días y cuotas afectadas por esta novedad
                                    </p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="autoCalculateInstallments"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Auto-calcular Cuotas
                                                </FormLabel>
                                                <FormDescription>
                                                    Calcular automáticamente las cuotas a descontar basado en los días no disponibles y la frecuencia de pago
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="daysUnavailable"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Días No Disponible</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(parseInt(e.target.value) || 0)
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Número de días que el vehículo no estará disponible
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="installmentsToSubtract"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cuotas a Descontar</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        disabled={autoCalculate}
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(parseInt(e.target.value) || 0)
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {autoCalculate
                                                        ? "Se calculará automáticamente según la frecuencia de pago"
                                                        : "Especificar manualmente el número de cuotas"}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {news ? "Actualizar" : "Crear"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
