"use client"

import { useEffect } from "react"
import { DollarSign, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchDashboard, fetchForecast, fetchStats } from "@/redux/slices/finance-slice"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { ForecastChart } from "@/components/dashboard/forecast-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Button } from "@/components/ui/button"
import { capitalize } from "lodash"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { dashboard, forecast, stats, isLoading } = useAppSelector((state) => state.finance)
  const { user } = useAppSelector((state) => state.auth)
  console.log(forecast);
  
  useEffect(() => {
    dispatch(fetchDashboard())
    dispatch(fetchForecast(3))
    dispatch(fetchStats())
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(fetchDashboard())
    dispatch(fetchForecast(3))
    dispatch(fetchStats())
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, {capitalize(user?.username) || "User"}</h1>
          <p className="text-muted-foreground">Here&apos;s your financial overview</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Net Worth"
          value={`$${(dashboard?.net_worth || 0).toLocaleString()}`}
          icon={DollarSign}
          trend="neutral"
        />
        <SummaryCard
          title="Income (This Month)"
          value={`$${(dashboard?.monthly_income || 0).toLocaleString()}`}
          icon={TrendingUp}
          trend="up"
        />
        <SummaryCard
          title="Expenses (This Month)"
          value={`$${(dashboard?.monthly_expense || 0).toLocaleString()}`}
          icon={TrendingDown}
          trend="down"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ForecastChart data={forecast} isLoading={isLoading} />
        </div>
        <div>
          <StatsCard stats={stats} isLoading={isLoading} />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={dashboard?.recent_transactions || []} isLoading={isLoading} />
    </div>
  )
}
