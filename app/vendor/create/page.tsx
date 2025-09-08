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
import { QrCode, Package, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const componentTypes = ["Elastic Rail Clips", "Liners", "Rail Pad", "Sleeper"]

const vendors = [
  { code: "V001", name: "Rahee Track Technologies" },
  { code: "V002", name: "Raymond Steel" },
  { code: "V003", name: "Eastern Track Udyog" },
  { code: "V004", name: "Royal Infraconstru Ltd." },
  { code: "V005", name: "Pooja Industries" },
  { code: "V006", name: "Jekay International" },
  { code: "V007", name: "Avantika Concrete" },
  { code: "V008", name: "Gammon India" },
]

const zones = [
  { code: "Z001", name: "Central Railway (CR)" },
  { code: "Z002", name: "Eastern Railway (ER)" },
  { code: "Z003", name: "Northern Railway (NR)" },
  { code: "Z004", name: "North Eastern Railway (NER)" },
  { code: "Z005", name: "Northeast Frontier Railway (NFR)" },
  { code: "Z006", name: "Southern Railway (SR)" },
  { code: "Z007", name: "South Central Railway (SCR)" },
  { code: "Z008", name: "South Eastern Railway (SER)" },
  { code: "Z009", name: "Western Railway (WR)" },
  { code: "Z010", name: "South Western Railway (SWR)" },
  { code: "Z011", name: "North Western Railway (NWR)" },
  { code: "Z012", name: "West Central Railway (WCR)" },
  { code: "Z013", name: "East Central Railway (ECR)" },
  { code: "Z014", name: "East Coast Railway (ECoR)" },
  { code: "Z015", name: "North Central Railway (NCR)" },
  { code: "Z016", name: "South East Central Railway (SECR)" },
  { code: "Z017", name: "Kolkata Metro Railway (KMRC)" },
  { code: "Z018", name: "Delhi Metro Rail Corporation (DMRC)" },
]

const batchNumbers = ["B001", "B002", "B003", "B004", "B005", "B006", "B007", "B008", "B009"]

export default function CreateComponent() {
  const [formData, setFormData] = useState({
    componentType: "",
    manufacturer: "",
    officialZone: "",
    batch: "",
    warrantyPeriodYears: "",
    dateOfSupply: new Date().toISOString().split("T")[0],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{
    uid: string
    qrCode: string
  } | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Call backend API to create component
      const response = await fetch("/api/vendor/create_component", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          component_type: formData.componentType,
          manufacturer: formData.manufacturer,
          official_zone: formData.officialZone,
          batch: formData.batch,
          warranty_period_years: Number.parseInt(formData.warrantyPeriodYears),
          date_of_supply: formData.dateOfSupply,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create component")
      }

      const result = await response.json()

      // Generate QR code with the proper UID format
      const qrCode = `data:image/svg+xml,${encodeURIComponent(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="10" y="10" width="180" height="180" fill="black"/>
          <rect x="20" y="20" width="160" height="160" fill="white"/>
          <rect x="30" y="30" width="140" height="140" fill="black"/>
          <rect x="40" y="40" width="120" height="120" fill="white"/>
          <text x="100" y="95" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="black">Railway Fitting</text>
          <text x="100" y="110" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="black">${result.uid}</text>
          <text x="100" y="125" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="black">${formData.componentType}</text>
        </svg>
      `)}`

      setSubmissionResult({ uid: result.uid, qrCode })
      toast({
        title: "Component Created Successfully",
        description: `UID: ${result.uid}`,
      })
    } catch (error) {
      console.error("Error creating component:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create component. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submissionResult) {
    return (
      <DashboardLayout role="vendor" title="Component Created">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Component Created Successfully!</CardTitle>
              <CardDescription>Your railway component has been registered in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <Label className="text-sm font-medium">Component UID</Label>
                <p className="text-lg font-mono mt-1">{submissionResult.uid}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Format: IR{new Date().getFullYear().toString().slice(-2)}-ZONE-VENDOR-BATCH-SERIAL
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Label className="text-sm font-medium">QR Code Preview</Label>
                <div className="p-4 bg-white rounded-lg border">
                  <img src={submissionResult.qrCode || "/placeholder.svg"} alt="QR Code" className="w-32 h-32" />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setSubmissionResult(null)
                    setFormData({
                      componentType: "",
                      manufacturer: "",
                      officialZone: "",
                      batch: "",
                      warrantyPeriodYears: "",
                      dateOfSupply: new Date().toISOString().split("T")[0],
                    })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Create Another
                </Button>
                <Button className="flex-1">
                  <QrCode className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="vendor" title="Create Component">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Create New Railway Component
            </CardTitle>
            <CardDescription>Register a new railway fitting component with proper UID generation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="componentType">Component Type</Label>
                  <Select
                    value={formData.componentType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, componentType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select component type" />
                    </SelectTrigger>
                    <SelectContent>
                      {componentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Select
                    value={formData.manufacturer}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, manufacturer: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.code} value={vendor.name}>
                          {vendor.code} - {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officialZone">Official Zone</Label>
                  <Select
                    value={formData.officialZone}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, officialZone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone.code} value={zone.code}>
                          {zone.code} - {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch">Batch Number</Label>
                  <Select
                    value={formData.batch}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, batch: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch number" />
                    </SelectTrigger>
                    <SelectContent>
                      {batchNumbers.map((batch) => (
                        <SelectItem key={batch} value={batch}>
                          {batch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyPeriodYears">Warranty Period (Years)</Label>
                  <Input
                    id="warrantyPeriodYears"
                    type="number"
                    min="1"
                    max="25"
                    value={formData.warrantyPeriodYears}
                    onChange={(e) => setFormData((prev) => ({ ...prev, warrantyPeriodYears: e.target.value }))}
                    placeholder="Enter warranty period"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfSupply">Date of Supply</Label>
                  <Input
                    id="dateOfSupply"
                    type="date"
                    value={formData.dateOfSupply}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dateOfSupply: e.target.value }))}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm font-medium">UID Preview</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Format: IR{new Date().getFullYear().toString().slice(-2)}-{formData.officialZone || "ZONE"}-
                  {vendors.find((v) => v.name === formData.manufacturer)?.code || "VENDOR"}-{formData.batch || "BATCH"}
                  -XXXXXX
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={
                  isSubmitting ||
                  !formData.componentType ||
                  !formData.manufacturer ||
                  !formData.officialZone ||
                  !formData.batch ||
                  !formData.warrantyPeriodYears
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Component...
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Create Component
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
