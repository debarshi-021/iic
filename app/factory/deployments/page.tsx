"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Truck, Search, Filter, Eye, MapPin, Calendar, Package } from "lucide-react"

const deploymentData = [
  {
    id: "D001",
    batchId: "B001",
    componentType: "Rail Pad",
    zone: "Z001 - Northern Railway",
    lineId: "NR-001",
    kmRange: "125.5 - 127.2",
    components: 150,
    deploymentDate: "2024-01-15",
    status: "Completed",
    priority: "Medium",
    mlPredictions: { urgent: 23, medium: 52, basic: 75 },
  },
  {
    id: "D002",
    batchId: "B002",
    componentType: "ERC",
    zone: "Z003 - Western Railway",
    lineId: "WR-045",
    kmRange: "89.3 - 91.8",
    components: 120,
    deploymentDate: "2024-01-14",
    status: "In Progress",
    priority: "High",
    mlPredictions: { urgent: 18, medium: 42, basic: 60 },
  },
  {
    id: "D003",
    batchId: "B003",
    componentType: "Sleeper",
    zone: "Z005 - Eastern Railway",
    lineId: "ER-023",
    kmRange: "203.1 - 205.7",
    components: 100,
    deploymentDate: "2024-01-16",
    status: "Scheduled",
    priority: "Low",
    mlPredictions: { urgent: 15, medium: 35, basic: 50 },
  },
  {
    id: "D004",
    batchId: "B004",
    componentType: "Liner",
    zone: "Z007 - Northeast Frontier Railway",
    lineId: "NFR-012",
    kmRange: "67.8 - 69.5",
    components: 75,
    deploymentDate: "2024-01-13",
    status: "Completed",
    priority: "Medium",
    mlPredictions: { urgent: 11, medium: 26, basic: 38 },
  },
  {
    id: "D005",
    batchId: "B005",
    componentType: "Rail Pad",
    zone: "Z002 - Southern Railway",
    lineId: "SR-078",
    kmRange: "156.2 - 158.9",
    components: 180,
    deploymentDate: "2024-01-12",
    status: "Completed",
    priority: "High",
    mlPredictions: { urgent: 27, medium: 63, basic: 90 },
  },
]

export default function FactoryDeployments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDeployments, setFilteredDeployments] = useState(deploymentData)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = deploymentData.filter(
      (deployment) =>
        deployment.id.toLowerCase().includes(term.toLowerCase()) ||
        deployment.batchId.toLowerCase().includes(term.toLowerCase()) ||
        deployment.componentType.toLowerCase().includes(term.toLowerCase()) ||
        deployment.zone.toLowerCase().includes(term.toLowerCase()) ||
        deployment.lineId.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredDeployments(filtered)
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

  return (
    <DashboardLayout role="factory" title="All Deployments">
      <div className="space-y-6">
        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Management</CardTitle>
            <CardDescription>Track and manage all batch deployments across railway zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deployments by ID, batch, type, zone, or line..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Deployments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deploymentData.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across {new Set(deploymentData.map((d) => d.zone)).size} zones
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Components Deployed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {deploymentData.reduce((sum, deployment) => sum + deployment.components, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total fittings installed</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {deploymentData.filter((d) => d.status === "Completed").length}
                </div>
                <p className="text-xs text-muted-foreground">Successfully deployed</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Urgent Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {deploymentData.reduce((sum, deployment) => sum + deployment.mlPredictions.urgent, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Components needing attention</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Deployment List */}
        <div className="space-y-4">
          {filteredDeployments.map((deployment, index) => (
            <motion.div
              key={deployment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{deployment.id}</h3>
                          <Badge className={getStatusColor(deployment.status)}>{deployment.status}</Badge>
                          <Badge className={getPriorityColor(deployment.priority)}>{deployment.priority}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Batch {deployment.batchId} • {deployment.componentType} • {deployment.zone}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            Line {deployment.lineId} • KM {deployment.kmRange}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {deployment.deploymentDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {deployment.components} components
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
                      <div className="text-center">
                        <p className="text-sm font-medium mb-2">ML Predictions</p>
                        <div className="flex gap-2">
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-600">{deployment.mlPredictions.urgent}</div>
                            <div className="text-xs text-muted-foreground">Urgent</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-600">{deployment.mlPredictions.medium}</div>
                            <div className="text-xs text-muted-foreground">Medium</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{deployment.mlPredictions.basic}</div>
                            <div className="text-xs text-muted-foreground">Basic</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredDeployments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No deployments found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria" : "No deployments have been created yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
