"use client"

import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { TrendingUp, Download, Filter, Calendar, MapPin, AlertTriangle } from "lucide-react"
import { useState } from "react"

const performanceMetrics = [
  { metric: "Deployment Efficiency", value: 94.2, target: 95, zone: "Overall" },
  { metric: "Prediction Accuracy", value: 87.8, target: 90, zone: "Overall" },
  { metric: "Response Time", value: 92.1, target: 85, zone: "Overall" },
  { metric: "User Satisfaction", value: 88.5, target: 90, zone: "Overall" },
  { metric: "System Uptime", value: 99.2, target: 99, zone: "Overall" },
  { metric: "Data Quality", value: 91.7, target: 95, zone: "Overall" },
]

const failurePredictionData = [
  { days: 0, components: 156, accuracy: 94 },
  { days: 7, components: 89, accuracy: 91 },
  { days: 14, components: 234, accuracy: 88 },
  { days: 30, components: 445, accuracy: 85 },
  { days: 60, components: 678, accuracy: 82 },
  { days: 90, components: 892, accuracy: 79 },
]

const zoneEfficiencyData = [
  { zone: "Northern", efficiency: 95.2, deployments: 8500, issues: 12 },
  { zone: "Western", efficiency: 87.8, deployments: 7800, issues: 28 },
  { zone: "Eastern", efficiency: 92.1, deployments: 6900, issues: 18 },
  { zone: "Southern", efficiency: 93.4, deployments: 8200, issues: 15 },
  { zone: "Central", efficiency: 89.7, deployments: 5400, issues: 22 },
  { zone: "Northeast", efficiency: 88.9, deployments: 3200, issues: 14 },
]

const monthlyTrendsData = [
  { month: "Jul", deployments: 2100, predictions: 1890, accuracy: 85.2, urgent: 67 },
  { month: "Aug", deployments: 2400, predictions: 2160, accuracy: 87.1, urgent: 52 },
  { month: "Sep", deployments: 2800, predictions: 2520, accuracy: 88.4, urgent: 48 },
  { month: "Oct", deployments: 3200, predictions: 2944, accuracy: 89.2, urgent: 41 },
  { month: "Nov", deployments: 2900, predictions: 2668, accuracy: 90.1, urgent: 35 },
  { month: "Dec", deployments: 3500, predictions: 3220, accuracy: 91.3, urgent: 28 },
  { month: "Jan", deployments: 4100, predictions: 3854, accuracy: 92.8, urgent: 22 },
]

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedZone, setSelectedZone] = useState("all")

  return (
    <DashboardLayout role="admin" title="Detailed Analytics">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Analytics Filters
            </CardTitle>
            <CardDescription>Customize your analytics view with filters and time ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Railway Zone</label>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    <SelectItem value="northern">Northern Railway</SelectItem>
                    <SelectItem value="western">Western Railway</SelectItem>
                    <SelectItem value="eastern">Eastern Railway</SelectItem>
                    <SelectItem value="southern">Southern Railway</SelectItem>
                    <SelectItem value="central">Central Railway</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                System Performance Metrics
              </CardTitle>
              <CardDescription>Overall system performance across key indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={performanceMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Current"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="hsl(var(--secondary))"
                      fill="hsl(var(--secondary))"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Failure Prediction Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Failure Prediction Analysis
                </CardTitle>
                <CardDescription>Component failure predictions by timeline and accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={failurePredictionData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="days" name="Days to Failure" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="components" name="Components" tick={{ fontSize: 12 }} />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value, name) => [
                          name === "components" ? `${value} components` : `${value}% accuracy`,
                          name === "components" ? "Components" : "Accuracy",
                        ]}
                      />
                      <Scatter dataKey="components" fill="hsl(var(--chart-1))" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Zone Efficiency Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Zone Efficiency Analysis
                </CardTitle>
                <CardDescription>Deployment efficiency and issue tracking by zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={zoneEfficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="zone" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar yAxisId="left" dataKey="efficiency" fill="hsl(var(--chart-1))" name="Efficiency %" />
                      <Bar yAxisId="right" dataKey="issues" fill="hsl(var(--destructive))" name="Issues" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Performance Trends
              </CardTitle>
              <CardDescription>
                Deployment trends, prediction accuracy, and urgent task patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="deployments"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                      name="Deployments"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="accuracy"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      name="Accuracy %"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="urgent"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Urgent Tasks"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Key Insights & Recommendations</CardTitle>
              <CardDescription>AI-generated insights based on current data trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                      <div>
                        <h4 className="font-medium text-green-800 dark:text-green-200">Positive Trend</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Prediction accuracy has improved by 7.6% over the last 6 months, indicating better ML model
                          performance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                      <div>
                        <h4 className="font-medium text-blue-800 dark:text-blue-200">Optimization Opportunity</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Northern Railway zone shows highest efficiency (95.2%). Best practices should be replicated in
                          other zones.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Action Required</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Western Railway zone has 28 pending issues. Consider allocating additional resources for
                          resolution.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                      <div>
                        <h4 className="font-medium text-purple-800 dark:text-purple-200">Strategic Insight</h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          Urgent task count has decreased by 67% since July, showing effective preventive maintenance
                          implementation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
