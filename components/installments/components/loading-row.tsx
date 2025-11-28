import { TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingRow() {
    return (
        <TableRow className="border-border hover:bg-muted/30">
            <TableCell>
                <Skeleton className="h-6 w-[150px] bg-muted" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <Skeleton className="h-6 w-[120px] bg-muted" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <Skeleton className="h-6 w-[120px] bg-muted" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-6 w-[100px] bg-muted" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-6 w-[100px] bg-muted" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <Skeleton className="h-6 w-[100px] bg-muted" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-6 w-[100px] bg-muted" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-6 w-[80px] bg-muted" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-6 w-[80px] bg-muted" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-6 w-[50px] bg-muted" />
            </TableCell>
        </TableRow>
    )
}
