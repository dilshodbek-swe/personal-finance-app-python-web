import type React from "react"

import { AuthGuard } from "@/components/auth/auth-guard"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30">
        <Sidebar />
        {/* Main Content */}
        <main className="lg:pl-72">
          <div className="pt-16 lg:pt-0">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
