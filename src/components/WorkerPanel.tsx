"use client";

import React from "react";
import { useQrScanner } from "../hooks/useQrScanner";
import { validateUID } from "../utils/uidSchema";

export default function WorkerPanel() {
  const {
    videoRef,
    canvasRef,
    enabled,
    isMobile,
    facing,
    decoded,
    error,
    handleEnable,
    handleSwitch,
    handleRescan,
    stop,
  } = useQrScanner();

  const uidInfo = decoded ? validateUID(decoded) : null;

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-xl font-semibold">Worker Panel: QR Scanner</h1>

        {!enabled && !decoded && (
          <div className="rounded border bg-white p-4">
            <p className="text-sm mb-3">
              Scan QR to extract UID string for Worker Panel.
            </p>
            <button
              onClick={handleEnable}
              className="rounded bg-black text-white px-4 py-2 text-sm"
            >
              Enable camera &amp; Start scan
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        )}

        <div className={`space-y-3 ${enabled ? "block" : "hidden"}`}>
          <div className="relative rounded border bg-black inline-block overflow-hidden">
            <video
              ref={videoRef}
              className="w-full max-w-lg h-80 object-contain"
              muted
              playsInline
              autoPlay
            />
            <div className="scanline pointer-events-none" />
            <div className="mask pointer-events-none" />
          </div>
          <div className="flex gap-2">
            {isMobile && (
              <button
                onClick={handleSwitch}
                className="rounded border px-4 py-2 text-sm"
              >
                Switch camera
              </button>
            )}
            <button onClick={stop} className="rounded border px-4 py-2 text-sm">
              Stop
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {decoded && !enabled && (
          <div className="rounded border bg-white p-4 space-y-3">
            <div className="text-sm text-gray-600">Decoded text:</div>
            <pre className="text-sm whitespace-pre-wrap break-all text-black">
              {decoded}
            </pre>
            {uidInfo ? (
              <div className="text-sm text-green-600">
                <div>Year: {uidInfo.year}</div>
                <div>Zone: {uidInfo.zone}</div>
                <div>Vendor: {uidInfo.vendor}</div>
                <div>Batch: {uidInfo.batch}</div>
                <div>Serial: {uidInfo.serial}</div>
              </div>
            ) : (
              <div className="text-sm text-red-600">Invalid UID format!</div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(decoded)}
                className="rounded border px-3 py-2 text-sm"
              >
                Copy
              </button>
              <button
                onClick={handleRescan}
                className="rounded bg-black text-white px-3 py-2 text-sm"
              >
                Scan again
              </button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {/* Style for scanline and mask */}
      <style jsx>{`
        .scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 0, 0, 0.9);
          box-shadow: 0 0 12px rgba(255, 0, 0, 0.6),
            0 0 2px rgba(255, 0, 0, 1) inset;
          animation: scan-vert 2.2s linear infinite;
        }
        @keyframes scan-vert {
          0% {
            top: 0%;
          }
          95% {
            top: calc(100% - 2px);
          }
          100% {
            top: calc(100% - 2px);
          }
        }
        .mask {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.35) 0%,
            rgba(0, 0, 0, 0) 15%,
            rgba(0, 0, 0, 0) 85%,
            rgba(0, 0, 0, 0.35) 100%
          );
        }
      `}</style>
    </div>
  );
}