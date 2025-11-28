import { TableCell, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function UsersTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[120px]" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-[80px]" />
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            <Skeleton className="h-5 w-[100px]" />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <Skeleton className="h-4 w-[120px]" />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <Skeleton className="h-4 w-[120px]" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 rounded-md ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
