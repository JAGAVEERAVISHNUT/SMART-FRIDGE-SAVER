"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Bell, User } from "lucide-react"
import { logout } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface UserProfile {
  name: string
  email: string
}

export function ProfileMenu() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({ name: "", email: "" })
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch {
        const userEmail = localStorage.getItem("userEmail")
        if (userEmail) {
          setProfile((prev) => ({ ...prev, email: userEmail }))
        }
      }
    } else {
      const userEmail = localStorage.getItem("userEmail")
      if (userEmail) {
        setProfile({ name: userEmail.split("@")[0], email: userEmail })
      }
    }

    // Simulate notification count (you can replace this with actual data fetching)
    const count = localStorage.getItem("notificationCount")
    if (count) {
      setNotificationCount(Number.parseInt(count))
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const displayName = profile.name || profile.email?.split("@")[0] || "User"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/10 transition-colors">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full">
            <User size={16} className="text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground hidden sm:inline">{displayName}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{displayName}</span>
            <span className="text-xs text-muted-foreground">{profile.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Notifications Section */}
        <Link href="/notifications">
          <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={16} />
              <span>Notifications</span>
            </div>
            {notificationCount > 0 && (
              <Badge variant="default" className="ml-auto">
                {notificationCount}
              </Badge>
            )}
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        {/* Profile Link */}
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
            <User size={16} />
            <span>Profile Settings</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer flex items-center gap-2 text-destructive hover:bg-destructive/10"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
