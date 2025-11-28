import { Table, TableBody } from "@/components/ui/table"
import { Owner } from "@/lib/types"
import { UserTableRow } from "./UserTableRow"
import { UsersTableEmpty } from "./UsersTableEmpty"
import { UsersTableHeader } from "./UsersTableHeader"
import { UsersTableSkeleton } from "./UsersTableSkeleton"

interface UsersTableProps {
  users: Owner[]
  loading: boolean
  onEdit: (user: Owner) => void
  onDelete: (user: Owner) => void
  onStatusChange: (userId: string, status: "ACTIVE" | "INACTIVE") => void
  onManagePermissions: (user: Owner) => void
}

export function UsersTable({
  users,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
  onManagePermissions,
}: UsersTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <UsersTableHeader />
          <TableBody>
            {loading ? (
              <UsersTableSkeleton />
            ) : users.length === 0 ? (
              <UsersTableEmpty />
            ) : (
              users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onManagePermissions={onManagePermissions}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
