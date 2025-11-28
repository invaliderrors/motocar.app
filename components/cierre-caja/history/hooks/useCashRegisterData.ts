import { useState, useEffect } from "react"
import { HttpService } from "@/lib/http"
import { transformCashRegisterData } from "../utils"
import { CashRegisterDisplay } from "@/lib/types"

export const useCashRegisterData = () => {
    const [registers, setRegisters] = useState<CashRegisterDisplay[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)
            setRefreshing(true)

            const res = await HttpService.get("/api/v1/closing")
            const mapped = transformCashRegisterData(res.data)
            setRegisters(mapped)
        } catch (err) {
            console.error("Error al cargar los cierres de caja:", err)
        } finally {
            setLoading(false)
            setTimeout(() => setRefreshing(false), 500)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return {
        registers,
        loading,
        refreshing,
        refetch: fetchData,
    }
}
