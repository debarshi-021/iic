"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scan, Camera, AlertTriangle, CheckCircle, Clock, Package, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock QR Scanner Component (in a real app, you'd use react-qr-reader or html5-qrcode)
function QRScanner({ onScan, isActive }: { onScan: (data: string) => void; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasCamera, setHasCamera] = useState(false)

  useEffect(() => {
    if (isActive && videoRef.current) {
      // Simulate camera access
      setHasCamera(true)

      // Simulate QR code detection after 3 seconds for demo
      const timer = setTimeout(() => {
        onScan("RFM-1705123456-ABC123DEF")
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isActive, onScan])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="aspect-square bg-black rounded-lg overflow-hidden relative">
        {isActive ? (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            {/* Scanner overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

                {/* Scanning line animation */}
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-primary"
                  animate={{ y: [0, 192, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full inline-block">
                Position QR code within the frame
              </p>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm opacity-75">Camera not active</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WorkerScan() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{
    uid: string
    componentType: string
    vendor: string
    batchId: string
    warrantyLeft: number
    location: string
    mlPrediction: {
      daysToFail: number
      priority: "Urgent" | "Medium" | "Basic"
      confidence: number
    }
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleScan = async (qrData: string) => {
    setIsProcessing(true)
    setIsScanning(false)

    try {
      // Simulate API call to /scans/submit
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock scan result data
      const mockResult = {
        uid: qrData,
        componentType: "Rail Pad",
        vendor: "Rahee Track Technologies",
        batchId: "B001",
        warrantyLeft: 3.2,
        location: "Line NR-001, KM 125.7",
        mlPrediction: {
          daysToFail: 15,
          priority: "Urgent" as const,
          confidence: 87,
        },
      }

      setScanResult(mockResult)

      // Show appropriate toast based on priority
      if (mockResult.mlPrediction.priority === "Urgent") {
        toast({
          title: "⚠️ URGENT ATTENTION REQUIRED",
          description: `Component predicted to fail in ${mockResult.mlPrediction.daysToFail} days`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Scan Successful",
          description: `Component logged with ${mockResult.mlPrediction.priority} priority`,
        })
      }
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Failed to process QR code. Please try again.",
        variant: "destructive",
      })
      setIsScanning(false)
    } finally {
      setIsProcessing(false)
    }
  }

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return AlertTriangle
      case "Medium":
        return Clock
      case "Basic":
        return CheckCircle
      default:
        return CheckCircle
    }
  }

  if (scanResult) {
    const PriorityIcon = getPriorityIcon(scanResult.mlPrediction.priority)

    return (
      <DashboardLayout role="worker" title="Scan Result">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Priority Alert */}
          <AnimatePresence>
            {scanResult.mlPrediction.priority === "Urgent" && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(239, 68, 68, 0.4)",
                      "0 0 0 10px rgba(239, 68, 68, 0)",
                      "0 0 0 0 rgba(239, 68, 68, 0)",
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="rounded-lg"
                >
                  <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                        <motion.div
                          animate={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5, repeat: 3 }}
                        >
                          <AlertTriangle className="h-6 w-6" />
                        </motion.div>
                        URGENT INSPECTION REQUIRED
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-red-700 dark:text-red-300 text-lg font-medium">
                        This component is predicted to fail in {scanResult.mlPrediction.daysToFail} days!
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Component Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Component Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Component UID</Label>
                  <p className="font-mono text-sm mt-1 p-2 bg-muted rounded">{scanResult.uid}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="font-medium mt-1">{scanResult.componentType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Vendor</Label>
                  <p className="mt-1">{scanResult.vendor}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Batch ID</Label>
                  <p className="mt-1">{scanResult.batchId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Warranty Remaining</Label>
                  <p className="mt-1">{scanResult.warrantyLeft} years</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                  <p className="mt-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {scanResult.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ML Prediction Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PriorityIcon className="h-5 w-5" />
                AI Prediction Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold mb-2">{scanResult.mlPrediction.daysToFail}</div>
                  <p className="text-sm text-muted-foreground">Days to Predicted Failure</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Badge className={`${getPriorityColor(scanResult.mlPrediction.priority)} text-lg px-3 py-1 mb-2`}>
                    {scanResult.mlPrediction.priority}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Priority Level</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold mb-2">{scanResult.mlPrediction.confidence}%</div>
                  <p className="text-sm text-muted-foreground">Prediction Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setScanResult(null)
                setIsScanning(false)
              }}
              variant="outline"
              className="flex-1"
            >
              Scan Another Component
            </Button>
            <Button className="flex-1">Report Issue</Button>
          </div>
        </motion.div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="worker" title="QR Scanner">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Scanner Interface */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Scan className="h-5 w-5" />
              Railway Component QR Scanner
            </CardTitle>
            <CardDescription>Scan QR codes on railway components to get AI-powered failure predictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <QRScanner onScan={handleScan} isActive={isScanning} />

            <div className="text-center space-y-4">
              {!isScanning && !isProcessing && (
                <Button onClick={() => setIsScanning(true)} className="w-full h-12 text-base">
                  <Camera className="mr-2 h-5 w-5" />
                  Start Camera
                </Button>
              )}

              {isScanning && !isProcessing && (
                <Button onClick={() => setIsScanning(false)} variant="outline" className="w-full h-12 text-base">
                  Stop Scanning
                </Button>
              )}

              {isProcessing && (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"
                  />
                  <p className="text-muted-foreground">Processing QR code...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scanning Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p>Position the QR code within the scanning frame</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p>Hold steady until the code is automatically detected</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p>Review the component information and ML predictions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p>Take appropriate action based on the priority level</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function Label({ className, children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  )
}
