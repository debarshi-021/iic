"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Package, Search, Filter, Eye, Download } from "lucide-react"

const batchData = [
  {
    id: "B001",
    componentType: "Rail Pad",
    zone: "Z001 - Northern Railway",
    totalComponents: 150,
    deployed: 150,
    inDepot: 0,
    createdDate: "2024-01-15",
    status: "Fully Deployed",
    warrantyPeriod: 5,
  },
  {
    id: "B002",
    componentType: "ERC",
    zone: "Z003 - Western Railway",
    totalComponents: 200,
    deployed: 120,
    inDepot: 80,
    createdDate: "2024-01-14",
    status: "Partially Deployed",
    warrantyPeriod: 7,
  },
  {
    id: "B003",
    componentType: "Sleeper",
    zone: "Z005 - Eastern Railway",
    totalComponents: 100,
    deployed: 0,
    inDepot: 100,
    createdDate: "2024-01-13",
    status: "In Depot",
    warrantyPeriod: 10,
  },
  {
    id: "B004",
    componentType: "Liner",
    zone: "Z007 - Northeast Frontier Railway",
    totalComponents: 75,
    deployed: 45,
    inDepot: 30,
    createdDate: "2024-01-12",
    status: "Partially Deployed",
    warrantyPeriod: 6,
  },
  {
    id: "B005",
    componentType: "Rail Pad",
    zone: "Z002 - Southern Railway",
    totalComponents: 180,
    deployed: 180,
    inDepot: 0,
    createdDate: "2024-01-10",
    status: "Fully Deployed",
    warrantyPeriod: 5,
  },
]

export default function VendorBatches() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBatches, setFilteredBatches] = useState(batchData)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = batchData.filter(
      (batch) =>
        batch.id.toLowerCase().includes(term.toLowerCase()) ||
        batch.componentType.toLowerCase().includes(term.toLowerCase()) ||
        batch.zone.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredBatches(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fully Deployed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Partially Deployed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "In Depot":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const calculateDeploymentPercentage = (deployed: number, total: number) => {
    return Math.round((deployed / total) * 100)
  }

  return (
    <DashboardLayout role="vendor" title="My Batches">
      <div className="space-y-6">
        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Management</CardTitle>
            <CardDescription>Track and manage your component batches across different railway zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search batches by ID, type, or zone..."
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

        {/* Batch Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{batchData.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across {new Set(batchData.map((b) => b.zone)).size} zones
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {batchData.reduce((sum, batch) => sum + batch.totalComponents, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {batchData.reduce((sum, batch) => sum + batch.deployed, 0)} deployed
                </p>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Deployment Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (batchData.reduce((sum, batch) => sum + batch.deployed, 0) /
                      batchData.reduce((sum, batch) => sum + batch.totalComponents, 0)) *
                      100,
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Overall deployment progress</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Batch List */}
        <div className="space-y-4">
          {filteredBatches.map((batch, index) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{batch.id}</h3>
                          <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {batch.componentType} • {batch.zone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {batch.createdDate} • Warranty: {batch.warrantyPeriod} years
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
                      <div className="text-center">
                        <p className="text-sm font-medium">Deployment Progress</p>
                        <div className="w-32 mt-2">
                          <Progress
                            value={calculateDeploymentPercentage(batch.deployed, batch.totalComponents)}
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {batch.deployed}/{batch.totalComponents} (
                            {calculateDeploymentPercentage(batch.deployed, batch.totalComponents)}%)
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredBatches.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No batches found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria" : "Create your first batch to get started"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
