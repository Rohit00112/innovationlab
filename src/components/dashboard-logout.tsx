'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"

import { SidebarMenuButton } from "@/components/ui/sidebar"

export function DashboardLogout() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        // Redirect to login page after successful logout
        router.push("/login")
        router.refresh()
      } else {
        console.error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <SidebarMenuButton onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </>
      )}
    </SidebarMenuButton>
  )
}
