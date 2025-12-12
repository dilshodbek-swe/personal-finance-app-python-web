"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { ForecastData } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface ForecastChartProps {
  data: ForecastData | null
  isLoading?: boolean
}

export function ForecastChart({ data, isLoading }: ForecastChartProps) {
  console.log(data);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Forecast</CardTitle>
          <CardDescription>Historical data with linear regression prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Combine history and forecast data for the chart
  const chartData: Array<{ month: string; history: number | null; forecast: number | null }> = [
    ...(data?.history || []).map((point) => ({
      month: point.month,
      history: point.income,
      forecast: null,
    })),
    ...(data?.forecast || []).map((point) => ({
      month: point.month,
      history: null,
      forecast: point.predicted_income,
    })),
  ]

  // Connect history to forecast by adding the last history point to forecast
  if (data?.history?.length && data?.forecast?.length) {
  const lastHistory = data.history[data.history.length - 1]
  const firstForecastIndex = data.history.length

  if (chartData[firstForecastIndex]) {
    chartData[firstForecastIndex - 1] = {
      ...chartData[firstForecastIndex - 1],
      forecast: lastHistory.income,   // FIXED
    }
  }
}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Forecast</CardTitle>
        <CardDescription>Historical data with linear regression prediction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="history"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                name="Historical"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2 }}
                name="Forecast"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
