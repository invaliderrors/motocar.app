import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { getAdminDashboard, AdminDashboardData } from "@/lib/services/admin-dashboard.service"

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getAdminDashboard()
      setData(result)
    } catch (err) {
      const error = err as Error
      setError(error)
      console.error("Error fetching admin dashboard:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  }
}
