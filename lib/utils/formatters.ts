export function formatCurrency(amount: number, locale: string = "es-CO", currency: string = "COP") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number, locale: string = "es-CO") {
  return new Intl.NumberFormat(locale).format(num)
}

export function formatPercentage(value: number, decimals: number = 1) {
  return `${value.toFixed(decimals)}%`
}

export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return (part / total) * 100
}
