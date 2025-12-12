"use client"

import Link from "next/link"
import { Wallet, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import type { Account } from "@/types"

interface AccountCardProps {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  const isPositive = account.balance >= 0

  return (
    <Link href={`/accounts/${account.id}`}>
      <Card className="group hover:shadow-md transition-all hover:border-primary/50 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-semibold text-lg mb-1">{account.name}</h3>
          <p className={cn("text-2xl font-bold", isPositive ? "text-green-600" : "text-red-600")}>
            ${account.balance.toLocaleString()}
          </p>
          {account.type && <p className="text-sm text-muted-foreground mt-2 capitalize">{account.type}</p>}
        </CardContent>
      </Card>
    </Link>
  )
}
