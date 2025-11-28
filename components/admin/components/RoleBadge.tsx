import { Badge } from "@/components/ui/badge"

interface RoleBadgeProps {
  role: string
}

export function RoleBadge({ role }: RoleBadgeProps) {
  switch (role) {
    case "ADMIN":
      return (
        <Badge className="bg-red-500/80 hover:bg-red-500/70 text-white">
          Administrador
        </Badge>
      )
    case "MANAGER":
      return (
        <Badge className="bg-blue-500/80 hover:bg-blue-500/70 text-white">
          Gerente
        </Badge>
      )
    case "MODERATOR":
      return (
        <Badge className="bg-purple-500/80 hover:bg-purple-500/70 text-white">
          Moderador
        </Badge>
      )
    case "USER":
      return (
        <Badge className="bg-green-500/80 hover:bg-green-500/70 text-white">
          Empleado
        </Badge>
      )
    default:
      return <Badge>{role}</Badge>
  }
}
