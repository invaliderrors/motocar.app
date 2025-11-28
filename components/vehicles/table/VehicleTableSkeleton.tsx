import { TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function VehicleTableSkeleton() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, index) => (
                <TableRow
                    key={`skeleton-${index}`}
                    className="border-border hover:bg-muted/50"
                >
                    {Array.from({ length: 10 }).map((_, i) => (
                        <TableCell key={`skeleton-cell-${index}-${i}`}>
                            <Skeleton className="h-5 w-full" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    )
}

