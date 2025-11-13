"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/layout/navigation"
import { Camera, Mic, Plus, X } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

const CATEGORIES = ["Dairy", "Produce", "Meat", "Snacks", "Beverages", "Pantry", "Frozen", "Other"]

interface GroceryItem {
  id: string
  name: string
  category: string
  expiryDate: string
  quantity: number
}

function AddItemsContent() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [items, setItems] = useState<GroceryItem[]>([])
  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("Produce")
  const [expiryDate, setExpiryDate] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isListening, setIsListening] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)

  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    return user.id || null
  }

  // Mock OCR simulation
  const handleCamera = async () => {
    setCameraActive(!cameraActive)
    if (!cameraActive) {
      // Simulate OCR detection
      setTimeout(() => {
        const mockItems: GroceryItem[] = [
          { id: Date.now().toString(), name: "Milk", category: "Dairy", expiryDate: getTomorrowDate(), quantity: 1 },
          {
            id: (Date.now() + 1).toString(),
            name: "Eggs",
            category: "Dairy",
            expiryDate: getDateInDays(7),
            quantity: 1,
          },
          {
            id: (Date.now() + 2).toString(),
            name: "Bread",
            category: "Pantry",
            expiryDate: getDateInDays(3),
            quantity: 1,
          },
        ]
        setItems(mockItems)
        setCameraActive(false)
        alert("OCR detected items from receipt! (Simulated)")
      }, 1500)
    }
  }

  // Mock voice input
  const handleVoiceInput = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setItemName("Yogurt")
        setCategory("Dairy")
        setExpiryDate(getDateInDays(5))
        setIsListening(false)
        alert("Voice input captured! (Simulated)")
      }, 2000)
    }
  }

  const addItem = () => {
    if (!itemName || !expiryDate) {
      alert("Please fill in item name and expiry date")
      return
    }

    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: itemName,
      category,
      expiryDate,
      quantity,
    }

    setItems([...items, newItem])
    setItemName("")
    setCategory("Produce")
    setExpiryDate("")
    setQuantity(1)
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const saveInventory = () => {
    if (items.length === 0) {
      alert("Please add at least one item")
      return
    }

    const userId = getCurrentUserId()
    if (!userId) {
      alert("User not authenticated")
      return
    }

    const userItemsKey = `groceryItems_${userId}`
    const existingItems = JSON.parse(localStorage.getItem(userItemsKey) || "[]")
    const updatedItems = [...existingItems, ...items]
    localStorage.setItem(userItemsKey, JSON.stringify(updatedItems))

    router.push("/inventory")
  }

  return (
    <div className="pb-24 md:ml-20">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Add Items to Your Fridge</h1>
          <p className="text-muted-foreground">Scan a receipt or add items manually</p>
        </div>

        {/* Smart Input Methods */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCamera}>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <Camera className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Scan Receipt</h3>
              <p className="text-sm text-muted-foreground">Use camera to scan grocery receipt</p>
              <Button variant="outline" className="mt-4 w-full bg-transparent" size="sm">
                {cameraActive ? "Cancel" : "Open Camera"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border cursor-pointer hover:shadow-lg transition-shadow" onClick={handleVoiceInput}>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-accent/10 p-4 rounded-lg mb-4">
                <Mic className={`${isListening ? "text-red-500 animate-pulse" : "text-accent"}`} size={32} />
              </div>
              <h3 className="font-semibold mb-2">Voice Input</h3>
              <p className="text-sm text-muted-foreground">Say item name to add</p>
              <Button variant="outline" className="mt-4 w-full bg-transparent" size="sm">
                {isListening ? "Listening..." : "Start Speaking"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <Plus className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Manual Entry</h3>
              <p className="text-sm text-muted-foreground">Add items one by one</p>
            </CardContent>
          </Card>
        </div>

        {/* Manual Entry Form */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle>Add Item Manually</CardTitle>
            <CardDescription>Fill in the details below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Item Name</label>
                <Input
                  placeholder="e.g., Milk, Chicken Breast"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Expiry Date</label>
                  <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>

              <Button onClick={addItem} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Add to Inventory
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Items Preview */}
        {items.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Items to Add ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.category} • Qty: {item.quantity} • Expires:{" "}
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X size={20} />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={saveInventory}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Save to Inventory
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

function getTomorrowDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().split("T")[0]
}

function getDateInDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split("T")[0]
}

export default function AddItemsPage() {
  return (
    <ProtectedRoute>
      <AddItemsContent />
    </ProtectedRoute>
  )
}
