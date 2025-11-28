import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

interface TransactionListLoadingProps {
    rowCount?: number
}

export function TransactionListLoading({ rowCount = 5 }: TransactionListLoadingProps) {
    return (
        <>
            {Array.from({ length: rowCount }).map((_, index) => (
                <TableRow key={index} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    {Array.from({ length: 8 }).map((__, i) => (
                        <TableCell key={i}>
                            <Skeleton className="h-5 w-full" />
                        </TableCell>
                    ))}
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}
