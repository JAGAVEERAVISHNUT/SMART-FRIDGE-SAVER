"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { AppHeader } from "@/components/app-header"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, AlertCircle, Trash2 } from "lucide-react"

interface GroceryItem {
  id: string
  name: string
  category: string
  expiryDate: string
  quantity: number
}

interface Notification {
  id: string
  itemName: string
  daysUntilExpiry: number
  message: string
  createdAt: string
  severity: "warning" | "critical"
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    generateNotifications()
  }, [])

  const generateNotifications = () => {
    const stored = localStorage.getItem("groceryItems")
    if (!stored) return

    try {
      const items: GroceryItem[] = JSON.parse(stored)
      const today = new Date()
      const newNotifications: Notification[] = []

      items.forEach((item) => {
        const expiryDate = new Date(item.expiryDate)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry <= 3 && daysUntilExpiry >= 0) {
          newNotifications.push({
            id: item.id,
            itemName: item.name,
            daysUntilExpiry,
            message:
              daysUntilExpiry === 0
                ? "Expires today!"
                : `Expires in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? "s" : ""}`,
            createdAt: new Date().toISOString(),
            severity: daysUntilExpiry === 0 ? "critical" : "warning",
          })
        } else if (daysUntilExpiry < 0) {
          newNotifications.push({
            id: item.id,
            itemName: item.name,
            daysUntilExpiry,
            message: "This item has expired",
            createdAt: new Date().toISOString(),
            severity: "critical",
          })
        }
      })

      setNotifications(newNotifications.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry))
    } catch (e) {
      console.error("Failed to generate notifications", e)
    }
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <ProtectedRoute>
      <div className="pb-24 md:ml-20 bg-background min-h-screen">
        <AppHeader />
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Bell className="text-primary" size={28} />
                Notifications
              </h2>
              <p className="text-muted-foreground">Stay updated on your expiring items</p>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <Card className="border-border bg-surface/50">
              <CardContent className="py-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bell className="text-primary" size={32} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Notifications</h3>
                <p className="text-muted-foreground">Great job! All your items are fresh and ready to use.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`border-l-4 ${
                    notification.severity === "critical"
                      ? "border-l-error bg-error/5 border border-error/20"
                      : "border-l-accent bg-accent/5 border border-accent/20"
                  }`}
                >
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`p-2 rounded-lg ${
                          notification.severity === "critical" ? "bg-error/20" : "bg-accent/20"
                        }`}
                      >
                        <AlertCircle
                          className={notification.severity === "critical" ? "text-error" : "text-accent"}
                          size={20}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{notification.itemName}</p>
                        <p className={`text-sm ${notification.severity === "critical" ? "text-error" : "text-accent"}`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                      title="Dismiss notification"
                    >
                      <Trash2 size={18} />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card className="border-border mt-8 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Bell size={20} className="text-primary" />
                Tips for Managing Items
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Use items that are about to expire first</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Consider freezing items before they expire</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Plan meals around expiring items</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
