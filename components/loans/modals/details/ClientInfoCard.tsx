"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Phone, MapPin, CreditCard, User2 } from "lucide-react"
import { Loan } from "@/lib/types"

interface ClientInfoCardProps {
    user: Loan["user"]
    loanId: string
}

export function ClientInfoCard({ user, loanId }: ClientInfoCardProps) {
    const initials = user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()

    return (
        <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                <CardTitle className="flex items-center text-base">
                    <Users className="mr-2 h-4 w-4 text-blue-500" />
                    Información del Cliente
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                {/* Client Avatar & Name */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                    <Avatar className="h-14 w-14 border-2 border-blue-500/20 shadow-sm">
                        <AvatarImage
                            src={`/abstract-geometric-shapes.png?height=56&width=56&query=${loanId}`}
                            alt={user.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                    </div>
                </div>

                {/* Client Details */}
                <div className="space-y-3">
                    <InfoRow 
                        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                        label="Identificación" 
                        value={user.identification || "N/A"} 
                    />
                    
                    {user.refName && (
                        <InfoRow 
                            icon={<User2 className="h-4 w-4 text-muted-foreground" />}
                            label="Referencia" 
                            value={user.refName} 
                        />
                    )}
                    
                    <InfoRow 
                        icon={<Phone className="h-4 w-4 text-muted-foreground" />}
                        label="Teléfono" 
                        value={user.phone || "N/A"} 
                    />
                    
                    {user.address && (
                        <InfoRow 
                            icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                            label="Dirección" 
                            value={user.address} 
                        />
                    )}
                    
                    {user.city && (
                        <InfoRow 
                            icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                            label="Ciudad" 
                            value={user.city} 
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
    value 
}: { 
    icon: React.ReactNode
    label: string
    value: string 
}) {
    return (
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <span className="text-sm font-medium text-foreground">{value}</span>
        </div>
    )
}
