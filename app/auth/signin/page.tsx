"use client"
import { useState } from "react"
import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Train, LogIn, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const VENDOR_CREDENTIALS = {
  V001: { name: "Rahee Track Technologies", password: "password" },
  V002: { name: "Raymond Steel", password: "password" },
  V003: { name: "Eastern Track Udyog", password: "password" },
  V004: { name: "Royal Infraconstru Ltd.", password: "password" },
  V005: { name: "Pooja Industries", password: "password" },
  V006: { name: "Jekay International", password: "password" },
  V007: { name: "Avantika Concrete", password: "password" },
  V008: { name: "Gammon India", password: "password" },
}

const OTHER_CREDENTIALS = {
  factory: { name: "Factory Manager", password: "password", route: "/factory" },
  worker: { name: "Worker Panel", password: "password", route: "/worker" },
  admin: { name: "Admin Panel", password: "password", route: "/admin" },
}

export default function SignInPage() {
  const [role, setRole] = useState<string>("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      if (role === "vendor") {
        // Check vendor credentials
        if (VENDOR_CREDENTIALS[username as keyof typeof VENDOR_CREDENTIALS]?.password === password) {
          // Store auth info in localStorage
          localStorage.setItem(
            "auth",
            JSON.stringify({
              role: "vendor",
              vendorCode: username,
              vendorName: VENDOR_CREDENTIALS[username as keyof typeof VENDOR_CREDENTIALS].name,
            }),
          )
          router.push("/vendor")
        } else {
          setError("Invalid vendor code or password")
        }
      } else {
        // Check other role credentials
        const credential = OTHER_CREDENTIALS[username as keyof typeof OTHER_CREDENTIALS]
        if (credential?.password === password) {
          localStorage.setItem(
            "auth",
            JSON.stringify({
              role: username,
              name: credential.name,
            }),
          )
          router.push(credential.route)
        } else {
          setError("Invalid username or password")
        }
      }
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mx-auto mb-4">
              <Train className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Access Railway Fitting Management System</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="other">Factory Manager / Worker / Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role === "vendor" && (
                <div className="space-y-2">
                  <Label htmlFor="vendorCode">Vendor Code</Label>
                  <Select value={username} onValueChange={setUsername} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor code" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(VENDOR_CREDENTIALS).map(([code, info]) => (
                        <SelectItem key={code} value={code}>
                          {code} - {info.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {role === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Select value={username} onValueChange={setUsername} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select username" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="factory">factory - Factory Manager</SelectItem>
                      <SelectItem value="worker">worker - Worker Panel</SelectItem>
                      <SelectItem value="admin">admin - Admin Panel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading || !role}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials Info */}
        <Card className="mt-4 bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground text-center mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Vendors: V001-V008, Password: password</p>
              <p>• Factory: factory / password</p>
              <p>• Worker: worker / password</p>
              <p>• Admin: admin / password</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
