import { useState, useEffect, useCallback } from "react"
import { Owner } from "@/lib/types"
import { UsersService } from "@/lib/services/users.service"
import { useToast } from "@/components/ui/use-toast"

export type UserFilter = "all" | "active" | "inactive"

export function useUsers(filter: UserFilter = "all") {
  const [users, setUsers] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await UsersService.getAll()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron obtener los usuarios del servidor",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users
    .filter((user) => {
      if (filter === "active") return user.status === "ACTIVE"
      if (filter === "inactive") return user.status === "INACTIVE"
      return true
    })
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const deleteUser = async (userId: string) => {
    try {
      await UsersService.delete(userId)
      setUsers(users.filter((user) => user.id !== userId))
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente.",
      })
    } catch (error: any) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Ocurrió un error al eliminar el usuario. Inténtalo de nuevo.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateUserStatus = async (
    userId: string,
    newStatus: "ACTIVE" | "INACTIVE"
  ) => {
    try {
      await UsersService.updateStatus(userId, newStatus)
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      )
      toast({
        title: `Usuario ${newStatus === "ACTIVE" ? "activado" : "desactivado"}`,
        description: "El estado del usuario ha sido actualizado correctamente.",
      })
    } catch (error: any) {
      console.error("Error updating user status:", error)
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          `Ocurrió un error al ${
            newStatus === "ACTIVE" ? "activar" : "desactivar"
          } el usuario. Inténtalo de nuevo.`,
        variant: "destructive",
      })
      throw error
    }
  }

  const refreshUsers = fetchUsers

  return {
    users,
    filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    deleteUser,
    updateUserStatus,
    refreshUsers,
  }
}
