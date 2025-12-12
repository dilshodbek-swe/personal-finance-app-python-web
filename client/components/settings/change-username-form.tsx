"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, User } from "lucide-react"
import toast from "react-hot-toast"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { changeUsername } from "@/redux/slices/auth-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const usernameSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
})

type UsernameFormData = z.infer<typeof usernameSchema>

export function ChangeUsernameForm() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: user?.username || "",
    },
  })

  const onSubmit = async (data: UsernameFormData) => {
    try {
      await dispatch(changeUsername(data.username)).unwrap()
      toast.success("Username updated successfully")
    } catch (error: any) {
      toast.error(error || "Failed to update username")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Change Username
        </CardTitle>
        <CardDescription>Update your public display name</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter new username" {...register("username")} />
            {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
          </div>
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
        </form>
      </CardContent>
    </Card>
  )
}
