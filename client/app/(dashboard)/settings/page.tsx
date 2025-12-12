"use client"

import { useAppSelector } from "@/redux/hooks"
import { ChangeUsernameForm } from "@/components/settings/change-username-form"
import { ChangePasswordForm } from "@/components/settings/change-password-form"
import { DeleteAccountCard } from "@/components/settings/delete-account-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { capitalize } from "lodash";

export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-semibold">{capitalize(user?.username) || "User"}</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Forms */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChangeUsernameForm />
        <ChangePasswordForm />
      </div>

      {/* Danger Zone */}
      <DeleteAccountCard />
    </div>
  )
}
