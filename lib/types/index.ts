
export enum StoreStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
}

export type Store = {
    id: string
    name: string
    code: string // Short code for the store (e.g., "BOG-01", "MED-02")
    address: string
    city: string
    phone?: string | null
    nit?: string | null // Tax identification number
    status: StoreStatus
    createdAt: string
    updatedAt: string
}

type Owner = {
    id: string
    name: string
    username: string
    role: "ADMIN" | "EMPLOYEE"
    status: "ACTIVE" | "INACTIVE"
    lastLogin: string
    createdAt: string
    storeId?: string | null // NULL for ADMIN, REQUIRED for EMPLOYEE
    store?: Store
    permissions?: any // PermissionsMap
}


type User = {
    id: string
    name: string
    identification: string
    idIssuedAt: string
    age: number
    phone: string
    address: string
    city: string
    refName: string
    refID: string
    refPhone: string
    storeId: string
    store?: Store
    createdAt: string
    updatedAt: string
}

export enum VehicleType {
    MOTORCYCLE = "MOTORCYCLE",
    MOTOCAR = "MOTOCAR",
    MOTOLOAD = "MOTOLOAD",
    OTHER = "OTHER",
}

export enum VehicleStatus {
    IN_CIRCULATION = "IN_CIRCULATION",
    NOT_IN_CIRCULATION = "NOT_IN_CIRCULATION",
    IN_WORKSHOP = "IN_WORKSHOP",
    SEIZED_BY_PROSECUTOR = "SEIZED_BY_PROSECUTOR",
    SEIZED_BY_TRANSIT = "SEIZED_BY_TRANSIT",
    FINALIZED = "FINALIZED",
}

type Vehicle = {
    id: string
    storeId: string
    store?: Store
    providerId: string
    provider: Provider
    vehicleType: VehicleType
    status: VehicleStatus
    brand: string
    model: string
    plate: string
    price?: number
    engine?: string
    chassis?: string
    color: string | null
    cc: number | null
    gps: number | null
    soatDueDate?: string | null
    technomechDueDate?: string | null
    createdAt: string
    updatedAt: string
    archivedLoansCount?: number
}

// Legacy type alias for backwards compatibility
type Motorcycle = Vehicle

export type Loan = {
    id: string
    storeId: string
    store?: Store
    userId: string
    contractNumber: string | null
    vehicleId: string
    totalAmount: number
    downPayment: number
    installments: number
    paidInstallments: number
    remainingInstallments: number
    totalPaid: number
    debtRemaining: number
    interestRate: number
    interestType: "FIXED" | "COMPOUND" | undefined
    paymentFrequency: "DAILY" | "MONTHLY" | "BIWEEKLY" | "WEEKLY" | undefined
    installmentPaymentAmmount: number
    gpsInstallmentPayment: number
    archived: boolean
    createdAt: string
    updatedAt: string
    startDate: string
    endDate: string | null
    status: LoanStatus
    payments: Installment[]
    user: User
    vehicle: Vehicle
    // Legacy property for backwards compatibility
    motorcycleId?: string
    motorcycle?: Vehicle
}


type Installment = {
    id: string
    loanId: string
    paymentMethod: PaymentMethod
    amount: number
    gps: number
    paymentDate: string
    isLate: boolean
    latePaymentDate: string | null
    advancePaymentDate: string | null
    dueDate: string | null
    notes: string | null
    attachmentUrl: string | null
    createdById: string
    archived: boolean
    createdAt: string
    updatedAt: string
    cashRegisterId: string | null
    
    // Current loan status (calculated by API - ONLY set on most recent installment per loan)
    // WARNING: This represents the CURRENT loan status, not the status when this installment was created
    // For displaying individual installment status, use isLate/isAdvance flags instead
    currentDaysBehind?: number
    lastCoveredDate?: string | null
    isAdvance?: boolean
    isLatestInstallment?: boolean
    
    // Exact decimal precision fields for late payments (ONLY on most recent installment)
    exactInstallmentsOwed?: number  // e.g., 1.129032258 installments
    remainingAmountOwed?: number    // e.g., $35,000
    
    // Payment status AFTER payment is applied (stored in database)
    // These fields represent the loan status AFTER this payment was processed
    daysBehind?: number       // Days behind AFTER this payment (0 if caught up or ahead)
    daysAhead?: number        // Days ahead AFTER this payment (0 if behind or exactly current)
    isUpToDate?: boolean      // Loan is exactly current after payment (owes 0 days)
    daysCoveredByPayment?: number // Days this specific payment covers

    loan: Loan

    createdBy?: {
        id: string
        username: string
        name: string
    }
}


type Expense = {
    id: string
    storeId: string
    store?: Store
    amount: number
    date: string
    providerId: string | null
    provider: Provider | null
    category: ExpenseCategory
    paymentMethod: PaymentMethod
    beneficiary: string
    reference: string | null
    description: string
    attachmentUrl: string | null
    cashRegisterId: string | null
    createdById: string | null
    createdBy?: {
        id: string
        username: string
    }
    createdAt: string
    updatedAt: string
}


type Provider = {
    id: string
    storeId: string
    store?: Store
    name: string
    vehicles: Vehicle[]
    motorcylces?: Motorcycle[] // Legacy property for backwards compatibility
    cashRegisters: Closing[]
    createdAt: string
    updatedAt: string
}

export interface ProviderStats {
    id: string
    name: string
    totalVehicles: number
    activeLoans: number
    completedLoans: number
    totalRevenue: number
    pendingPayments: number
    totalCashRegisters: number
    lastCashRegisterDate: string | null
    totalExpenses: number
    vehiclesByStatus: {
        AVAILABLE: number
        RENTED: number
        MAINTENANCE: number
        SOLD: number
    }
    recentActivity: {
        lastLoan: string | null
        lastPayment: string | null
        lastExpense: string | null
    }
    financialSummary: {
        totalIncome: number
        totalExpenses: number
        netProfit: number
    }
}

