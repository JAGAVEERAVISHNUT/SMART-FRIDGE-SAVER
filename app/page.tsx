"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/layout/navigation"
import { AppHeader } from "@/components/app-header"
import { Leaf, Droplets, TrendingUp } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24 md:ml-20 bg-background min-h-screen">
      <AppHeader />
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Leaf className="text-primary" size={48} />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">SmartFridgeSaver</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Reduce food waste, save money, and protect the planet with intelligent fridge management
            </p>
            <Button
              onClick={() => router.push("/add-items")}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Get Started
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-3 rounded-lg inline-block mb-4">
                <Droplets className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Tracking</h3>
              <p className="text-muted-foreground">
                Scan receipts with OCR or add items manually to track your groceries instantly
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 p-3 rounded-lg inline-block mb-4">
                <TrendingUp className="text-accent" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Alerts</h3>
              <p className="text-muted-foreground">Get notified before items expire with friendly reminders</p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-3 rounded-lg inline-block mb-4">
                <Leaf className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Impact</h3>
              <p className="text-muted-foreground">
                See how much food waste you've prevented and CO2 emissions you've reduced
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-card rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6 text-center">Why SmartFridgeSaver?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-primary mb-2">30%</p>
                <p className="text-muted-foreground">Average food waste reduction</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent mb-2">$50/mo</p>
                <p className="text-muted-foreground">Typical savings per household</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-2">150kg</p>
                <p className="text-muted-foreground">CO2 prevented annually</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
