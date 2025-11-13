"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TrendingDown, DollarSign, Droplets } from "lucide-react"

interface GroceryItem {
  id: string
  name: string
  category: string
  expiryDate: string
  quantity: number
}

interface ImpactMetrics {
  foodWastePrevented: number
  co2Saved: number
  moneySaved: number
  itemsTracked: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    foodWastePrevented: 0,
    co2Saved: 0,
    moneySaved: 0,
    itemsTracked: 0,
  })
  const [items, setItems] = useState<GroceryItem[]>([])

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
          const parsedItems = JSON.parse(stored) as GroceryItem[]
          setItems(parsedItems)
          calculateImpact(parsedItems)
        } catch (e) {
          console.error("Failed to load items", e)
        }
      }
    }
  }, [])

  const calculateImpact = (items: GroceryItem[]) => {
    // Calculate based on tracked items
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    // Estimate impact:
    // - Average grocery waste prevented: 100g per tracked item
    // - CO2 saved: 0.5kg CO2 per kg of food waste prevented (average)
    // - Money saved: avg $0.80 per item prevented from waste
    const foodWastePrevented = totalItems * 0.1 // in kg
    const co2Saved = foodWastePrevented * 0.5 // in kg
    const moneySaved = totalItems * 0.8 // in dollars

    setMetrics({
      foodWastePrevented: Math.round(foodWastePrevented * 10) / 10,
      co2Saved: Math.round(co2Saved * 10) / 10,
      moneySaved: Math.round(moneySaved * 100) / 100,
      itemsTracked: totalItems,
    })
  }

  // Mock historical data
  const monthlyData = [
    { month: "January", waste: 2.5, savings: 45 },
    { month: "February", waste: 3.1, savings: 58 },
    { month: "March", waste: 2.8, savings: 52 },
    { month: "April", waste: 3.5, savings: 68 },
    { month: "May", waste: 4.2, savings: 82 },
    { month: "June", waste: 3.9, savings: 76 },
  ]

  const maxWaste = Math.max(...monthlyData.map((d) => d.waste))

  return (
    <div className="pb-24 md:ml-20">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Impact</h1>
          <p className="text-muted-foreground">Track how much food waste you're preventing</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Food Waste Prevented</CardTitle>
                <Leaf className="text-primary" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{metrics.foodWastePrevented}kg</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">CO2 Reduced</CardTitle>
                <Droplets className="text-accent" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{metrics.co2Saved}kg</div>
              <p className="text-xs text-muted-foreground mt-1">Carbon equivalent</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Money Saved</CardTitle>
                <DollarSign className="text-green-600" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${metrics.moneySaved}</div>
              <p className="text-xs text-muted-foreground mt-1">By preventing waste</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Items Tracked</CardTitle>
                <TrendingDown className="text-blue-600" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{metrics.itemsTracked}</div>
              <p className="text-xs text-muted-foreground mt-1">In your fridge</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle>Monthly Waste Prevention Trend</CardTitle>
            <CardDescription>kg of food waste prevented each month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg relative group"
                    style={{ height: `${(data.waste / maxWaste) * 200}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.waste}kg
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">{data.month.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Breakdown */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Environmental Impact</CardTitle>
              <CardDescription>Your contribution to planet Earth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">CO2 prevented (kg)</span>
                <span className="font-bold text-primary">{metrics.co2Saved}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Equivalent to a car drive</span>
                <span className="font-bold text-primary">{(metrics.co2Saved * 5).toFixed(1)}km</span>
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                Reducing food waste is one of the most effective ways to lower your carbon footprint!
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Financial Impact</CardTitle>
              <CardDescription>Money saved by preventing food waste</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Total saved this month</span>
                <span className="font-bold text-green-600">${metrics.moneySaved}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm">Projected yearly savings</span>
                <span className="font-bold text-green-600">${(metrics.moneySaved * 12).toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                By tracking your groceries and using them before expiry, you save money while helping the environment!
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="border-border mt-8 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf size={20} className="text-primary" />
              Tips to Reduce More Waste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Organize your fridge: Keep expiring items at eye level to use them first</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Meal plan: Check your inventory before shopping</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Use the freeze method: Freeze items before they expire</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Share recipes: Use all ingredients to create complete meals</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
