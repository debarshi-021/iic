"use client"

import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { Package, Truck, AlertTriangle, Users, TrendingUp, MapPin, Calendar, Activity } from "lucide-react"
import Link from "next/link"

const stats = [
  {
    title: "Total Fittings",
    value: "50,847",
    change: "+12%",
    icon: Package,
    color: "text-primary",
    description: "Components in system",
  },
  {
    title: "Deployed",
    value: "47,291",
    change: "+8%",
    icon: Truck,
    color: "text-green-600",
    description: "Successfully installed",
  },
  {
    title: "Urgent Tasks",
    value: "156",
    change: "-15%",
    icon: AlertTriangle,
    color: "text-red-600",
    description: "Requiring attention",
  },
  {
    title: "Active Workers",
    value: "89",
    change: "+3",
    icon: Users,
    color: "text-blue-600",
    description: "Field personnel",
  },
]

const vendorPerformanceData = [
  { vendor: "Rahee Track", components: 12500, efficiency: 95, deployed: 11875 },
  { vendor: "Raymond Steel", components: 9800, efficiency: 87, deployed: 8526 },
  { vendor: "Jindal Steel", components: 8200, efficiency: 92, deployed: 7544 },
  { vendor: "Tata Steel", components: 7500, efficiency: 89, deployed: 6675 },
  { vendor: "SAIL", components: 6300, efficiency: 91, deployed: 5733 },
]

const zoneDeploymentData = [
  { zone: "Northern", deployed: 8500, total: 9200, efficiency: 92 },
  { zone: "Western", deployed: 7800, total: 8900, efficiency: 88 },
  { zone: "Eastern", deployed: 6900, total: 7500, efficiency: 92 },
  { zone: "Southern", deployed: 8200, total: 8800, efficiency: 93 },
  { zone: "Central", deployed: 5400, total: 6100, efficiency: 89 },
  { zone: "Northeast", deployed: 3200, total: 3600, efficiency: 89 },
]

const timelineData = [
  { month: "Aug", deployments: 2400, predictions: 180, urgent: 45 },
  { month: "Sep", deployments: 2800, predictions: 210, urgent: 38 },
  { month: "Oct", deployments: 3200, predictions: 245, urgent: 52 },
  { month: "Nov", deployments: 2900, predictions: 220, urgent: 41 },
  { month: "Dec", deployments: 3500, predictions: 280, urgent: 35 },
  { month: "Jan", deployments: 4100, predictions: 320, urgent: 28 },
]

const priorityDistributionData = [
  { name: "Basic", value: 35420, color: "#22c55e" },
  { name: "Medium", value: 11871, color: "#eab308" },
  { name: "Urgent", value: 156, color: "#ef4444" },
]

const COLORS = ["#22c55e", "#eab308", "#ef4444"]

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" title="Admin Dashboard">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/admin/analytics" className="flex-1">
            <Button className="w-full h-12 text-base">
              <TrendingUp className="mr-2 h-5 w-5" />
              Detailed Analytics
            </Button>
          </Link>
          <Link href="/admin/users" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-base bg-transparent">
              <Users className="mr-2 h-5 w-5" />
              Manage Users
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
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    className="text-2xl font-bold"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendor Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Vendor Performance
                </CardTitle>
                <CardDescription>Component production and deployment efficiency by vendor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vendorPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="vendor" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="components"
                        fill="hsl(var(--primary))"
                        name="Total Components"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar dataKey="deployed" fill="hsl(var(--secondary))" name="Deployed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Priority Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Priority Distribution
                </CardTitle>
                <CardDescription>ML prediction priority breakdown across all components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {priorityDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {priorityDistributionData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm">
                        {item.name}: {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zone-wise Deployments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Zone-wise Deployments
                </CardTitle>
                <CardDescription>Deployment progress across different railway zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={zoneDeploymentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="zone" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="total" fill="hsl(var(--muted))" name="Total Allocated" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="deployed" fill="hsl(var(--chart-1))" name="Deployed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Deployment Timeline
                </CardTitle>
                <CardDescription>Monthly deployment trends and urgent task patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="deployments"
                        stackId="1"
                        stroke="hsl(var(--chart-1))"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.6}
                        name="Deployments"
                      />
                      <Line
                        type="monotone"
                        dataKey="urgent"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={3}
                        name="Urgent Tasks"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Health Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>System Health Overview</CardTitle>
              <CardDescription>Real-time system status and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                </div>

                <div className="text-center p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-3">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <p className="text-sm text-muted-foreground">Daily Scans</p>
                </div>

                <div className="text-center p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">94.2%</div>
                  <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                </div>

                <div className="text-center p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600">89</div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
              <CardDescription>Latest actions across all user roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Batch B007 deployed",
                    user: "Factory Manager - Rajesh Kumar",
                    time: "2 minutes ago",
                    type: "deployment",
                  },
                  {
                    action: "Urgent component flagged",
                    user: "Worker - Priya Sharma",
                    time: "5 minutes ago",
                    type: "urgent",
                  },
                  {
                    action: "New component batch created",
                    user: "Vendor - Rahee Track Technologies",
                    time: "12 minutes ago",
                    type: "creation",
                  },
                  {
                    action: "Inspection task completed",
                    user: "Worker - Amit Singh",
                    time: "18 minutes ago",
                    type: "completion",
                  },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "urgent"
                            ? "bg-red-500"
                            : activity.type === "deployment"
                              ? "bg-blue-500"
                              : activity.type === "creation"
                                ? "bg-green-500"
                                : "bg-gray-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{activity.time}</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}
