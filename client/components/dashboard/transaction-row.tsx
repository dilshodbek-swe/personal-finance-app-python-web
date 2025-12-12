import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/types"

interface TransactionRowProps {
  transaction: Transaction
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const isIncome = transaction.type === "income"

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-full", isIncome ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
          {isIncome ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-muted-foreground capitalize">{transaction.type}</p>
        </div>
      </div>
      <p className={cn("font-semibold", isIncome ? "text-green-600" : "text-red-600")}>
        {isIncome ? "+" : "-"}${Math.abs(transaction.amount).toLocaleString()}
      </p>
    </div>
  )
}