export interface ProviderDetails {
    provider: {
        id: string
        name: string
        createdAt: string
        updatedAt: string
    }
    stats: ProviderStats
    recentVehicles: Array<{
        id: string
        brand: string
        model: string
        year: number
        plate: string
        status: string
        purchasePrice: number
        createdAt: string
    }>
    recentLoans: Array<{
        id: string
        loanAmount: number
        status: string
        startDate: string
        vehicle: {
            brand: string
            model: string
            plate: string
        }
        user: {
            name: string
        }
    }>
    recentExpenses: Array<{
        id: string
        description: string
        amount: number
        category: string
        date: string
    }>
}

export interface Closing {
    id: string
    date: string
    providerId: string
    cashInRegister: number
    cashFromTransfers: number
    cashFromCards: number
    notes: string
    createdAt: string
    updatedAt: string
    createdById: string

    payments: Installment[]
    expense: Expense[]

    createdBy: Pick<Owner, 'id' | 'username' | 'name'>
    provider: Provider
}


type SummaryData = {
    totalIncome: number
    totalExpenses: number
    balance: number
    previousDayComparison: number
    paymentMethods: {
        cash: number
        transfer: number
        card: number
        other: number
    }
    expenseMethods: {
        CASH?: number
        TRANSACTION?: number
        CARD?: number
    }
    categories: {
        loanPayments: number
        otherIncome: number
        expenses: Record<string, number>
    }
}

export interface LoginPayload {
    username: string
    password: string
}

export interface LoginResponse {
    access_token: string
    refresh_token: string
    user: {
        id: string
        username: string
        roles: string[]
        status: string
        createdAt: string
        updatedAt: string
        lastAccess: string
    }
}

export enum PaymentMethods {
    CASH = "CASH",
    TRANSACTION = "TRANSACTION",
    CARD = "CARD",
}

export enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    TRANSACTION = "TRANSACTION",
}

export enum ExpenseCategory {
    RENT = "RENT",
    SERVICES = "SERVICES",
    SALARIES = "SALARIES",
    TAXES = "TAXES",
    MAINTENANCE = "MAINTENANCE",
    PURCHASES = "PURCHASES",
    MARKETING = "MARKETING",
    TRANSPORT = "TRANSPORT",
    OTHER = "OTHER",
}

export enum LoanStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    DEFAULTED = "DEFAULTED",
    ARCHIVED = "ARCHIVED",
    ARCHIVED_BY_DEFAULT = "ARCHIVED_BY_DEFAULT",
    ARCHIVED_BY_THEFT = "ARCHIVED_BY_THEFT",
    ARCHIVED_BY_PROSECUTOR = "ARCHIVED_BY_PROSECUTOR",
    RESTARTED_BY_DEFAULT = "RESTARTED_BY_DEFAULT",
    COMPLETED_BY_THEFT = "COMPLETED_BY_THEFT",
    COMPLETED_BY_PROSECUTOR = "COMPLETED_BY_PROSECUTOR",
    IMMOBILIZED_BY_TRAFFIC = "IMMOBILIZED_BY_TRAFFIC",
}

export enum Providers {
    MOTOFACIL = "Moto Facil",
    TITO = "Tito",
    OBRASOCIAL = "Obra Social",
}

export type {
    Owner,
    Installment,
    User,
    Provider,
    Vehicle,
    Motorcycle,
    Expense,
    SummaryData
}

export type FilterState = {
    searchTerm: string
    month: string
    providerFilter: string
    statusFilter: string
}

export type PaginationState = {
    currentPage: number
    itemsPerPage: string
}

export type CashRegisterDisplay = {
    id: string
    date: string
    time: string
    user: string
    provider?: Provider
    totalBasePayments: number
    totalGpsPayments: number
    totalIncome: number
    totalExpense: number
    balance: number
    status: "balanced" | "minor-diff" | "major-diff"
    cashInRegister: number
    cashFromTransfers: number
    cashFromCards: number
    notes: string
    raw: Closing
}

export enum NewsType {
    LOAN_SPECIFIC = "LOAN_SPECIFIC",
    STORE_WIDE = "STORE_WIDE",
}

export enum NewsCategory {
    WORKSHOP = "WORKSHOP",
    MAINTENANCE = "MAINTENANCE",
    ACCIDENT = "ACCIDENT",
    THEFT = "THEFT",
    DAY_OFF = "DAY_OFF",
    HOLIDAY = "HOLIDAY",
    SYSTEM_MAINTENANCE = "SYSTEM_MAINTENANCE",
    WEEKLY_SKIP = "WEEKLY_SKIP",
    OTHER = "OTHER",
}

export type News = {
    id: string
    type: NewsType
    category: NewsCategory
    title: string
    description: string
    notes: string | null
    startDate: string
    endDate: string | null
    isActive: boolean
    autoCalculateInstallments: boolean
    daysUnavailable: number | null
    installmentsToSubtract: number | null
    // Recurring date configuration
    isRecurring: boolean
    recurringDay: number | null
    recurringMonths: number[]
    skippedDates: string[]
    // Weekday skip configuration
    skipWeekday: number | null
    applyToHistoricalLoans: boolean
    // Vehicle type filter
    vehicleType: VehicleType | null
    storeId: string
    store?: Store
    loanId: string | null
    loan?: Loan
    createdById: string
    createdBy?: Owner
    createdAt: string
    updatedAt: string
}
