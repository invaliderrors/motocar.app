import { TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function UserTableSkeleton() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, index) => (
                <TableRow
                    key={`skeleton-${index}`}
                >
                    <TableCell>
                        <Skeleton className="h-5 w-[150px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-5 w-[100px]" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                        <Skeleton className="h-5 w-[100px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-5 w-[40px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-5 w-[100px]" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                        <Skeleton className="h-5 w-[200px]" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                        <Skeleton className="h-5 w-[120px]" />
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}
