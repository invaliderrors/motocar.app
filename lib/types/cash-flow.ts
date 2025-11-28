// Cash Flow Types
export enum CashFlowAccountType {
  OPERATING = "OPERATING",
  INVESTING = "INVESTING",
  FINANCING = "FINANCING",
  BANK = "BANK",
  CASH = "CASH",
  OTHER = "OTHER",
}

export enum CashFlowTransactionType {
  INFLOW = "INFLOW",
  OUTFLOW = "OUTFLOW",
}

export enum CashFlowCategory {
  SALES_REVENUE = "SALES_REVENUE",
  SERVICE_REVENUE = "SERVICE_REVENUE",
  LOAN_DISBURSEMENT = "LOAN_DISBURSEMENT",
  INVESTMENT_INCOME = "INVESTMENT_INCOME",
  ASSET_SALE = "ASSET_SALE",
  LOAN_REPAYMENT_RECEIVED = "LOAN_REPAYMENT_RECEIVED",
  OTHER_INCOME = "OTHER_INCOME",
  
  OPERATING_EXPENSE = "OPERATING_EXPENSE",
  PAYROLL = "PAYROLL",
  RENT = "RENT",
  UTILITIES = "UTILITIES",
  MARKETING = "MARKETING",
  LOAN_DISBURSEMENT_OUT = "LOAN_DISBURSEMENT_OUT",
  LOAN_REPAYMENT = "LOAN_REPAYMENT",
  INTEREST_PAYMENT = "INTEREST_PAYMENT",
  TAX_PAYMENT = "TAX_PAYMENT",
  ASSET_PURCHASE = "ASSET_PURCHASE",
  INVENTORY_PURCHASE = "INVENTORY_PURCHASE",
  DIVIDEND_PAYMENT = "DIVIDEND_PAYMENT",
  OTHER_EXPENSE = "OTHER_EXPENSE",
}

export enum ScheduleFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  ANNUALLY = "ANNUALLY",
}

export enum CashFlowScenario {
  BASE = "BASE",
  BEST = "BEST",
  WORST = "WORST",
}

export enum ReportFormat {
  JSON = "JSON",
  CSV = "CSV",
  PDF = "PDF",
}

export interface CashFlowAccount {
  id: string
  name: string
  accountType: CashFlowAccountType
  currency: string
  balance: number
  isActive: boolean
  description?: string
  metadata?: any
  createdAt: string
  updatedAt: string
  transactions?: CashFlowTransaction[]
}

export interface CashFlowTransaction {
  id: string
  accountId: string
  account?: CashFlowAccount
  idempotencyKey: string
  type: CashFlowTransactionType
  amount: number
  currency: string
  category: CashFlowCategory
  date: string
  counterparty?: string
  memo?: string
  reference?: string
  tags?: string[]
  isReconciled: boolean
  transferId?: string
  metadata?: any
  createdById?: string
  createdAt: string
  updatedAt: string
}

export interface CashFlowTransfer {
  id: string
  fromAccountId: string
  toAccountId: string
  fromAccount?: CashFlowAccount
  toAccount?: CashFlowAccount
  amount: number
  currency: string
  exchangeRate?: number
  memo?: string
  transferDate: string
  outflowTransactionId: string
  inflowTransactionId: string
  outflowTransaction?: CashFlowTransaction
  inflowTransaction?: CashFlowTransaction
  createdAt: string
  updatedAt: string
}

export interface CashFlowRule {
  id: string
  name: string
  description?: string
  isActive: boolean
  priority: number
  regexPattern: string
  category: CashFlowCategory
  tags?: string[]
  counterpartyOverride?: string
  metadata?: any
  createdAt: string
  updatedAt: string
}

export interface CashFlowScheduledItem {
  id: string
  name: string
  description?: string
  category: CashFlowCategory
  amount: number
  currency: string
  frequency: ScheduleFrequency
  startDate: string
  endDate?: string
  isActive: boolean
  lastExecutedAt?: string
  nextExecutionAt?: string
  metadata?: any
  createdAt: string
  updatedAt: string
}

export interface ExchangeRate {
  id: string
  fromCurrency: string
  toCurrency: string
  rate: number
  effectiveDate: string
  source?: string
  createdAt: string
  updatedAt: string
}

// Query DTOs
export interface AccountQueryDto {
  page?: number
  limit?: number
  accountType?: CashFlowAccountType
  currency?: string
  isActive?: boolean
  search?: string
}

