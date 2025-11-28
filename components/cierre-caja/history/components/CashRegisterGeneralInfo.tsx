import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Info } from "lucide-react"
import { format } from "date-fns"
import es from "date-fns/locale/es"
import type { Closing } from "@/lib/types"
import { ProviderBadge } from "@/components/common/ProviderBadge"

interface GeneralInfoCardProps {
    cashRegister: Closing
    getInitials: (name: string) => string
}

export const GeneralInfoCard: React.FC<GeneralInfoCardProps> = ({ cashRegister, getInitials }) => {
    return (
        <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-900/50 rounded-t-lg">
                <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Información General
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">ID:</span>
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs mt-1 w-fit">
                            {cashRegister.id}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Fecha:</span>
                        <span className="font-medium">{format(new Date(cashRegister.date), "dd/MM/yyyy", { locale: es })}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Hora:</span>
                        <span className="font-medium">{format(new Date(cashRegister.date), "HH:mm", { locale: es })}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Usuario:</span>
                        <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                    {getInitials(cashRegister.createdBy?.username || "UN")}
                                </AvatarFallback>
                            </Avatar>
                            <span>{cashRegister.createdBy?.username}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Proveedor:</span>
                        <div className="mt-1">
                            <ProviderBadge provider={cashRegister.provider} />
                        </div>
                    </div>
                    {cashRegister.notes && (
                        <div className="flex-1">
                            <span className="text-muted-foreground text-xs">Notas:</span>
                            <p className="text-sm mt-1 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-200 dark:border-slate-800">
                                {cashRegister.notes}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
