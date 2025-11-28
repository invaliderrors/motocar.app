"use client"

import { useState, useEffect, useCallback } from "react"
import { EmployeeService, Employee } from "@/lib/services/employee.service"
import { useToast } from "@/components/ui/use-toast"

export type EmployeeFilter = "all" | "active" | "inactive"

export function useEmployees(filter: EmployeeFilter = "all") {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      const data = await EmployeeService.getAllEmployees()
      
      // Filter only employees (role = EMPLOYEE), exclude admins
      const employeeUsers = data.filter((user) => user.role === "EMPLOYEE")
      
      setEmployees(employeeUsers)
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron obtener los empleados del servidor",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const filteredEmployees = employees
    .filter((employee) => {
      if (filter === "active") return employee.status === "ACTIVE"
      if (filter === "inactive") return employee.status === "INACTIVE"
      return true
    })
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (employee.store?.name && employee.store.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )

  const deleteEmployee = async (employeeId: string) => {
    try {
      await EmployeeService.deleteEmployee(employeeId)
      setEmployees(employees.filter((employee) => employee.id !== employeeId))
      toast({
        title: "Empleado eliminado",
        description: "El empleado ha sido eliminado correctamente.",
      })
    } catch (error: any) {
      console.error("Error deleting employee:", error)
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Ocurrió un error al eliminar el empleado. Inténtalo de nuevo.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateEmployeeStatus = async (
    employeeId: string,
    newStatus: "ACTIVE" | "INACTIVE"
  ) => {
    try {
      await EmployeeService.updateEmployeeStatus(employeeId, newStatus)
      setEmployees(
        employees.map((employee) =>
          employee.id === employeeId ? { ...employee, status: newStatus } : employee
        )
      )
      toast({
        title: `Empleado ${newStatus === "ACTIVE" ? "activado" : "desactivado"}`,
        description: "El estado del empleado ha sido actualizado correctamente.",
      })
    } catch (error: any) {
      console.error("Error updating employee status:", error)
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          `Ocurrió un error al ${
            newStatus === "ACTIVE" ? "activar" : "desactivar"
          } el empleado. Inténtalo de nuevo.`,
        variant: "destructive",
      })
      throw error
    }
  }

  const reassignEmployee = async (employeeId: string, newStoreId: string) => {
    try {
      await EmployeeService.reassignEmployeeToStore(employeeId, newStoreId)
      
      toast({
        title: "Empleado reasignado",
        description: "El empleado ha sido reasignado al nuevo punto correctamente.",
      })
      
      // Refresh employee list
      await fetchEmployees()
    } catch (error: any) {
      console.error("Error reassigning employee:", error)
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Ocurrió un error al reasignar el empleado. Inténtalo de nuevo.",
        variant: "destructive",
      })
      throw error
    }
  }

  const refreshEmployees = fetchEmployees

  return {
    employees: filteredEmployees,
    loading,
    searchTerm,
    setSearchTerm,
    deleteEmployee,
    updateEmployeeStatus,
    reassignEmployee,
    refreshEmployees,
  }
}

// Re-export Employee type for convenience
export type { Employee } from "@/lib/services/employee.service"
