import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axiosInstance from "@/lib/axios-instance"
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from "@/types"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
  isLoading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", credentials)
    const { token } = response.data
    localStorage.setItem("token", token)
    return { token }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Login failed")
  }
})

export const register = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/register", credentials)
      return true
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Registration failed")
    }
  },
)

export const fetchUserProfile = createAsyncThunk("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<User>("/users/profile")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch profile")
  }
})

export const changeUsername = createAsyncThunk("auth/changeUsername", async (username: string, { rejectWithValue }) => {
  try {
    await axiosInstance.put("/users/change-username", { username })
    return username
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Failed to change username")
  }
})

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { new_password, confirm_new_password }: { new_password: string; confirm_new_password: string },
    { rejectWithValue },
  ) => {
    try {
      await axiosInstance.put("/users/change-password", { new_password, confirm_new_password })
      return true
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to change password")
    }
  },
)

export const deleteAccount = createAsyncThunk("auth/deleteAccount", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.delete("/users/delete")
    localStorage.removeItem("token")
    return true
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Failed to delete account")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
    },
    clearError: (state) => {
      state.error = null
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Change Username
      .addCase(changeUsername.fulfilled, (state, action) => {
        if (state.user) {
          state.user.username = action.payload
        }
      })
      // Delete Account
      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { logout, clearError, setToken } = authSlice.actions
export default authSlice.reducer
