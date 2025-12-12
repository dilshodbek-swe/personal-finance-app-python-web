import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "@/lib/axios-instance"
import type { Account, Transaction, DashboardData, ForecastData, StatsData } from "@/types"

interface FinanceState {
  accounts: Account[]
  transactions: Transaction[]
  dashboard: DashboardData | null
  forecast: ForecastData | null
  stats: StatsData | null
  isLoading: boolean
  error: string | null
}

const initialState: FinanceState = {
  accounts: [],
  transactions: [],
  dashboard: null,
  forecast: null,
  stats: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchDashboard = createAsyncThunk("finance/fetchDashboard", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<DashboardData>("/analysis/dashboard")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch dashboard")
  }
})

export const fetchForecast = createAsyncThunk("finance/fetchForecast", async (months:number = 3, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ForecastData>(`/analysis/forecast`)
    console.log(response);
    
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch forecast")
  }
})

export const fetchStats = createAsyncThunk("finance/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<StatsData>("/analysis/stats")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch stats")
  }
})

export const fetchAccounts = createAsyncThunk("finance/fetchAccounts", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Account[]>("/accounts/")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch accounts")
  }
})

export const createAccount = createAsyncThunk(
  "finance/createAccount",
  async (account: { name: string; balance: number; type?: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<Account>("/accounts/", account)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to create account")
    }
  },
)

export const updateAccount = createAsyncThunk(
  "finance/updateAccount",
  async ({ id, data }: { id: number; data: Partial<Account> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<Account>(`/accounts/${id}`, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update account")
    }
  },
)

export const deleteAccount = createAsyncThunk("finance/deleteAccount", async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/accounts/${id}`)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Failed to delete account")
  }
})

export const fetchTransactions = createAsyncThunk(
  "finance/fetchTransactions",
  async (accountId:string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<Transaction[]>(`/transactions/account/${accountId}`)
      console.log(response);
      
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch transactions")
    }
  },
)

export const createTransaction = createAsyncThunk(
  "finance/createTransaction",
  async (
    transaction: { account_id: string; amount: number; type: string; description: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.post<Transaction>("/transactions/", transaction)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to create transaction")
    }
  },
)

export const deleteTransaction = createAsyncThunk(
  "finance/deleteTransaction",
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/transactions/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete transaction")
    }
  },
)

export const updateTransaction = createAsyncThunk(
  "finance/updateTransaction",
  async (
    { id, data }: { id: number; data: { amount?: number; type?: string; description?: string } },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.put<Transaction>(`/transactions/${id}`, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update transaction")
    }
  },
)

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    clearFinanceError: (state) => {
      state.error = null
    },
    clearTransactions: (state) => {
      state.transactions = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false
        state.dashboard = action.payload
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Forecast
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.forecast = action.payload
      })
      // Stats
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
      // Accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.isLoading = false
        state.accounts = action.payload
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload)
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex((a) => a.id === action.payload.id)
        if (index !== -1) {
          state.accounts[index] = action.payload
        }
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((a) => String(a.id) !== action.payload)
      })
      // Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload)
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload)
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.transactions[index] = action.payload
        }
      })
  },
})

export const { clearFinanceError, clearTransactions } = financeSlice.actions
export default financeSlice.reducer
