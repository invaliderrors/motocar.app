import { HttpService } from "../http";
import { News, NewsType, NewsCategory, VehicleType } from "../types";

export interface CreateNewsDto {
    type: NewsType;
    category: NewsCategory;
    title: string;
    description: string;
    notes?: string;
    startDate: string;
    endDate?: string;
    isActive?: boolean;
    loanId?: string;
    storeId: string;
    vehicleType?: VehicleType;
    autoCalculateInstallments?: boolean;
    daysUnavailable?: number;
    installmentsToSubtract?: number;
    // Recurring date configuration
    isRecurring?: boolean;
    recurringDay?: number;
    recurringMonths?: number[];
    skippedDates?: string[];
}

export interface UpdateNewsDto {
    type?: NewsType;
    category?: NewsCategory;
    title?: string;
    description?: string;
    notes?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    vehicleType?: VehicleType;
    autoCalculateInstallments?: boolean;
    daysUnavailable?: number;
    installmentsToSubtract?: number;
    // Recurring date configuration
    isRecurring?: boolean;
    recurringDay?: number;
    recurringMonths?: number[];
    skippedDates?: string[];
}

export interface QueryNewsDto {
    type?: NewsType;
    category?: NewsCategory;
    loanId?: string;
    storeId?: string;
    vehicleType?: VehicleType;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

export interface NewsListResponse {
    data: News[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export class NewsService {
    private static getAuthHeader() {
        const token = document.cookie
            .split("; ")
            .find((c) => c.startsWith("authToken="))
            ?.split("=")[1];
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    static async create(data: CreateNewsDto): Promise<News> {
        const response = await HttpService.post<News>("/api/v1/news", data, {
            headers: this.getAuthHeader(),
        });
        return response.data;
    }

    static async findAll(query?: QueryNewsDto): Promise<NewsListResponse> {
        const params = new URLSearchParams();
        if (query?.type) params.append("type", query.type);
        if (query?.category) params.append("category", query.category);
        if (query?.loanId) params.append("loanId", query.loanId);
        if (query?.storeId) params.append("storeId", query.storeId);
        if (query?.isActive !== undefined) params.append("isActive", String(query.isActive));
        if (query?.page) params.append("page", String(query.page));
        if (query?.limit) params.append("limit", String(query.limit));

        const queryString = params.toString();
        const url = queryString ? `/api/v1/news?${queryString}` : "/api/v1/news";

        const response = await HttpService.get<NewsListResponse>(url, {
            headers: this.getAuthHeader(),
        });
        return response.data;
    }

    static async findOne(id: string): Promise<News> {
        const response = await HttpService.get<News>(`/api/v1/news/${id}`, {
            headers: this.getAuthHeader(),
        });
        return response.data;
    }

    static async getActiveLoanNews(loanId: string): Promise<News[]> {
        const response = await HttpService.get<News[]>(`/api/v1/news/loan/${loanId}/active`, {
            headers: this.getAuthHeader(),
        });
        return response.data;
    }

    static async getAllLoanNews(loanId: string): Promise<News[]> {
        const response = await HttpService.get<News[]>(`/api/v1/news/loan/${loanId}/all`, {
            headers: this.getAuthHeader(),
        });
        return response.data;
    }

    static async getSkippedDatesForLoan(loanId: string): Promise<{
        dates: string[];
        news: Array<{ id: string; title: string; category: string; dates: string[]; isRecurring: boolean }>;
    }> {
        const response = await HttpService.get<{
            dates: string[];
            news: Array<{ id: string; title: string; category: string; dates: string[]; isRecurring: boolean }>;
        }>(`/api/v1/news/loan/${loanId}/skipped-dates`, {
            headers: this.getAuthHeader(),
        });
        return response.data;
    }

    static async getActiveStoreNews(storeId: string): Promise<News[]> {
        const response = await HttpService.get<News[]>(`/api/v1/news/store/${storeId}/active`, {
            headers: this.getAuthHeader(),
        });
        return response.data;
    }

    static async getTotalInstallmentsToSubtract(loanId: string): Promise<number> {
        const response = await HttpService.get<number>(
            `/api/v1/news/loan/${loanId}/total-installments-to-subtract`,
            {
                headers: this.getAuthHeader(),
            }
        );
        return response.data;
    }

    static async getNewsSummaryBatch(
        loanIds: string[]
    ): Promise<Record<string, { totalNewsCount: number; activeNewsCount: number; totalInstallmentsExcluded: number; skippedDatesCount: number }>> {
        const response = await HttpService.post<
            Record<string, { totalNewsCount: number; activeNewsCount: number; totalInstallmentsExcluded: number; skippedDatesCount: number }>
        >(
            "/api/v1/news/batch/active-news-summary",
            { loanIds },
            {
                headers: this.getAuthHeader(),
            }
        );
        return response.data;
    }

    static async getSkippedDatesBatch(
        loanIds: string[]
    ): Promise<Record<string, string[]>> {
        const response = await HttpService.post<Record<string, string[]>>(
            "/api/v1/news/batch/skipped-dates",
            { loanIds },
            {
                headers: this.getAuthHeader(),
            }
        );
        return response.data;
    }

    static async update(id: string, data: UpdateNewsDto): Promise<News> {
        const response = await HttpService.patch<News>(`/api/v1/news/${id}`, data, {
            headers: this.getAuthHeader(),
        });
        return response.data;
    }

    static async delete(id: string): Promise<void> {
        await HttpService.delete(`/api/v1/news/${id}`, {
            headers: this.getAuthHeader(),
        });
    }
}
