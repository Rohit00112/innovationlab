'use client'

import { useState, useEffect } from "react"
import { User, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogoutButton } from "@/components/logout-button"

interface UserRecord {
  id: number
  email: string
  name: string | null
  avatarUrl: string | null
  role: string
  status: string
}

export function UserMenu() {
  const [user, setUser] = useState<UserRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (isLoading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
    )
  }

  if (!user) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <a href="/login" className="text-xs uppercase tracking-wider">
          Login
        </a>
      </Button>
    )
  }

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email[0].toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.name || user.email} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              {user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton variant="ghost" size="sm" className="w-full justify-start p-0 h-auto">
            <span className="px-2 py-1.5 text-sm">Logout</span>
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
