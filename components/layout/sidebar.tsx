"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Train, Factory, Wrench, Users, BarChart3, Menu, X, Home, Package, Scan, Bell, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

interface SidebarProps {
  role: "vendor" | "factory" | "worker" | "admin"
}

const roleConfig = {
  vendor: {
    title: "Vendor Panel",
    icon: Factory,
    color: "text-primary",
    items: [
      { label: "Dashboard", href: "/vendor", icon: Home },
      { label: "Create Component", href: "/vendor/create", icon: Package },
      { label: "My Batches", href: "/vendor/batches", icon: BarChart3 },
      { label: "Settings", href: "/vendor/settings", icon: Settings },
    ],
  },
  factory: {
    title: "Factory Manager",
    icon: Wrench,
    color: "text-secondary",
    items: [
      { label: "Dashboard", href: "/factory", icon: Home },
      { label: "Deploy Batch", href: "/factory/deploy", icon: Package },
      { label: "Deployments", href: "/factory/deployments", icon: BarChart3 },
      { label: "Settings", href: "/factory/settings", icon: Settings },
    ],
  },
  worker: {
    title: "Worker Panel",
    icon: Users,
    color: "text-accent",
    items: [
      { label: "Dashboard", href: "/worker", icon: Home },
      { label: "QR Scanner", href: "/worker/scan", icon: Scan },
      { label: "Notifications", href: "/worker/notifications", icon: Bell },
      { label: "Settings", href: "/worker/settings", icon: Settings },
    ],
  },
  admin: {
    title: "Admin Dashboard",
    icon: BarChart3,
    color: "text-muted-foreground",
    items: [
      { label: "Dashboard", href: "/admin", icon: Home },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
}

export function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const config = roleConfig[role]

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Train className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sidebar-foreground">{config.title}</h2>
                    <Badge variant="secondary" className="text-xs">
                      HackStreet
                    </Badge>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {config.items.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isCollapsed && "px-2",
                    pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>
            ))}
          </div>
        </nav>

        {/* Back to Home */}
        <div className="p-4 border-t border-sidebar-border">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
              <Home className="h-4 w-4 flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                  >
                    Back to Home
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </Link>

          {/* Theme Toggle Button */}
          <div className="mt-2 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </motion.aside>
    </>
  )
}
