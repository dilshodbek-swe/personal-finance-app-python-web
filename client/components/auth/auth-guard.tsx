"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { fetchUserProfile, setToken } from "@/redux/slices/auth-slice"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

      if (!isAuthenticated) {
        dispatch(setToken(token))
      }

      if (!user) {
        try {
          await dispatch(fetchUserProfile()).unwrap()
        } catch {
          router.push("/login")
          return
        }
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [dispatch, router, isAuthenticated, user])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
