"use client"

import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scan, Bell, CheckCircle, AlertTriangle, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export default function WorkerDashboard() {
  const stats = [
    {
      title: "Scans Today",
      value: "47",
      change: "+12",
      icon: Scan,
      color: "text-primary",
    },
    {
      title: "Urgent Tasks",
      value: "8",
      change: "-2",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Completed Inspections",
      value: "23",
      change: "+5",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending Tasks",
      value: "15",
      change: "+3",
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  const recentScans = [
    {
      uid: "RFM-1705123456-ABC123DEF",
      componentType: "Rail Pad",
      location: "Line NR-001, KM 125.7",
      priority: "Urgent",
      daysToFail: 15,
      timestamp: "10:30 AM",
      status: "Flagged",
    },
    {
      uid: "RFM-1705123457-XYZ789GHI",
      componentType: "ERC",
      location: "Line WR-045, KM 89.5",
      priority: "Medium",
      daysToFail: 45,
      timestamp: "09:45 AM",
      status: "Logged",
    },
    {
      uid: "RFM-1705123458-LMN456OPQ",
      componentType: "Sleeper",
      location: "Line ER-023, KM 203.3",
      priority: "Basic",
      daysToFail: 120,
      timestamp: "09:15 AM",
      status: "Logged",
    },
  ]

  const urgentTasks = [
    {
      uid: "RFM-1705123450-URG001",
      componentType: "Liner",
      location: "Line NFR-012, KM 67.9",
      priority: "Urgent",
      daysToFail: 8,
      assignedDate: "2024-01-15",
    },
    {
      uid: "RFM-1705123451-URG002",
      componentType: "Rail Pad",
      location: "Line SR-078, KM 156.4",
      priority: "Urgent",
      daysToFail: 12,
      assignedDate: "2024-01-14",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Basic":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <DashboardLayout role="worker" title="Worker Dashboard">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/worker/scan" className="flex-1">
            <Button className="w-full h-12 text-base">
              <Scan className="mr-2 h-5 w-5" />
              Start QR Scanning
            </Button>
          </Link>
          <Link href="/worker/notifications" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-base bg-transparent">
              <Bell className="mr-2 h-5 w-5" />
              View Notifications ({urgentTasks.length})
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
                    <span className="text-green-600">{stat.change}</span> from yesterday
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>Latest QR code scans and their ML prediction results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScans.map((scan, index) => (
                  <motion.div
                    key={scan.uid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Scan className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{scan.componentType}</p>
                          <Badge className={getPriorityColor(scan.priority)}>{scan.priority}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{scan.location}</p>
                        <p className="text-xs text-muted-foreground">
                          UID: {scan.uid.slice(-10)}... • {scan.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{scan.daysToFail} days</div>
                      <p className="text-sm text-muted-foreground">Predicted failure</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Urgent Tasks Alert */}
        {urgentTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <AlertTriangle className="h-5 w-5" />
                  Urgent Inspection Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  You have {urgentTasks.length} components requiring immediate inspection.
                </p>
                <div className="space-y-2">
                  {urgentTasks.map((task) => (
                    <div
                      key={task.uid}
                      className="flex items-center justify-between p-3 bg-white dark:bg-red-950/40 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-red-800 dark:text-red-200">
                          {task.componentType} - {task.location}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Predicted failure in {task.daysToFail} days
                        </p>
                      </div>
                      <Badge variant="destructive">Urgent</Badge>
                    </div>
                  ))}
                </div>
                <Link href="/worker/notifications">
                  <Button variant="destructive" className="w-full mt-4">
                    View All Urgent Tasks
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Assigned inspection routes and locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <p className="font-medium">Northern Railway Zone</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Lines NR-001 to NR-005 • KM 120-130</p>
                  <Badge variant="outline" className="mt-2">
                    Morning Shift
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <p className="font-medium">Western Railway Zone</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Lines WR-040 to WR-050 • KM 85-95</p>
                  <Badge variant="outline" className="mt-2">
                    Afternoon Shift
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
