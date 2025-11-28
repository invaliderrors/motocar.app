import { HttpService } from "@/lib/http"
import { Owner } from "@/lib/types"

export interface CreateUserDto {
  username: string
  name: string
  password: string
  role: "ADMIN" | "USER" | "MANAGER" | "MODERATOR"
  status?: "ACTIVE" | "INACTIVE"
}

export interface UpdateUserDto {
  name?: string
  username?: string
  role?: "ADMIN" | "USER" | "MANAGER" | "MODERATOR"
  status?: "ACTIVE" | "INACTIVE"
  password?: string
}

export class UsersService {
  private static readonly BASE_PATH = "/api/v1/owners"

  /**
   * Fetch all users from the API
   */
  static async getAll(): Promise<Owner[]> {
    const response = await HttpService.get(this.BASE_PATH)
    return response.data.map((item: any) => this.mapToOwner(item))
  }

  /**
   * Get a single user by ID
   */
  static async getById(id: string): Promise<Owner> {
    const response = await HttpService.get(`${this.BASE_PATH}/${id}`)
    return this.mapToOwner(response.data)
  }

  /**
   * Create a new user
   */
  static async create(data: CreateUserDto): Promise<Owner> {
    // Transform role to roles array for backend
    const payload = {
      ...data,
      roles: [data.role],
    }
    const response = await HttpService.post(this.BASE_PATH, payload)
    return this.mapToOwner(response.data)
  }

  /**
   * Update an existing user
   */
  static async update(id: string, data: UpdateUserDto): Promise<Owner> {
    // Transform role to roles array for backend
    const payload: any = {
      ...data,
    }
    
    // Convert single role to roles array if role is provided
    if (data.role) {
      payload.roles = [data.role]
      delete payload.role
    }
    
    const response = await HttpService.put(`${this.BASE_PATH}/${id}`, payload)
    return this.mapToOwner(response.data)
  }

  /**
   * Delete a user
   */
  static async delete(id: string): Promise<void> {
    await HttpService.delete(`${this.BASE_PATH}/${id}`)
  }

  /**
   * Update user status (activate/deactivate)
   */
  static async updateStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE"
  ): Promise<Owner> {
    return this.update(id, { status })
  }

  /**
   * Map API response to Owner type
   */
  private static mapToOwner(item: any): Owner {
    return {
      id: item.id,
      username: item.username,
      name: item.name || item.username,
      role: item.roles?.[0] || "USER",
      status: item.status?.toUpperCase() || "ACTIVE",
      lastLogin: item.lastAccess,
      createdAt: item.createdAt,
      permissions: item.permissions || {},
    }
  }
}
