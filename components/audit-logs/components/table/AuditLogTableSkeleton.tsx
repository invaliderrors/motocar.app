"use client"

import { TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function AuditLogTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <TableRow key={i}>
          <td className="p-4">
            <Skeleton className="h-4 w-full" />
          </td>
          <td className="p-4">
            <Skeleton className="h-4 w-full" />
          </td>
          <td className="p-4">
            <Skeleton className="h-4 w-full" />
          </td>
          <td className="p-4">
            <Skeleton className="h-4 w-full" />
          </td>
          <td className="p-4">
            <Skeleton className="h-4 w-full" />
          </td>
          <td className="p-4">
            <Skeleton className="h-4 w-full" />
          </td>
        </TableRow>
      ))}
    </>
  )
}
