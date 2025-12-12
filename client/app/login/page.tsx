import { LoginForm } from "@/components/auth/login-form"
import { Wallet } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 rounded-lg bg-primary">
          <Wallet className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">FinanceFlow</h1>
      </div>
      <LoginForm />
    </div>
  )
}
