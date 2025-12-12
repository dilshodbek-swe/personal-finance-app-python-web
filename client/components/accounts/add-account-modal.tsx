"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useAppDispatch } from "@/redux/hooks"
import { createAccount } from "@/redux/slices/finance-slice"
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


const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  balance: z.number({ invalid_type_error: "Balance must be a number" }),
})

type AccountFormData = z.infer<typeof accountSchema>

interface AddAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddAccountModal({ open, onOpenChange }: AddAccountModalProps) {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      balance: 0,
    },
  })

  const onSubmit = async (data: AccountFormData) => {
    try {
      await dispatch(createAccount(data)).unwrap()
      toast.success("Account created successfully")
      reset()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error || "Failed to create account")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>Create a new account to track your finances</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Account Name</Label>
              <Input id="name" placeholder="e.g., Main Checking" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Initial Balance</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance", { valueAsNumber: true })}
              />
              {errors.balance && <p className="text-sm text-destructive">{errors.balance.message}</p>}
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
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
