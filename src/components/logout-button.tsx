'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function LogoutButton({ 
  variant = "ghost", 
  size = "default", 
  className,
  showIcon = true,
  children = "Logout"
}: LogoutButtonProps) {
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
       
        router.push("/")
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
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {size !== "icon" && <span className="ml-2">Logging out...</span>}
        </>
      ) : (
        <>
          {showIcon && <LogOut className="h-4 w-4" />}
          {size !== "icon" && <span className={showIcon ? "ml-2" : ""}>{children}</span>}
        </>
      )}
    </Button>
  )
}
