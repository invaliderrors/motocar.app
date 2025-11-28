import { TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function ProviderTableSkeleton() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, index) => (
                <TableRow
                    key={`skeleton-${index}`}
                    className="border-border hover:bg-muted/50"
                >
                    <TableCell>
                        <Skeleton className="h-5 w-[150px]" />
                    </TableCell>
                    <TableCell className="text-center">
                        <Skeleton className="h-5 w-[100px] mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                        <Skeleton className="h-5 w-[100px] mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                        <Skeleton className="h-5 w-[120px] mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                        <Skeleton className="h-5 w-[80px] mx-auto" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-[120px]" />
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}
