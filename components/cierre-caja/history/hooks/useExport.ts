import { useState } from "react"
import { CashRegisterDisplay } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const useExport = () => {
    const [isExporting, setIsExporting] = useState(false)

    const exportToCSV = (data: CashRegisterDisplay[]) => {
        setIsExporting(true)

        try {
            // Prepare CSV headers
            const headers = [
                "ID",
                "Fecha Cierre",
                "Registrado",
                "Usuario",
                "Proveedor",
                "Ingresos",
                "Egresos",
                "Balance",
                "Efectivo",
                "Transferencias",
                "Tarjetas",
                "Estado",
                "Notas"
            ]

            // Prepare CSV rows
            const rows = data.map(register => [
                register.id,
                register.date,
                register.time,
                register.user,
                register.provider?.name || "N/A",
                register.totalIncome.toString(),
                register.totalExpense.toString(),
                register.balance.toString(),
                register.cashInRegister.toString(),
                register.cashFromTransfers.toString(),
                register.cashFromCards.toString(),
                register.status === "balanced" ? "Balanceado" : register.status === "minor-diff" ? "Diferencia Menor" : "Diferencia Mayor",
                register.notes || ""
            ])

            // Convert to CSV format
            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
            ].join("\n")

            // Create blob and download
            const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
            const link = document.createElement("a")
            const url = URL.createObjectURL(blob)

            const fileName = `cierres_de_caja_${format(new Date(), "yyyy-MM-dd_HHmm", { locale: es })}.csv`

            link.setAttribute("href", url)
            link.setAttribute("download", fileName)
            link.style.visibility = "hidden"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error("Error exporting to CSV:", error)
            throw error
        } finally {
            setIsExporting(false)
        }
    }

    const exportToPDF = (data: CashRegisterDisplay[]) => {
        setIsExporting(true)

        try {
            // Create HTML content for PDF
            const htmlContent = generatePDFHTML(data)

            // Create a new window
            const printWindow = window.open("", "_blank")
            if (!printWindow) {
                throw new Error("No se pudo abrir la ventana de impresión")
            }

            printWindow.document.write(htmlContent)
            printWindow.document.close()

            // Wait for content to load then print
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print()
                }, 500)
            }
        } catch (error) {
            console.error("Error exporting to PDF:", error)
            throw error
        } finally {
            setIsExporting(false)
        }
    }

    return {
        isExporting,
        exportToCSV,
        exportToPDF
    }
}

const generatePDFHTML = (data: CashRegisterDisplay[]): string => {
    const totalIncome = data.reduce((sum, r) => sum + r.totalIncome, 0)
    const totalExpense = data.reduce((sum, r) => sum + r.totalExpense, 0)
    const totalBalance = data.reduce((sum, r) => sum + r.balance, 0)

    const rows = data.map(register => `
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px;">${register.id.substring(0, 8)}</td>
            <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px;">${register.date}</td>
            <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px;">${register.time}</td>
            <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px;">${register.user}</td>
            <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px;">${register.provider?.name || "N/A"}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: #16a34a; font-weight: bold; font-size: 10px;">${formatCurrency(register.totalIncome)}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: #dc2626; font-weight: bold; font-size: 10px;">${formatCurrency(register.totalExpense)}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold; font-size: 10px;">${formatCurrency(register.balance)}</td>
            <td style="padding: 8px; border: 1px solid #ddd; font-size: 10px;">${register.status === "balanced" ? "✓ Balanceado" : register.status === "minor-diff" ? "⚠ Diferencia Menor" : "✗ Diferencia Mayor"}</td>
        </tr>
    `).join("")

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Historial de Cierres de Caja</title>
            <style>
                @page {
                    size: landscape;
                    margin: 1cm;
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #0d9488;
                    padding-bottom: 10px;
                }
                .header h1 {
                    color: #0d9488;
                    margin: 0;
                    font-size: 24px;
                }
                .header p {
                    margin: 5px 0;
                    color: #666;
                    font-size: 12px;
                }
                .summary {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 20px;
                    gap: 10px;
                }
                .summary-card {
                    flex: 1;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                }
                .summary-card.income {
                    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
                }
                .summary-card.expense {
                    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
                }
                .summary-card.balance {
                    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                }
                .summary-card h3 {
                    margin: 0;
                    font-size: 12px;
                    color: #666;
                    font-weight: normal;
                }
                .summary-card p {
                    margin: 5px 0 0 0;
                    font-size: 20px;
                    font-weight: bold;
                }
                .summary-card.income p {
                    color: #16a34a;
                }
                .summary-card.expense p {
                    color: #dc2626;
                }
                .summary-card.balance p {
                    color: #0d9488;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    font-size: 10px;
                }
                th {
                    background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                    color: white;
                    padding: 10px 8px;
                    text-align: left;
                    border: 1px solid #0d9488;
                    font-size: 11px;
                }
                th:nth-child(6),
                th:nth-child(7),
                th:nth-child(8) {
                    text-align: right;
                }
                tr:nth-child(even) {
                    background-color: #f9fafb;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                    border-top: 1px solid #ddd;
                    padding-top: 10px;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 Historial de Cierres de Caja</h1>
                <p>Generado el ${format(new Date(), "PPP 'a las' p", { locale: es })}</p>
                <p>Total de registros: ${data.length}</p>
            </div>

            <div class="summary">
                <div class="summary-card income">
                    <h3>Total Ingresos</h3>
                    <p>${formatCurrency(totalIncome)}</p>
                </div>
                <div class="summary-card expense">
                    <h3>Total Egresos</h3>
                    <p>${formatCurrency(totalExpense)}</p>
                </div>
                <div class="summary-card balance">
                    <h3>Balance Total</h3>
                    <p>${formatCurrency(totalBalance)}</p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha Cierre</th>
                        <th>Registrado</th>
                        <th>Usuario</th>
                        <th>Proveedor</th>
                        <th>Ingresos</th>
                        <th>Egresos</th>
                        <th>Balance</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>

            <div class="footer">
                <p>Este documento fue generado automáticamente por el sistema de gestión de cierres de caja.</p>
            </div>
        </body>
        </html>
    `
}
