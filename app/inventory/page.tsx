"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/layout/navigation"
import { GroceryCard } from "@/components/grocery-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Leaf, Filter } from "lucide-react"

interface GroceryItem {
  id: string
  name: string
  category: string
  expiryDate: string
  quantity: number
}

function InventoryContent() {
  const router = useRouter()
  const [items, setItems] = useState<GroceryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [isLoading, setIsLoading] = useState(true)

  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    return user.id || null
  }

  useEffect(() => {
    // Load items from localStorage with user-specific key
    const userId = getCurrentUserId()
    if (userId) {
      const userItemsKey = `groceryItems_${userId}`
      const stored = localStorage.getItem(userItemsKey)
      if (stored) {
        try {
          setItems(JSON.parse(stored))
        } catch (e) {
          console.error("Failed to load items", e)
        }
      }
    }
    setIsLoading(false)
  }, [])

  const categories = ["All", ...new Set(items.map((item) => item.category))]

  const filteredItems = selectedCategory === "All" ? items : items.filter((item) => item.category === selectedCategory)

  const expiringItems = filteredItems.filter((item) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    return daysUntilExpiry <= 3 && daysUntilExpiry >= 0
  })

  const expiredItems = filteredItems.filter((item) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    return daysUntilExpiry < 0
  })

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id)
    setItems(updated)
    const userId = getCurrentUserId()
    if (userId) {
      const userItemsKey = `groceryItems_${userId}`
      localStorage.setItem(userItemsKey, JSON.stringify(updated))
    }
  }

  const clearExpired = () => {
    const updated = items.filter((item) => {
      const daysUntilExpiry = Math.ceil(
        (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      )
      return daysUntilExpiry >= 0
    })
    setItems(updated)
    const userId = getCurrentUserId()
    if (userId) {
      const userItemsKey = `groceryItems_${userId}`
      localStorage.setItem(userItemsKey, JSON.stringify(updated))
    }
  }

  return (
    <div className="pb-24 md:ml-20">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Digital Fridge</h1>
            <p className="text-muted-foreground">{items.length} items stored</p>
          </div>
          <Button
            onClick={() => router.push("/add-items")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            + Add Items
          </Button>
        </div>

        {/* Alerts */}
        {(expiredItems.length > 0 || expiringItems.length > 0) && (
          <div className="mb-6 space-y-3">
            {expiredItems.length > 0 && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-4 flex items-start gap-4">
                  <AlertCircle className="text-destructive mt-1" size={20} />
                  <div className="flex-1">
                    <p className="font-semibold text-destructive">{expiredItems.length} expired items</p>
                    <p className="text-sm text-muted-foreground">Remove these items from your fridge</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearExpired}
                    className="text-destructive bg-transparent"
                  >
                    Clear
                  </Button>
                </CardContent>
              </Card>
            )}

            {expiringItems.length > 0 && (
              <Card className="border-orange-500/50 bg-orange-500/5">
                <CardContent className="p-4 flex items-start gap-4">
                  <AlertCircle className="text-orange-500 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="font-semibold text-orange-500">{expiringItems.length} items expiring soon</p>
                    <p className="text-sm text-muted-foreground">Check reminders for these items</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Category Filter */}
        {items.length > 0 && (
          <Card className="border-border mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Filter size={18} />
                <CardTitle className="text-lg">Filter by Category</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Items Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <Leaf className="text-primary" size={32} />
            </div>
            <p className="mt-4 text-muted-foreground">Loading your inventory...</p>
          </div>
        ) : items.length === 0 ? (
          <Card className="border-border text-center py-12">
            <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
              <Leaf className="text-primary" size={32} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Your fridge is empty</h3>
            <p className="text-muted-foreground mb-6">Start by adding items to track your groceries</p>
            <Button
              onClick={() => router.push("/add-items")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Add Your First Item
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <GroceryCard
                key={item.id}
                name={item.name}
                category={item.category}
                expiryDate={item.expiryDate}
                quantity={item.quantity}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function InventoryPage() {
  return (
    <ProtectedRoute>
      <InventoryContent />
    </ProtectedRoute>
  )
}
