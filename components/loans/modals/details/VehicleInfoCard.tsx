"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bike, Palette, Hash, Settings, Shield } from "lucide-react"
import { Loan } from "@/lib/types"

interface VehicleInfoCardProps {
    vehicle: Loan["vehicle"] | Loan["motorcycle"]
}

export function VehicleInfoCard({ vehicle }: VehicleInfoCardProps) {
    if (!vehicle) {
        return (
            <Card className="overflow-hidden border-border/50 shadow-sm">
                <CardHeader className="pb-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <CardTitle className="flex items-center text-base">
                        <Bike className="mr-2 h-4 w-4 text-emerald-500" />
                        Información del Vehículo
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <p className="text-muted-foreground text-center py-8">
                        No hay información del vehículo disponible
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                <CardTitle className="flex items-center text-base">
                    <Bike className="mr-2 h-4 w-4 text-emerald-500" />
                    Información del Vehículo
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                {/* Vehicle Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shadow-sm">
                        <Bike className="h-7 w-7 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                            {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-sm text-muted-foreground">Vehículo</p>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="space-y-3">
                    <InfoRow 
                        icon={<Hash className="h-4 w-4 text-muted-foreground" />}
                        label="Placa" 
                        value={vehicle.plate || "N/A"} 
                        highlight
                    />
                    
                    <InfoRow 
                        icon={<Bike className="h-4 w-4 text-muted-foreground" />}
                        label="Marca" 
                        value={vehicle.brand || "N/A"} 
                    />
                    
                    <InfoRow 
                        icon={<Settings className="h-4 w-4 text-muted-foreground" />}
                        label="Modelo" 
                        value={vehicle.model || "N/A"} 
                    />
                    
                    {vehicle.engine && (
                        <InfoRow 
                            icon={<Settings className="h-4 w-4 text-muted-foreground" />}
                            label="Motor" 
                            value={vehicle.engine} 
                        />
                    )}
                    
                    {vehicle.chassis && (
                        <InfoRow 
                            icon={<Shield className="h-4 w-4 text-muted-foreground" />}
                            label="Chasis" 
                            value={vehicle.chassis} 
                        />
                    )}

                    {vehicle.color && (
                        <InfoRow 
                            icon={<Palette className="h-4 w-4 text-muted-foreground" />}
                            label="Color" 
                            value={vehicle.color} 
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function InfoRow({ 
    icon, 
    label, 
    value,
    highlight = false
}: { 
    icon: React.ReactNode
    label: string
    value: string
    highlight?: boolean
}) {
    return (
        <div className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
            highlight 
                ? "bg-emerald-500/10 border border-emerald-500/20" 
                : "bg-muted/30 hover:bg-muted/50"
        }`}>
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <span className={`text-sm font-medium ${highlight ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                {value}
            </span>
        </div>
    )
}