export interface TransactionQueryDto {
  page?: number
  limit?: number
  accountId?: string
  category?: CashFlowCategory
  type?: CashFlowTransactionType
  currency?: string
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
  counterparty?: string
  tags?: string[]
  isReconciled?: boolean
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface TransferQueryDto {
  page?: number
  limit?: number
  fromAccountId?: string
  toAccountId?: string
  dateFrom?: string
  dateTo?: string
}

export interface RuleQueryDto {
  page?: number
  limit?: number
  isActive?: boolean
  category?: CashFlowCategory
}

// Create/Update DTOs
export interface CreateAccountDto {
  name: string
  accountType: CashFlowAccountType
  currency?: string
  description?: string
  metadata?: any
}

export interface UpdateAccountDto {
  name?: string
  accountType?: CashFlowAccountType
  currency?: string
  description?: string
  isActive?: boolean
  metadata?: any
}

export interface CreateTransactionDto {
  accountId: string
  idempotencyKey: string
  type: CashFlowTransactionType
  amount: number
  currency?: string
  category: CashFlowCategory
  date: string
  counterparty?: string
  memo?: string
  reference?: string
  tags?: string[]
  metadata?: any
}

export interface CreateBatchTransactionsDto {
  transactions: CreateTransactionDto[]
}

export interface UpdateTransactionDto {
  category?: CashFlowCategory
  counterparty?: string
  memo?: string
  reference?: string
  tags?: string[]
  isReconciled?: boolean
  metadata?: any
}

export interface CreateTransferDto {
  fromAccountId: string
  toAccountId: string
  amount: number
  currency?: string
  exchangeRate?: number
  memo?: string
  transferDate: string
  idempotencyKey: string
}

export interface CreateRuleDto {
  name: string
  description?: string
  isActive?: boolean
  priority?: number
  regexPattern: string
  category: CashFlowCategory
  tags?: string[]
  counterpartyOverride?: string
  metadata?: any
}

export interface UpdateRuleDto {
  name?: string
  description?: string
  isActive?: boolean
  priority?: number
  regexPattern?: string
  category?: CashFlowCategory
  tags?: string[]
  counterpartyOverride?: string
  metadata?: any
}

export interface DryRunRuleDto {
  regexPattern: string
  testStrings: string[]
}

// Report DTOs
export interface CashFlowStatementDto {
  startDate: string
  endDate: string
  accountIds?: string[]
  currency?: string
  format?: ReportFormat
}

export interface ForecastDto {
  startDate: string
  weeks?: number
  accountIds?: string[]
  currency?: string
  scenario?: CashFlowScenario
  format?: ReportFormat
}

// Response interfaces
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface BatchTransactionResult {
  results: Array<{
    success: boolean
    transaction?: CashFlowTransaction
    idempotencyKey?: string
    error?: string
  }>
  summary: {
    total: number
    successful: number
    failed: number
  }
}

export interface DryRunResult {
  matches: Array<{
    input: string
    matched: boolean
    matchedText?: string
  }>
}

export interface CashFlowStatement {
  period: {
    startDate: string
    endDate: string
  }
  currency: string
  operatingActivities: {
    inflows: Array<{ category: string; amount: number }>
    outflows: Array<{ category: string; amount: number }>
    netCashFromOperations: number
  }
  investingActivities: {
    inflows: Array<{ category: string; amount: number }>
    outflows: Array<{ category: string; amount: number }>
    netCashFromInvesting: number
  }
  financingActivities: {
    inflows: Array<{ category: string; amount: number }>
    outflows: Array<{ category: string; amount: number }>
    netCashFromFinancing: number
  }
  summary: {
    netCashChange: number
    openingBalance: number
    closingBalance: number
  }
}

export interface ForecastWeek {
  weekNumber: number
  startDate: string
  endDate: string
  projectedInflows: number
  projectedOutflows: number
  netCashFlow: number
  cumulativeCash: number
}

export interface CashFlowForecast {
  startDate: string
  weeks: number
  scenario: CashFlowScenario
  currency: string
  forecast: ForecastWeek[]
  summary: {
    totalProjectedInflows: number
    totalProjectedOutflows: number
    netCashChange: number
    openingBalance: number
    projectedClosingBalance: number
    minimumCash: number
    maximumCash: number
  }
}
