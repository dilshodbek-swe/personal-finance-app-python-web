"use client"

import { Toaster } from "react-hot-toast"

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: "1px solid hsl(var(--border))",
        },
        success: {
          iconTheme: {
            primary: "hsl(142.1 76.2% 36.3%)",
            secondary: "white",
          },
        },
        error: {
          iconTheme: {
            primary: "hsl(var(--destructive))",
            secondary: "white",
          },
        },
      }}
    />
  )
}
