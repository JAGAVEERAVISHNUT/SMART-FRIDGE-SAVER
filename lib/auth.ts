// Simple client-side authentication utility
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isAuthenticated") === "true"
}

export function getUser() {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export function logout() {
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("user")
}
