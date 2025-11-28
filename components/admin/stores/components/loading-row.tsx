"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingRow() {
    return (
        <TableRow>
            <TableCell>
                <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell className="hidden lg:table-cell">
                <Skeleton className="h-4 w-48" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-6 w-20" />
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </TableCell>
        </TableRow>
    )
}
