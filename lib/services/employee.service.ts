import { HttpService } from "@/lib/http"
import { PermissionsMap } from "@/lib/types/permissions"

export interface Employee {
  id: string
  username: string
  name: string
  phone?: string
  email?: string
  role: string
  storeId: string | null
  status: "ACTIVE" | "INACTIVE"
  permissions?: PermissionsMap
  createdAt: string
  updatedAt: string
  store?: {
    id: string
    name: string
    code: string
  }
}

export interface CreateEmployeeDto {
  username: string
  name: string
  phone?: string
  email?: string
  password: string
  role?: "ADMIN" | "EMPLOYEE"
  storeId?: string
  status?: "ACTIVE" | "INACTIVE"
  permissions?: PermissionsMap
}

export interface UpdateEmployeeDto {
  username?: string
  name?: string
  phone?: string
  email?: string
  password?: string
  role?: "ADMIN" | "EMPLOYEE"
  storeId?: string
  status?: "ACTIVE" | "INACTIVE"
  permissions?: PermissionsMap
}

export class EmployeeService {
  private static readonly BASE_URL = "/api/v1/user"

  static async getAllEmployees(): Promise<Employee[]> {
    const response = await HttpService.get<Employee[]>(this.BASE_URL)
    return response.data
  }

  static async getEmployeeById(id: string): Promise<Employee> {
    const response = await HttpService.get<Employee>(`${this.BASE_URL}/${id}`)
    return response.data
  }

  static async createEmployee(data: CreateEmployeeDto): Promise<Employee> {
    const response = await HttpService.post<Employee>(this.BASE_URL, data)
    return response.data
  }

  static async updateEmployee(id: string, data: UpdateEmployeeDto): Promise<Employee> {
    const response = await HttpService.patch<Employee>(`${this.BASE_URL}/${id}`, data)
    return response.data
  }

  static async updateEmployeeStatus(id: string, status: "ACTIVE" | "INACTIVE"): Promise<Employee> {
    const response = await HttpService.patch<Employee>(`${this.BASE_URL}/${id}/status`, { status })
    return response.data
  }

  static async deleteEmployee(id: string): Promise<void> {
    await HttpService.delete(`${this.BASE_URL}/${id}`)
  }

  static async reassignEmployeeToStore(employeeId: string, newStoreId: string): Promise<void> {
    await HttpService.post(`/api/v1/store/transfer/employee/${employeeId}`, { newStoreId })
  }
}
