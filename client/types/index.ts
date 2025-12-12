// User types
export interface User {
  id: number
  username: string
  email: string
}

// Account types
export interface Account {
  id: number
  name: string
  balance: number
  type?: string
  created_at?: string
}

// Transaction types
export interface Transaction {
  id: number
  account_id: number
  amount: number
  type: "income" | "expense"
  description: string
  created_at?: string
}

// Dashboard types
export interface DashboardData {
  net_worth: number
  monthly_income: number
  monthly_expense: number
  accounts: Account[]
  recent_transactions: Transaction[]
}

// Forecast types
export interface ForecastPoint {
  month: string
  predicted_income: number
}

export interface HistoryPoint {
  month: string
  income: number
}

export interface ForecastData {
  history: HistoryPoint[]
  forecast: ForecastPoint[]
}

// Stats types
export interface StatsData {
  mean: number
  median: number
  max: number
  min: number
  std_dev: number
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  confirm_password: string
}

export interface AuthResponse {
  token: string
}

// API Error
export interface ApiError {
  error: string
}
