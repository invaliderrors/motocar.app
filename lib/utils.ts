import { toast } from "@/components/ui/use-toast";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Providers } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount)
}


/**
 * Formatea una fecha en el formato especificado
 * @param date Fecha a formatear (string, Date o timestamp)
 * @param formatStr Formato deseado (por defecto: 'dd/MM/yyyy')
 * @returns Fecha formateada como string
 */
export function formatDate(date: string | Date | number, formatStr = 'dd/MM/yyyy'): string {
  if (!date) return '';

  // If it's a string in YYYY-MM-DD format, parse it manually to avoid timezone issues
  let dateObj: Date;
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);
  } else {
    dateObj = typeof date === 'object' ? date : new Date(date);
  }

  if (isNaN(dateObj.getTime())) {
    console.error('Fecha inválida:', date);
    return 'Fecha inválida';
  }

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();

  // Nombres de meses en español
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  // Nombres cortos de meses en español
  const shortMonthNames = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ];

  // Reemplazar patrones en el formato
  return formatStr
    .replace('dd', day)
    .replace('d', dateObj.getDate().toString())
    .replace('MMMM', monthNames[dateObj.getMonth()])
    .replace('MMM', shortMonthNames[dateObj.getMonth()])
    .replace('MM', month)
    .replace('M', (dateObj.getMonth() + 1).toString())
    .replace('yyyy', year.toString())
    .replace('yy', year.toString().slice(-2));
}

/**
 * Capitaliza la primera letra de un texto
 * @param text Texto a capitalizar
 * @returns Texto con la primera letra en mayúscula
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getInterest(capital: number, tasaAnual: number, numeroPeriodos: number) {
  const tasaPorPeriodo = tasaAnual / numeroPeriodos;
  return (capital * tasaPorPeriodo) / (1 - Math.pow(1 + tasaPorPeriodo, -numeroPeriodos))
}

export const formatProviderName = (provider: string | undefined): string => {
  if (!provider) return "Desconocido"

  switch (provider) {
    case Providers.MOTOFACIL:
      return "Moto Facil"
    case Providers.OBRASOCIAL:
      return "Obra Social"
    case Providers.TITO:
      return "Tito"
    default:
      return provider
  }
}