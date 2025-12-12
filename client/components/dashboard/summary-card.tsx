import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface SummaryCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function SummaryCard({ title, value, icon: Icon, trend = "neutral", className }: SummaryCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p
              className={cn(
                "text-2xl font-bold tracking-tight",
                trend === "up" && "text-green-600",
                trend === "down" && "text-red-600",
              )}
            >
              {value}
            </p>
          </div>
          <div
            className={cn(
              "p-3 rounded-lg",
              trend === "up" && "bg-green-100 text-green-600",
              trend === "down" && "bg-red-100 text-red-600",
              trend === "neutral" && "bg-primary/10 text-primary",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
