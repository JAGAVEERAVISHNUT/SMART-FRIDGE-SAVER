"use client"

import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

interface GroceryCardProps {
  name: string
  category: string
  expiryDate: string
  quantity: number
  onRemove?: () => void
}

export function GroceryCard({ name, category, expiryDate, quantity, onRemove }: GroceryCardProps) {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const getStatus = () => {
    if (daysUntilExpiry < 0) return { label: "Expired", icon: AlertCircle, color: "text-destructive" }
    if (daysUntilExpiry <= 2) return { label: "Expiring Soon", icon: AlertCircle, color: "text-orange-500" }
    if (daysUntilExpiry <= 7) return { label: "Use Soon", icon: Clock, color: "text-yellow-500" }
    return { label: "Fresh", icon: CheckCircle2, color: "text-primary" }
  }

  const status = getStatus()
  const StatusIcon = status.icon

  return (
    <div className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{category}</p>
        </div>
        {onRemove && (
          <button onClick={onRemove} className="ml-2 text-muted-foreground hover:text-destructive transition-colors">
            ×
          </button>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="bg-secondary px-2 py-1 rounded">Qty: {quantity}</span>
        <div className={`flex items-center gap-1 ${status.color}`}>
          <StatusIcon size={14} />
          <span className={`font-medium ${status.color}`}>{status.label}</span>
        </div>
      </div>
      {daysUntilExpiry >= 0 && <p className="text-xs text-muted-foreground mt-2">Expires in {daysUntilExpiry} days</p>}
    </div>
  )
}
