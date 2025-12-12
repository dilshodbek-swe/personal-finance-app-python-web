"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Wallet } from "lucide-react"
import toast from "react-hot-toast"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchAccounts, fetchTransactions, deleteAccount, clearTransactions } from "@/redux/slices/finance-slice"
import { TransactionList } from "@/components/transactions/transaction-list"
import { AddTransactionModal } from "@/components/transactions/add-transaction-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AccountDetailPage() {
  const params = useParams()
  const router = useRouter()
  const accountId = params.id

  const [showAddModal, setShowAddModal] = useState(false)
  const dispatch = useAppDispatch()
  const { accounts, transactions, isLoading } = useAppSelector((state) => state.finance)
  console.log(accounts);
  

  const account = accounts.find((a) => String(a.id) === String(accountId))

  useEffect(() => {
    if (accounts.length === 0) {
      dispatch(fetchAccounts())
    }
    dispatch(fetchTransactions(String(accountId)))

    return () => {
      dispatch(clearTransactions())
    }
  }, [dispatch, accountId, accounts.length])

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteAccount(String(accountId))).unwrap()
      toast.success("Account deleted successfully")
      router.push("/accounts")
    } catch (error: any) {
      toast.error(error || "Failed to delete account")
    }
  }

  if (!account && !isLoading) {
    // console.log(account);
    
    return (
      <div className="p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Account not found</h3>
          <p className="text-muted-foreground mb-4">The account you&apos;re looking for doesn&apos;t exist</p>
          <Button onClick={() => router.push("/accounts")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Accounts
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit" onClick={() => router.push("/accounts")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Accounts
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{account?.name || "Loading..."}</h1>
            {account?.type && <p className="text-muted-foreground capitalize">{account.type} Account</p>}
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this account? This action cannot be undone and all associated
                    transactions will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive hover:bg-destructive/90 text-amber-50"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
              <p className={`text-3xl font-bold ${(account?.balance || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${(account?.balance || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <TransactionList transactions={transactions} accountId={String(accountId)} isLoading={isLoading} />
      </div>

      <AddTransactionModal open={showAddModal} onOpenChange={setShowAddModal} accountId={String(accountId)} />
    </div>
  )
}
