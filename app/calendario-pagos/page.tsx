import { CalendarPayments } from "@/components/calendar/CalendarPayments"
import { PageHeader } from "@/components/common/PageHeader"
import { CalendarClock, Calendar } from "lucide-react"

export default function CalendarPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={CalendarClock}
        title="Calendario de Pagos"
        subtitle="Visualiza los pagos de cada contrato en el calendario"
        badgeIcon={Calendar}
        badgeLabel="Vista"
        badgeColor="purple"
      />
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <CalendarPayments />
      </div>
    </div>
  )
}
