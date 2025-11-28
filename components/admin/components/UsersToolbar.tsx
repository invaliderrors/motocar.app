import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus } from "lucide-react"

interface UsersToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onCreateNew: () => void
}

export function UsersToolbar({
  searchTerm,
  onSearchChange,
  onCreateNew,
}: UsersToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por nombre, usuario o rol..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button onClick={onCreateNew}>
        <UserPlus className="mr-2 h-4 w-4" />
        Nuevo Usuario
      </Button>
    </div>
  )
}
