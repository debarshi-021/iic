"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Truck, CheckCircle, Loader2, PieChart, AlertTriangle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const availableBatches = [
  { id: "B001", type: "Rail Pad", vendor: "Rahee Track Technologies", components: 150, zone: "Z001" },
  { id: "B002", type: "ERC", vendor: "Raymond Steel", components: 200, zone: "Z003" },
  { id: "B003", type: "Sleeper", vendor: "Jindal Steel & Power", components: 100, zone: "Z005" },
  { id: "B004", type: "Liner", vendor: "Tata Steel", components: 75, zone: "Z007" },
]

const installationZones = [
  { code: "Z001", name: "Northern Railway", density: "High", curvature: "Low" },
  { code: "Z002", name: "Southern Railway", density: "Medium", curvature: "Medium" },
  { code: "Z003", name: "Western Railway", density: "High", curvature: "High" },
  { code: "Z004", name: "Eastern Railway", density: "Medium", curvature: "Low" },
  { code: "Z005", name: "Central Railway", density: "High", curvature: "Medium" },
]

export default function DeployBatch() {
  const [formData, setFormData] = useState({
    batchId: "",
    deploymentDate: new Date().toISOString().split("T")[0],
    installationZone: "",
    lineId: "",
    kmStart: "",
    kmEnd: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<{
    deploymentId: string
    fittingsDeployed: number
    mlPredictions: {
      urgent: number
      medium: number
      basic: number
    }
  } | null>(null)
  const { toast } = useToast()

  const selectedBatch = availableBatches.find((batch) => batch.id === formData.batchId)
  const selectedZone = installationZones.find((zone) => zone.code === formData.installationZone)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate mock deployment result with ML predictions
      const fittingsDeployed = selectedBatch?.components || 0
      const deploymentId = `D${Date.now().toString().slice(-6)}`

      // Mock ML prediction distribution
      const urgent = Math.floor(fittingsDeployed * 0.15) // 15% urgent
      const medium = Math.floor(fittingsDeployed * 0.35) // 35% medium
      const basic = fittingsDeployed - urgent - medium // Remaining as basic

      setDeploymentResult({
        deploymentId,
        fittingsDeployed,
        mlPredictions: { urgent, medium, basic },
      })

      toast({
        title: "Deployment Successful",
        description: `${fittingsDeployed} fittings deployed successfully`,
      })
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy batch. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (deploymentResult) {
    const total = deploymentResult.fittingsDeployed
    const { urgent, medium, basic } = deploymentResult.mlPredictions

    return (
      <DashboardLayout role="factory" title="Deployment Successful">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Success Header */}
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Deployment Completed Successfully!</CardTitle>
              <CardDescription>
                Batch {formData.batchId} has been deployed and ML predictions have been generated
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Deployment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Fittings Deployed</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-600">{total}</div>
                  <p className="text-sm text-muted-foreground">Components installed</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <PieChart className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">ML Predictions</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary">Generated</div>
                  <p className="text-sm text-muted-foreground">Failure predictions ready</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <Truck className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <CardTitle className="text-lg">Deployment ID</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-secondary">{deploymentResult.deploymentId}</div>
                  <p className="text-sm text-muted-foreground">Reference number</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Priority Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Maintenance Priority Distribution
                </CardTitle>
                <CardDescription>AI-powered failure prediction analysis for deployed components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-lg bg-red-50 dark:bg-red-950/20">
                    <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{urgent}</div>
                    <p className="font-medium text-red-800 dark:text-red-400">Urgent Priority</p>
                    <p className="text-sm text-muted-foreground">{Math.round((urgent / total) * 100)}% of components</p>
                    <Badge variant="destructive" className="mt-2">
                      Immediate attention required
                    </Badge>
                  </div>

                  <div className="text-center p-6 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">{medium}</div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-400">Medium Priority</p>
                    <p className="text-sm text-muted-foreground">{Math.round((medium / total) * 100)}% of components</p>
                    <Badge variant="secondary" className="mt-2">
                      Monitor regularly
                    </Badge>
                  </div>

                  <div className="text-center p-6 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{basic}</div>
                    <p className="font-medium text-green-800 dark:text-green-400">Basic Priority</p>
                    <p className="text-sm text-muted-foreground">{Math.round((basic / total) * 100)}% of components</p>
                    <Badge variant="outline" className="mt-2">
                      Standard maintenance
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setDeploymentResult(null)
                setFormData({
                  batchId: "",
                  deploymentDate: new Date().toISOString().split("T")[0],
                  installationZone: "",
                  lineId: "",
                  kmStart: "",
                  kmEnd: "",
                })
              }}
              variant="outline"
              className="flex-1"
            >
              Deploy Another Batch
            </Button>
            <Button className="flex-1">View Deployment Details</Button>
          </div>
        </motion.div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="factory" title="Deploy Batch">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Deploy Railway Component Batch
            </CardTitle>
            <CardDescription>
              Deploy a batch of components to a specific railway zone and track location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="batchId">Select Batch</Label>
                <Select
                  value={formData.batchId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, batchId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch to deploy" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.id} - {batch.type} ({batch.components} components)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedBatch && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Vendor:</strong> {selectedBatch.vendor} •<strong> Components:</strong>{" "}
                      {selectedBatch.components} •<strong> Type:</strong> {selectedBatch.type}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deploymentDate">Deployment Date</Label>
                  <Input
                    id="deploymentDate"
                    type="date"
                    value={formData.deploymentDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, deploymentDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installationZone">Installation Zone</Label>
                  <Select
                    value={formData.installationZone}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, installationZone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select installation zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {installationZones.map((zone) => (
                        <SelectItem key={zone.code} value={zone.code}>
                          {zone.code} - {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedZone && (
                    <div className="p-2 bg-muted rounded text-sm">
                      <strong>Density:</strong> {selectedZone.density} •<strong> Curvature:</strong>{" "}
                      {selectedZone.curvature}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lineId">Line ID</Label>
                <Input
                  id="lineId"
                  value={formData.lineId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lineId: e.target.value }))}
                  placeholder="Enter line identifier (e.g., NR-001, WR-045)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kmStart">KM Start</Label>
                  <Input
                    id="kmStart"
                    type="number"
                    step="0.1"
                    value={formData.kmStart}
                    onChange={(e) => setFormData((prev) => ({ ...prev, kmStart: e.target.value }))}
                    placeholder="125.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kmEnd">KM End</Label>
                  <Input
                    id="kmEnd"
                    type="number"
                    step="0.1"
                    value={formData.kmEnd}
                    onChange={(e) => setFormData((prev) => ({ ...prev, kmEnd: e.target.value }))}
                    placeholder="127.2"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={
                  isSubmitting ||
                  !formData.batchId ||
                  !formData.installationZone ||
                  !formData.lineId ||
                  !formData.kmStart ||
                  !formData.kmEnd
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying Batch...
                  </>
                ) : (
                  <>
                    <Truck className="mr-2 h-4 w-4" />
                    Deploy Batch
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}
