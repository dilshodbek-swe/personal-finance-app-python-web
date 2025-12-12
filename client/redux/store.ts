import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth-slice"
import financeReducer from "./slices/finance-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    finance: financeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
