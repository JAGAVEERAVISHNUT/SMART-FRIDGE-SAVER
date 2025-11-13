"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, Leaf, BarChart3 } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/add-items", label: "Add", icon: Plus },
    { href: "/inventory", label: "Fridge", icon: Leaf },
    { href: "/dashboard", label: "Impact", icon: BarChart3 },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around items-center h-20 md:top-0 md:right-auto md:left-0 md:flex-col md:h-screen md:w-20 md:border-r md:border-t-0 md:overflow-y-auto">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 w-full h-full md:h-auto md:p-4 transition-colors ${
              isActive ? "text-primary bg-secondary/10" : "text-muted-foreground hover:text-primary"
            }`}
            title={link.label}
          >
            <Icon size={24} />
            <span className="hidden md:inline text-xs">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
