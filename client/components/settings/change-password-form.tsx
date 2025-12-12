"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Lock, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import { useAppDispatch } from "@/redux/hooks"
import { changePassword } from "@/redux/slices/auth-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const passwordSchema = z
  .object({
    new_password: z.string().min(6, "New password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

export function ChangePasswordForm() {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await dispatch(
        changePassword({
          new_password: data.new_password,
          confirm_new_password: data.confirm_password,
        }),
      ).unwrap()
      toast.success("Password changed successfully")
      reset()
    } catch (error: any) {
      toast.error(error || "Failed to change password")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>Update your account password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="pr-10"
                {...register("new_password")}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.new_password && <p className="text-sm text-destructive">{errors.new_password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="pr-10"
                {...register("confirm_password")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm_password && <p className="text-sm text-destructive">{errors.confirm_password.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
