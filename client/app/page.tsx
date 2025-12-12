import Link from "next/link"
import { Wallet, ArrowRight, TrendingUp, PieChart, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinanceFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Take Control of Your <span className="text-primary">Financial Future</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
            Track your accounts, monitor transactions, and predict your financial growth with AI-powered forecasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="p-6 rounded-xl border bg-card">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Forecasting</h3>
            <p className="text-muted-foreground">
              AI-powered linear regression predicts your future income and expenses.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-card">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <PieChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Visual Analytics</h3>
            <p className="text-muted-foreground">
              Beautiful charts and graphs help you understand your spending patterns.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-card">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your financial data is encrypted and never shared with third parties.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
