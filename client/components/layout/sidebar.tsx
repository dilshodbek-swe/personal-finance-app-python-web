"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Wallet, Settings, LogOut, Menu, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { logout } from "@/redux/slices/auth-slice"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { capitalize } from "lodash";
import { ThemeToggle } from "@/components/ui/theme-toggle"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings },
]

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="p-2 rounded-lg bg-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">FinanceFlow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-end px-2">
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{capitalize(user?.username) || "User"}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">FinanceFlow</span>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <NavContent onClose={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-card border-r">
        <NavContent />
      </aside>
    </>
  )
}
