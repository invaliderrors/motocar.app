import { ProviderStats, ProviderDetails } from "../types"
import { HttpService } from "../http"

export const providerStatsService = {
    /**
     * Get comprehensive statistics for all providers
     */
    async getProvidersStats(): Promise<ProviderStats[]> {
        const response = await HttpService.get<ProviderStats[]>("/api/v1/providers/stats")
        return response.data
    },

    /**
     * Get detailed information for a specific provider
     */
    async getProviderDetails(id: string): Promise<ProviderDetails> {
        const response = await HttpService.get<ProviderDetails>(`/api/v1/providers/${id}/details`)
        return response.data
    },
}
