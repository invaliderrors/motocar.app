import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Store as StoreIcon } from "lucide-react"
import { StoreData } from "@/lib/services/admin-dashboard.service"
import { StoreCard } from "./StoreCard"
import { useRouter } from "next/navigation"

interface StoresGridProps {
  stores: StoreData[]
}

export function StoresGrid({ stores }: StoresGridProps) {
  const router = useRouter()

  return (
    <Card className="border-0 shadow-xl backdrop-blur-sm bg-gradient-to-br from-card/90 to-card/60 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <StoreIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Puntos</CardTitle>
                <CardDescription className="text-sm">
                  Vista detallada de cada punto y sus métricas en tiempo real
                </CardDescription>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => router.push("/admin/stores")} 
            size="lg"
            className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            Ver Gestión
            <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store, index) => (
            <div
              key={store.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
            >
              <StoreCard store={store} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
