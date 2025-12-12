"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"
import { useAppDispatch } from "@/redux/hooks"
import { deleteAccount } from "@/redux/slices/auth-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export function DeleteAccountCard() {
  const [isDeleting, setIsDeleting] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await dispatch(deleteAccount()).unwrap()
      toast.success("Account deleted successfully")
      router.push("/login")
    } catch (error: any) {
      toast.error(error || "Failed to delete account")
      setIsDeleting(false)
    }
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>Irreversible and destructive actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border border-destructive/20 bg-destructive/5">
          <div>
            <p className="font-medium">Delete Account</p>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account, all your financial accounts,
                  and all transaction history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-amber-50 hover:bg-destructive/90"
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
