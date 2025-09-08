"use client"

import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, MapPin, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function FactoryDashboard() {
  const stats = [
    {
      title: "Total Deployments",
      value: "1,247",
      change: "+8%",
      icon: Truck,
      color: "text-primary",
    },
    {
      title: "Active Batches",
      value: "15",
      change: "+2",
      icon: Package,
      color: "text-secondary",
    },
    {
      title: "Zones Covered",
      value: "12",
      change: "+1",
      icon: MapPin,
      color: "text-accent",
    },
    {
      title: "Pending Deployments",
      value: "8",
      change: "-3",
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  const recentDeployments = [
    {
      id: "D001",
      batchId: "B001",
      zone: "Z001 - Northern Railway",
      lineId: "NR-001",
      kmRange: "125.5 - 127.2",
      components: 150,
      status: "Completed",
      date: "2024-01-15",
      priority: "Medium",
    },
    {
      id: "D002",
      batchId: "B002",
      zone: "Z003 - Western Railway",
      lineId: "WR-045",
      kmRange: "89.3 - 91.8",
      components: 120,
      status: "In Progress",
      date: "2024-01-14",
      priority: "High",
    },
    {
      id: "D003",
      batchId: "B003",
      zone: "Z005 - Eastern Railway",
      lineId: "ER-023",
      kmRange: "203.1 - 205.7",
      components: 100,
      status: "Scheduled",
      date: "2024-01-16",
      priority: "Low",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Scheduled":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <DashboardLayout role="factory" title="Factory Manager Dashboard">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/factory/deploy" className="flex-1">
            <Button className="w-full h-12 text-base">
              <Truck className="mr-2 h-5 w-5" />
              Deploy New Batch
            </Button>
          </Link>
          <Link href="/factory/deployments" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-base bg-transparent">
              <Package className="mr-2 h-5 w-5" />
              View All Deployments
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

        {/* Recent Deployments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Deployments</CardTitle>
              <CardDescription>Latest batch deployments and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDeployments.map((deployment, index) => (
                  <motion.div
                    key={deployment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">
                            {deployment.id} - Batch {deployment.batchId}
                          </p>
                          <Badge className={getPriorityColor(deployment.priority)}>{deployment.priority}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {deployment.zone} • Line {deployment.lineId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          KM {deployment.kmRange} • {deployment.components} components
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(deployment.status)}>{deployment.status}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{deployment.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Deployment Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="h-5 w-5" />
                Deployment Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 dark:text-orange-300">
                Batch B004 deployment scheduled for tomorrow requires weather clearance.
                <Link href="/factory/deployments" className="underline ml-1">
                  Check details
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Zone Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Zone Performance Overview</CardTitle>
              <CardDescription>Deployment efficiency across different railway zones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">Northern Railway</p>
                  <p className="text-sm text-muted-foreground">95% efficiency</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <MapPin className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <p className="font-semibold">Western Railway</p>
                  <p className="text-sm text-muted-foreground">87% efficiency</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <MapPin className="h-8 w-8 text-accent mx-auto mb-2" />
                  <p className="font-semibold">Eastern Railway</p>
                  <p className="text-sm text-muted-foreground">92% efficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
