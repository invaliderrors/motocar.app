"use client"
import { Card } from "@/components/ui/card"
import { CreditCard, DollarSign, FileText, Plus, Printer, User } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      icon: <User className="h-4 w-4" />,
      label: "Nuevo Usuario",
      href: "/usuarios",
      color: "bg-primary",
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      label: "Nuevo contrato",
      href: "/contratos",
      color: "bg-primary",
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      label: "Registrar Pago",
      href: "/cuotas",
      color: "bg-green-500",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Generar Reporte",
      href: "/reportes",
      color: "bg-primary",
    },
    {
      icon: <Printer className="h-4 w-4" />,
      label: "Imprimir Recibo",
      href: "#",
      color: "bg-muted",
    },
    {
      icon: <Plus className="h-4 w-4" />,
      label: "Más Acciones",
      href: "#",
      color: "bg-muted",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action, index) => (
        <Link href={action.href} key={index}>
          <Card className="p-3 flex flex-col items-center justify-center h-[80px] text-center hover:shadow-md transition-all cursor-pointer">
            <div className={`${action.color} text-white p-2 rounded-full mb-1.5`}>{action.icon}</div>
            <span className="text-xs font-medium">{action.label}</span>
          </Card>
        </Link>
      ))}
    </div>
  )
}
