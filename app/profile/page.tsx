"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { AppHeader } from "@/components/app-header"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Edit2, Save, X } from "lucide-react"

interface UserProfile {
  email: string
  name: string
  phone: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    email: "",
    name: "",
    phone: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile)

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    const savedProfile = localStorage.getItem("userProfile")

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile(parsed)
      setTempProfile(parsed)
    } else if (userEmail) {
      setProfile((prev) => ({ ...prev, email: userEmail }))
      setTempProfile((prev) => ({ ...prev, email: userEmail }))
    }
  }, [])

  const handleSave = () => {
    setProfile(tempProfile)
    localStorage.setItem("userProfile", JSON.stringify(tempProfile))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempProfile(profile)
    setIsEditing(false)
  }

  const handleChange = (field: keyof UserProfile, value: string) => {
    setTempProfile((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <ProtectedRoute>
      <div className="pb-24 md:ml-20 bg-background min-h-screen">
        <AppHeader />
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">My Profile</h2>
            <p className="text-muted-foreground">Manage your account details</p>
          </div>

          <Card className="border-border mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="text-primary" size={24} />
                  </div>
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>View and edit your personal details</CardDescription>
                  </div>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2">
                    <Edit2 size={16} />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  Email
                </label>
                <input
                  type="email"
                  value={isEditing ? tempProfile.email : profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={isEditing ? tempProfile.name : profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={isEditing ? tempProfile.phone : profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
                    <Save size={16} />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 gap-2 bg-transparent">
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
