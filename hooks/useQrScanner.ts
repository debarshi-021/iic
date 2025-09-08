import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type Facing = "environment" | "user";

export function useQrScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [facing, setFacing] = useState<Facing>("environment");
  const [decoded, setDecoded] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const uaDataMobile =
      (navigator as Navigator & { userAgentData?: { mobile?: boolean } })
        .userAgentData?.mobile === true;
    setIsMobile(
      /Android|iPhone|iPad|iPod|IEMobile|Mobile|Opera Mini/i.test(ua) ||
        uaDataMobile
    );

    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    const v = videoRef.current;
    if (v) v.srcObject = null;
    setEnabled(false);
  }

  function scanLoop() {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c || v.readyState < 2) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 480;
    const ctx = c.getContext("2d");
    if (!ctx) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const code = jsQR(img.data, img.width, img.height, {
      inversionAttempts: "attemptBoth",
    });
    if (code && code.data) {
      setDecoded(code.data);
      stop();
      return;
    }
    rafRef.current = requestAnimationFrame(scanLoop);
  }

  async function start(targetFacing?: Facing) {
    try {
      setError("");
      setDecoded(null);
      setEnabled(true);

      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      const v = videoRef.current;
      if (!v) {
        setError("Video element not mounted");
        setEnabled(false);
        return;
      }

      const isSecure =
        location.protocol === "https:" ||
        ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
      if (!isSecure) {
        setError("Camera requires HTTPS or localhost/127.0.0.1.");
        setEnabled(false);
        return;
      }

      const face = isMobile ? targetFacing ?? facing : undefined;
      const constraints: MediaStreamConstraints = face
        ? { video: { facingMode: { ideal: face } }, audio: false }
        : { video: true, audio: false };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      v.srcObject = stream;
      await v.play().catch(() => {});
      scanLoop();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start camera");
      stop();
    }
  }

  async function handleEnable() {
    await start("environment");
  }

  async function handleSwitch() {
    if (!isMobile) return;
    const next: Facing = facing === "environment" ? "user" : "environment";
    setFacing(next);
    stop();
    await start(next);
  }

  async function handleRescan() {
    setDecoded(null);
    await start(facing);
  }

  return {
    videoRef,
    canvasRef,
    enabled,
    setEnabled,
    isMobile,
    facing,
    setFacing,
    decoded,
    setDecoded,
    error,
    setError,
    handleEnable,
    handleSwitch,
    handleRescan,
    stop,
  };
}