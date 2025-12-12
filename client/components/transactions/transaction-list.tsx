"use client"

import { useState } from "react"
import { Trash2, Pencil, ArrowUpRight, ArrowDownRight } from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/redux/hooks"
import { deleteTransaction, fetchTransactions } from "@/redux/slices/finance-slice"
import { Button } from "@/components/ui/button"
import { EditTransactionModal } from "./edit-transaction-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Transaction } from "@/types"

interface TransactionListProps {
  transactions: Transaction[]
  accountId: string
  isLoading?: boolean
}

export function TransactionList({ transactions, accountId, isLoading }: TransactionListProps) {
  const dispatch = useAppDispatch()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null)

  const handleDelete = async () => {
    if (!transactionToDelete) return

    try {
      await dispatch(deleteTransaction(transactionToDelete)).unwrap()
      toast.success("Transaction deleted")
      dispatch(fetchTransactions(accountId))
      setDeleteDialogOpen(false)
      setTransactionToDelete(null)
    } catch (error: any) {
      toast.error(error || "Failed to delete transaction")
    }
  }

  const openDeleteDialog = (id: number) => {
    setTransactionToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setShowEditModal(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card">
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
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No transactions found for this account</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === "income"
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    isIncome ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600",
                  )}
                >
                  {isIncome ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground capitalize">{transaction.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className={cn("font-semibold", isIncome ? "text-green-600" : "text-red-600")}>
                  {isIncome ? "+" : "-"}${Math.abs(transaction.amount).toLocaleString()}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => handleEdit(transaction)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit transaction</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => openDeleteDialog(transaction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete transaction</span>
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <EditTransactionModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        transaction={editingTransaction}
        accountId={accountId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-amber-50 hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
