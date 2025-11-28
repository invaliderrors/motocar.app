
type Owner = {
    id: string
    name: string
    username: string
    role: "ADMIN" | "USER" | "MANAGER" | "MODERATOR"
    status: "ACTIVE" | "INACTIVE"
    lastLogin: string
    createdAt: string
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
    createdAt: string
    updatedAt: string
}

export enum VehicleType {
    MOTORCYCLE = "MOTORCYCLE",
    CAR = "CAR",
    TRUCK = "TRUCK",
    VAN = "VAN",
    ATV = "ATV",
    OTHER = "OTHER",
}

export enum VehicleStatus {
    IN_CIRCULATION = "IN_CIRCULATION",
    IN_WORKSHOP = "IN_WORKSHOP",
    SEIZED_BY_PROSECUTOR = "SEIZED_BY_PROSECUTOR",
}

type Vehicle = {
    id: string
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
    createdAt: string
    updatedAt: string
    archivedLoansCount?: number
}

// Legacy type alias for backwards compatibility
type Motorcycle = Vehicle

export type Loan = {
    id: string
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
    notes: string | null
    attachmentUrl: string | null
    createdById: string
    archived: boolean
    createdAt: string
    updatedAt: string
    cashRegisterId: string | null

    loan: Loan

    createdBy?: {
        id: string
        username: string
        name: string
    }
}


type Expense = {
    id: string
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

enum LoanStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    DEFAULTED = "DEFAULTED",
    ARCHIVED = "ARCHIVED",
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
