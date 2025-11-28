import { TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function ExpenseTableSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                    key={`skeleton-${index}`}
                    className="border-border hover:bg-muted/50"
                >
                    <TableCell>
                        <Skeleton className="h-5 w-[60px] bg-muted" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-[80px] bg-muted" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 w-[100px] bg-muted rounded-full" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 w-[100px] bg-muted rounded-full mx-auto" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-[80px] bg-muted ml-auto" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-[100px] bg-muted" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-[120px] bg-muted" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-5 w-[100px] bg-muted" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-5 w-[100px] bg-muted" />
                    </TableCell>
                    <TableCell>
                        <div className="flex justify-end">
                            <Skeleton className="h-8 w-8 bg-muted rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}
