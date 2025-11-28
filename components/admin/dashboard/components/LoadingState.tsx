import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardLoadingState() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Main Stats Loading */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card 
            key={i}
            className="border-0 shadow-lg backdrop-blur-sm bg-gradient-to-br from-card/90 to-card/60 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent animate-pulse" />
            <CardHeader className="p-4 relative">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 relative space-y-2">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats Loading */}
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card 
            key={i}
            className="border-0 shadow-lg backdrop-blur-sm bg-gradient-to-br from-card/90 to-card/60 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            <CardHeader className="p-4 relative">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 relative space-y-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Loading */}
      <Card className="border-0 shadow-xl backdrop-blur-sm bg-gradient-to-br from-card/90 to-card/60 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 animate-pulse" />
        <CardHeader className="relative">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </CardContent>
      </Card>

      {/* Stores Loading */}
      <Card className="border-0 shadow-xl backdrop-blur-sm bg-gradient-to-br from-card/90 to-card/60 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent animate-pulse" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card 
                key={i}
                className="border-0 shadow-lg overflow-hidden"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-20 rounded-xl" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-14 rounded-xl" />
                    <Skeleton className="h-14 rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
