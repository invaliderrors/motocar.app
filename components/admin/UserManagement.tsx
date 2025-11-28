"use client"

import { useState } from "react"
import { Owner } from "@/lib/types"
import { useUsers, UserFilter } from "@/components/admin/hooks/useUsers"
import { UsersToolbar } from "@/components/admin/components/UsersToolbar"
import { UsersTable } from "@/components/admin/components/UsersTable"
import { DeleteUserDialog } from "@/components/admin/components/DeleteUserDialog"
import { PermissionsDialog } from "@/components/admin/components/PermissionsDialog"
import { useToast } from "@/components/ui/use-toast"
import { UserForm } from "./UserOwnerForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function UserManagement({ filter: initialFilter = "all" }: { filter?: UserFilter }) {
  const [activeFilter, setActiveFilter] = useState<UserFilter>(initialFilter)
  const {
    filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    deleteUser,
    updateUserStatus,
    refreshUsers,
  } = useUsers(activeFilter)

  const [selectedUser, setSelectedUser] = useState<Owner | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleEdit = (user: Owner) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleDelete = (user: Owner) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return

    try {
      await deleteUser(selectedUser.id)
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      // Error already handled in hook
    }
  }

  const handleStatusChange = async (
    userId: string,
    status: "ACTIVE" | "INACTIVE"
  ) => {
    try {
      await updateUserStatus(userId, status)
    } catch (error) {
      // Error already handled in hook
    }
  }

  const handleManagePermissions = (user: Owner) => {
    setSelectedUser(user)
    setIsPermissionsDialogOpen(true)
  }

  const handleCreateNew = () => {
    setSelectedUser(null)
    setIsFormOpen(true)
  }

  const handleFormSave = (updatedUser: Owner) => {
    if (selectedUser) {
      toast({
        title: "Usuario actualizado",
        description: "El usuario ha sido actualizado correctamente.",
      })
    } else {
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado correctamente.",
      })
    }
    setIsFormOpen(false)
    refreshUsers()
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as UserFilter)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos los Usuarios</TabsTrigger>
          <TabsTrigger value="active">Usuarios Activos</TabsTrigger>
          <TabsTrigger value="inactive">Usuarios Inactivos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todos los Usuarios</CardTitle>
              <CardDescription>
                Gestiona todos los usuarios registrados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UsersToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onCreateNew={handleCreateNew}
              />

              <UsersTable
                users={filteredUsers}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onManagePermissions={handleManagePermissions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Activos</CardTitle>
              <CardDescription>
                Gestiona los usuarios activos en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UsersToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onCreateNew={handleCreateNew}
              />

              <UsersTable
                users={filteredUsers}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onManagePermissions={handleManagePermissions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Inactivos</CardTitle>
              <CardDescription>
                Gestiona los usuarios inactivos en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UsersToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onCreateNew={handleCreateNew}
              />

              <UsersTable
                users={filteredUsers}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onManagePermissions={handleManagePermissions}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        user={selectedUser}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser}
        onSave={handleFormSave}
      />

      {selectedUser && (
        <PermissionsDialog
          open={isPermissionsDialogOpen}
          onOpenChange={setIsPermissionsDialogOpen}
          userId={selectedUser.id}
          userName={selectedUser.name}
          currentRole={selectedUser.role}
          onPermissionsUpdated={refreshUsers}
        />
      )}
    </div>
  )
}
