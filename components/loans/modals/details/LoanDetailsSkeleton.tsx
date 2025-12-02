"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function LoanDetailsSkeleton() {
    return (
        <div className="space-y-6 py-4">
            {/* Header skeleton */}
            <div className="flex justify-end">
                <Skeleton className="h-10 w-36" />
            </div>
            
            {/* Client & Vehicle cards */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-14 w-14 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
            
            {/* Contract details */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
            </div>
            
            {/* Payment history */}
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}
