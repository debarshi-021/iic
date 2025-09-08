"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Train, Users, Factory, Wrench, BarChart3, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function HomePage() {
  const { theme, setTheme } = useTheme()

  const roles = [
    {
      title: "Vendor Panel",
      description: "Manage component creation and batch tracking",
      icon: Factory,
      href: "/auth/signin",
      color: "bg-primary text-primary-foreground",
    },
    {
      title: "Factory Manager",
      description: "Deploy batches and manage installations",
      icon: Wrench,
      href: "/auth/signin",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      title: "Worker Panel",
      description: "QR scanning and field operations",
      icon: Users,
      href: "/auth/signin",
      color: "bg-accent text-accent-foreground",
    },
    {
      title: "Admin Dashboard",
      description: "Analytics and system overview",
      icon: BarChart3,
      href: "/auth/signin",
      color: "bg-muted text-muted-foreground",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Train className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Railway Fitting Management</h1>
                <p className="text-sm text-muted-foreground">Smart Infrastructure Solutions</p>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            IIC Hackathon Project
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4">Welcome to Railway Fitting Management System</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline railway component lifecycle management with AI-powered predictions and real-time tracking
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={role.href}>
                <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group">
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto rounded-lg ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <role.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <Train className="h-4 w-4 text-primary" />
                </div>
                Component Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track railway components from manufacturing to deployment with QR code integration
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-secondary" />
                </div>
                AI Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Machine learning powered failure predictions and maintenance scheduling
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-accent" />
                </div>
                Multi-Role Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Role-based dashboards for vendors, factory managers, workers, and administrators
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">© 2025 Railway Fitting Management System</p>
            <Badge variant="outline">Team HackStreet Boys</Badge>
          </div>
        </div>
      </footer>
    </div>
  )
}
