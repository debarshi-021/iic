"use client"

import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Plus, BarChart3, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function VendorDashboard() {
  const stats = [
    {
      title: "Total Components",
      value: "2,847",
      change: "+12%",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Active Batches",
      value: "23",
      change: "+3",
      icon: BarChart3,
      color: "text-secondary",
    },
    {
      title: "Pending QC",
      value: "156",
      change: "-8%",
      icon: Clock,
      color: "text-accent",
    },
    {
      title: "Deployed",
      value: "2,691",
      change: "+15%",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  const recentBatches = [
    {
      id: "B001",
      type: "Rail Pad",
      zone: "Z001 - Northern Railway",
      quantity: 150,
      status: "Deployed",
      date: "2024-01-15",
    },
    {
      id: "B002",
      type: "ERC",
      zone: "Z003 - Western Railway",
      quantity: 200,
      status: "In Transit",
      date: "2024-01-14",
    },
    {
      id: "B003",
      type: "Sleeper",
      zone: "Z005 - Eastern Railway",
      quantity: 100,
      status: "Quality Check",
      date: "2024-01-13",
    },
  ]

  return (
    <DashboardLayout role="vendor" title="Vendor Dashboard">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/vendor/create" className="flex-1">
            <Button className="w-full h-12 text-base">
              <Plus className="mr-2 h-5 w-5" />
              Create New Component
            </Button>
          </Link>
          <Link href="/vendor/batches" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-base bg-transparent">
              <BarChart3 className="mr-2 h-5 w-5" />
              View All Batches
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Batches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Batches</CardTitle>
              <CardDescription>Latest component batches and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBatches.map((batch, index) => (
                  <motion.div
                    key={batch.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {batch.id} - {batch.type}
                        </p>
                        <p className="text-sm text-muted-foreground">{batch.zone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          batch.status === "Deployed"
                            ? "default"
                            : batch.status === "In Transit"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {batch.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{batch.quantity} units</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <AlertCircle className="h-5 w-5" />
                Quality Control Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 dark:text-amber-300">
                Batch B004 requires immediate quality inspection.
                <Link href="/vendor/batches" className="underline ml-1">
                  View details
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
