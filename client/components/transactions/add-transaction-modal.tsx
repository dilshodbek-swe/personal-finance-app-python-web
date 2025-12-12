"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useAppDispatch } from "@/redux/hooks"
import { createTransaction, fetchTransactions } from "@/redux/slices/finance-slice"
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

const transactionSchema = z.object({
  amount: z.number({ invalid_type_error: "Amount must be a number" }).positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  description: z.string().min(1, "Description is required"),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface AddTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountId: string
}

export function AddTransactionModal({ open, onOpenChange, accountId }: AddTransactionModalProps) {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "income",
      description: "",
    },
  })

  const onSubmit = async (data: TransactionFormData) => {
    try {
      await dispatch(
        createTransaction({
          account_id: accountId,
          ...data,
        }),
      ).unwrap()
      toast.success("Transaction added successfully")
      reset()
      onOpenChange(false)
      // Refresh transactions list
      dispatch(fetchTransactions(accountId))
    } catch (error: any) {
      toast.error(error || "Failed to add transaction")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>Record a new income or expense</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => setValue("type", value as "income" | "expense")} defaultValue="income">
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
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="e.g., Salary, Groceries" {...register("description")} />
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
                  Adding...
                </>
              ) : (
                "Add Transaction"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
