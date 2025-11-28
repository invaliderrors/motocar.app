import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-green-500/80 hover:bg-green-500/70 text-white">
          Activo
        </Badge>
      )
    case "INACTIVE":
      return (
        <Badge
          variant="outline"
          className="text-gray-400 border-dark-blue-700"
        >
          Inactivo
        </Badge>
      )
    default:
      return <Badge>{status}</Badge>
  }
}
