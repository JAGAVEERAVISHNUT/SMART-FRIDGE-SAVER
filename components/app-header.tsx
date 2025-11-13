"use client"

import { ProfileMenu } from "@/components/profile-menu"

export function AppHeader() {
  return (
    <div className="flex items-center justify-between py-4 px-4 md:px-6 bg-surface border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-surface font-bold text-lg">🌱</span>
        </div>
        <h1 className="text-xl font-bold text-primary hidden sm:inline">SmartFridgeSaver</h1>
      </div>

      <ProfileMenu />
    </div>
  )
}
