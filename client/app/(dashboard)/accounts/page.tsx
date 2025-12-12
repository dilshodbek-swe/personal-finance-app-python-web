"use client"

import { useEffect, useState } from "react"
import { Plus, Wallet } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchAccounts } from "@/redux/slices/finance-slice"
import { AccountCard } from "@/components/accounts/account-card"
import { AddAccountModal } from "@/components/accounts/add-account-modal"
import { Button } from "@/components/ui/button"

export default function AccountsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const dispatch = useAppDispatch()
  const { accounts, isLoading } = useAppSelector((state) => state.finance)

  useEffect(() => {
    dispatch(fetchAccounts())
  }, [dispatch])

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Accounts</h1>
          <p className="text-muted-foreground">Manage your financial accounts</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Account Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No accounts yet</h3>
          <p className="text-muted-foreground mb-4">Create your first account to start tracking your finances</p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      )}

      <AddAccountModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
