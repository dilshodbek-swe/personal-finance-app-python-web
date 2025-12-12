import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionRow } from "./transaction-row"
import type { Transaction } from "@/types"

interface RecentTransactionsProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div>
            {transactions.slice(0, 5).map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No recent transactions</p>
        )}
      </CardContent>
    </Card>
  )
}
