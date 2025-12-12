"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useAppDispatch } from "@/redux/hooks"
import { updateTransaction, fetchTransactions } from "@/redux/slices/finance-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "@/types"

const transactionSchema = z.object({
  amount: z.number({ invalid_type_error: "Amount must be a number" }).positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  description: z.string().min(1, "Description is required"),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface EditTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
  accountId: string
}

export function EditTransactionModal({ open, onOpenChange, transaction, accountId }: EditTransactionModalProps) {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  })

  useEffect(() => {
    if (transaction) {
      setValue("amount", Math.abs(transaction.amount))
      setValue("type", transaction.type as "income" | "expense")
      setValue("description", transaction.description)
    }
  }, [transaction, setValue])

  const onSubmit = async (data: TransactionFormData) => {
    if (!transaction) return

    try {
      await dispatch(
        updateTransaction({
          id: transaction.id,
          data,
        }),
      ).unwrap()
      toast.success("Transaction updated successfully")
      reset()
      onOpenChange(false)
      dispatch(fetchTransactions(accountId))
    } catch (error: any) {
      toast.error(error || "Failed to update transaction")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>Update the transaction details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                onValueChange={(value) => setValue("type", value as "income" | "expense")}
                defaultValue={transaction?.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input id="edit-description" placeholder="e.g., Salary, Groceries" {...register("description")} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
