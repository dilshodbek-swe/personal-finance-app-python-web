"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { StatsData } from "@/types"

interface StatsCardProps {
  stats: StatsData | null
  isLoading?: boolean
}

export function StatsCard({ stats, isLoading }: StatsCardProps) {
  const formatNumber = (num: number) => `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>Transaction analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>Transaction analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">No data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Transaction analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Mean</span>
            <span className="font-medium">{formatNumber(stats.mean)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Median</span>
            <span className="font-medium">{formatNumber(stats.median)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Max</span>
            <span className="font-medium text-green-600">{formatNumber(stats.max)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Min</span>
            <span className="font-medium text-red-600">{formatNumber(stats.min)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Std Dev</span>
            <span className="font-medium">{formatNumber(stats.std_dev)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
