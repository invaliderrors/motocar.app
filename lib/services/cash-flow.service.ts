import { HttpService } from "@/lib/http"
import type {
  CashFlowAccount,
  CashFlowTransaction,
  CashFlowTransfer,
  CashFlowRule,
  CreateAccountDto,
  UpdateAccountDto,
  CreateTransactionDto,
  CreateBatchTransactionsDto,
  UpdateTransactionDto,
  CreateTransferDto,
  CreateRuleDto,
  UpdateRuleDto,
  DryRunRuleDto,
  AccountQueryDto,
  TransactionQueryDto,
  TransferQueryDto,
  RuleQueryDto,
  CashFlowStatementDto,
  ForecastDto,
  PaginatedResponse,
  BatchTransactionResult,
  DryRunResult,
  CashFlowStatement,
  CashFlowForecast,
} from "@/lib/types/cash-flow"

const BASE_PATH = "/api/v1/cash-flow"

export class CashFlowService {
  // ============ ACCOUNTS ============
  static async getAccounts(query?: AccountQueryDto): Promise<PaginatedResponse<CashFlowAccount>> {
    const params = new URLSearchParams()
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const response = await HttpService.get<PaginatedResponse<CashFlowAccount>>(
      `${BASE_PATH}/accounts?${params.toString()}`
    )
    return response.data
  }

  static async getAccount(id: string): Promise<CashFlowAccount> {
    const response = await HttpService.get<CashFlowAccount>(`${BASE_PATH}/accounts/${id}`)
    return response.data
  }

  static async getAccountBalance(id: string): Promise<{ accountId: string; balance: number; currency: string }> {
    const response = await HttpService.get<{ accountId: string; balance: number; currency: string }>(
      `${BASE_PATH}/accounts/${id}/balance`
    )
    return response.data
  }

  static async createAccount(data: CreateAccountDto): Promise<CashFlowAccount> {
    const response = await HttpService.post<CashFlowAccount>(`${BASE_PATH}/accounts`, data)
    return response.data
  }

  static async updateAccount(id: string, data: UpdateAccountDto): Promise<CashFlowAccount> {
    const response = await HttpService.patch<CashFlowAccount>(`${BASE_PATH}/accounts/${id}`, data)
    return response.data
  }

  static async deleteAccount(id: string): Promise<void> {
    await HttpService.delete(`${BASE_PATH}/accounts/${id}`)
  }

  // ============ TRANSACTIONS ============
  static async getTransactions(query?: TransactionQueryDto): Promise<PaginatedResponse<CashFlowTransaction>> {
    const params = new URLSearchParams()
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)))
          } else {
            params.append(key, String(value))
          }
        }
      })
    }
    const response = await HttpService.get<PaginatedResponse<CashFlowTransaction>>(
      `${BASE_PATH}/transactions?${params.toString()}`
    )
    return response.data
  }

  static async getTransaction(id: string): Promise<CashFlowTransaction> {
    const response = await HttpService.get<CashFlowTransaction>(`${BASE_PATH}/transactions/${id}`)
    return response.data
  }

  static async createTransaction(data: CreateTransactionDto): Promise<CashFlowTransaction> {
    const response = await HttpService.post<CashFlowTransaction>(`${BASE_PATH}/transactions`, data)
    return response.data
  }

  static async createBatchTransactions(data: CreateBatchTransactionsDto): Promise<BatchTransactionResult> {
    const response = await HttpService.post<BatchTransactionResult>(`${BASE_PATH}/transactions/batch`, data)
    return response.data
  }

  static async updateTransaction(id: string, data: UpdateTransactionDto): Promise<CashFlowTransaction> {
    const response = await HttpService.patch<CashFlowTransaction>(`${BASE_PATH}/transactions/${id}`, data)
    return response.data
  }

  static async deleteTransaction(id: string): Promise<void> {
    await HttpService.delete(`${BASE_PATH}/transactions/${id}`)
  }

  // ============ TRANSFERS ============
  static async getTransfers(query?: TransferQueryDto): Promise<PaginatedResponse<CashFlowTransfer>> {
    const params = new URLSearchParams()
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const response = await HttpService.get<PaginatedResponse<CashFlowTransfer>>(
      `${BASE_PATH}/transfers?${params.toString()}`
    )
    return response.data
  }

  static async getTransfer(id: string): Promise<CashFlowTransfer> {
    const response = await HttpService.get<CashFlowTransfer>(`${BASE_PATH}/transfers/${id}`)
    return response.data
  }

  static async createTransfer(data: CreateTransferDto): Promise<CashFlowTransfer> {
    const response = await HttpService.post<CashFlowTransfer>(`${BASE_PATH}/transfers`, data)
    return response.data
  }

  static async deleteTransfer(id: string): Promise<void> {
    await HttpService.delete(`${BASE_PATH}/transfers/${id}`)
  }

  // ============ RULES ============
  static async getRules(query?: RuleQueryDto): Promise<PaginatedResponse<CashFlowRule>> {
    const params = new URLSearchParams()
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const response = await HttpService.get<PaginatedResponse<CashFlowRule>>(`${BASE_PATH}/rules?${params.toString()}`)
    return response.data
  }

  static async getRule(id: string): Promise<CashFlowRule> {
    const response = await HttpService.get<CashFlowRule>(`${BASE_PATH}/rules/${id}`)
    return response.data
  }

  static async createRule(data: CreateRuleDto): Promise<CashFlowRule> {
    const response = await HttpService.post<CashFlowRule>(`${BASE_PATH}/rules`, data)
    return response.data
  }

  static async updateRule(id: string, data: UpdateRuleDto): Promise<CashFlowRule> {
    const response = await HttpService.patch<CashFlowRule>(`${BASE_PATH}/rules/${id}`, data)
    return response.data
  }

  static async deleteRule(id: string): Promise<void> {
    await HttpService.delete(`${BASE_PATH}/rules/${id}`)
  }

  static async dryRunRule(data: DryRunRuleDto): Promise<DryRunResult> {
    const response = await HttpService.post<DryRunResult>(`${BASE_PATH}/rules/dry-run`, data)
    return response.data
  }

  static async applyRule(id: string, accountId?: string): Promise<{ applied: number; transactions: CashFlowTransaction[] }> {
    const params = accountId ? `?accountId=${accountId}` : ""
    const response = await HttpService.post<{ applied: number; transactions: CashFlowTransaction[] }>(
      `${BASE_PATH}/rules/${id}/apply${params}`
    )
    return response.data
  }

  // ============ REPORTS ============
  static async getCashFlowStatement(query: CashFlowStatementDto): Promise<CashFlowStatement | Blob> {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)))
        } else {
          params.append(key, String(value))
        }
      }
    })

    if (query.format === "CSV" || query.format === "PDF") {
      const response = await HttpService.get(`${BASE_PATH}/reports/cash-flow-statement?${params.toString()}`, {
        responseType: "blob",
      })
      return response.data
    }

    const response = await HttpService.get<CashFlowStatement>(
      `${BASE_PATH}/reports/cash-flow-statement?${params.toString()}`
    )
    return response.data
  }

  static async getForecast(query: ForecastDto): Promise<CashFlowForecast | Blob> {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)))
        } else {
          params.append(key, String(value))
        }
      }
    })

    if (query.format === "CSV" || query.format === "PDF") {
      const response = await HttpService.get(`${BASE_PATH}/reports/forecast?${params.toString()}`, {
        responseType: "blob",
      })
      return response.data
    }

    const response = await HttpService.get<CashFlowForecast>(`${BASE_PATH}/reports/forecast?${params.toString()}`)
    return response.data
  }
}
