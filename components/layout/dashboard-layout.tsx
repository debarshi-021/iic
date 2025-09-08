"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "./sidebar"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface DashboardLayoutProps {
  children: ReactNode
  role: "vendor" | "factory" | "worker" | "admin"
  title?: string
}

export function DashboardLayout({ children, role, title }: DashboardLayoutProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="lg:ml-[280px]">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>{title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}</div>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
