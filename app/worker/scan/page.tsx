"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scan, Camera } from "lucide-react";
import { useQrScanner } from "@/hooks/useQrScanner";

export default function WorkerScan() {
  const {
    videoRef,
    canvasRef,
    enabled,
    isMobile,
    decoded,
    error,
    handleEnable,
    handleSwitch,
    handleRescan,
    stop
  } = useQrScanner();

  return (
    <DashboardLayout role="worker" title="QR Scanner">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Scan className="h-5 w-5" />
              Railway Component QR Scanner
            </CardTitle>
            <CardDescription>
              Scan QR codes on railway components to get AI-powered failure predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-square bg-black rounded-lg overflow-hidden relative">
                {enabled ? (
                  <>
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
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
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="text-center space-y-4 mt-6">
              {!enabled && (
                <Button onClick={handleEnable} className="w-full h-12 text-base">
                  <Camera className="mr-2 h-5 w-5" />
                  Start Camera
                </Button>
              )}
              {enabled && (
                <Button onClick={stop} variant="outline" className="w-full h-12 text-base">
                  Stop Scanning
                </Button>
              )}
              {isMobile && enabled && (
                <Button onClick={handleSwitch} variant="secondary" className="w-full h-12 text-base">
                  Switch Camera
                </Button>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            {decoded && (
              <div className="mt-6 rounded border bg-white p-4">
                <div className="text-sm text-gray-600">Decoded QR Data:</div>
                <pre className="text-sm whitespace-pre-wrap break-all text-black">{decoded}</pre>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => navigator.clipboard.writeText(decoded)}
                    variant="outline"
                    className="px-3 py-2 text-sm"
                  >
                    Copy
                  </Button>
                  <Button
                    onClick={handleRescan}
                    className="bg-black text-white px-3 py-2 text-sm"
                  >
                    Scan Again
                  </Button>
                </div>
              </div>
            )}
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
                <p>Review the scanned QR data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
