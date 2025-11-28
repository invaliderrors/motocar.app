import { LoanCalculator } from "@/components/loans/loan-calculator"

export default function CalculatorPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Calculadora de contratos</h1>
        <p className="text-muted-foreground">
          Simula contratos con diferentes condiciones para ayudar a tus clientes a tomar decisiones informadas.
        </p>
      </div>

      <LoanCalculator />
    </div>
  )
}
