// import { useState, useRef, useEffect } from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Smile,
  User,
  Camera,
  ArrowLeft,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Info,
  Scan as ScanIcon,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";
// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/lib/api";

type ScanType = "eye" | "teeth" | "skin" | null;

const scanOptions = [
  {
    id: "eye" as const,
    title: "Eye Scan",
    description: "Scan your eyes for irritation, redness, or early infections.",
    icon: Eye,
    instructions: [
      "Find a well-lit area",
      "Remove glasses if wearing any",
      "Look directly at the camera",
      "Keep your eyes open naturally",
    ],
  },
  {
    id: "teeth" as const,
    title: "Teeth Scan",
    description: "Analyze your teeth for dental health insights.",
    icon: Smile,
    instructions: [
      "Open your mouth wide",
      "Ensure good lighting inside mouth",
      "Capture upper and lower teeth",
      "Include gum line if possible",
    ],
  },
  {
    id: "skin" as const,
    title: "Face/Skin Scan",
    description: "Detect skin issues or inflammation.",
    icon: User,
    instructions: [
      "Remove makeup if possible",
      "Use natural lighting",
      "Capture the affected area clearly",
      "Include surrounding skin for context",
    ],
  },
];

import { LocationDialog } from "@/components/hospital/LocationDialog";
import { HospitalSearch } from "@/components/hospital/HospitalSearch";

const Scan = () => {
  const [selectedScan, setSelectedScan] = useState<ScanType>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showHospitalSearch, setShowHospitalSearch] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [invalidScanError, setInvalidScanError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [lightingCondition, setLightingCondition] = useState<"good" | "too_dark" | "too_bright">("good");
  const [showLightingWarning, setShowLightingWarning] = useState(false);
  const [isStable, setIsStable] = useState(true);
  const [blurStatus, setBlurStatus] = useState<"focused" | "blurry">("focused");
  const [scanReady, setScanReady] = useState(false);

  const previousFrameData = useRef<Uint8ClampedArray | null>(null);

  const selectedOption = scanOptions.find((opt) => opt.id === selectedScan);

  const startCamera = async () => {
    try {
      setCameraError(null);
      // Reset quality states
      setIsStable(true);
      setBlurStatus("focused");
      setScanReady(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please give permission.");
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setZoomLevel(1); // Reset zoom
  };

  // Attach stream to video element when it becomes available
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive, selectedScan]);

  const checkQuality = useCallback(() => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      const canvas = document.createElement("canvas");
      // Use smaller size for performance
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r, g, b, avg;
        let colorSum = 0;
        let edgeScore = 0; // Simple blur proxy via edge intensity
        let motionScore = 0; // Frame difference

        // Scan pixels
        for (let i = 0; i < data.length; i += 4) {
          r = data[i];
          g = data[i + 1];
          b = data[i + 2];
          avg = (r + g + b) / 3;
          colorSum += avg;

          // Edge detection (compare with neighbor) - Horizontal only for speed
          if (i > 4) {
            const prevAvg = (data[i - 4] + data[i - 3] + data[i - 2]) / 3;
            edgeScore += Math.abs(avg - prevAvg);
          }

          // Motion detection
          if (previousFrameData.current) {
            motionScore += Math.abs(avg - ((previousFrameData.current[i] + previousFrameData.current[i + 1] + previousFrameData.current[i + 2]) / 3));
          }
        }

        // Save current frame for next motion check
        previousFrameData.current = new Uint8ClampedArray(data);

        const totalPixels = data.length / 4;
        const brightness = Math.floor(colorSum / totalPixels);
        const avgEdge = edgeScore / totalPixels;
        const avgMotion = motionScore / totalPixels;

        // 1. Lighting Check
        let lighting: "good" | "too_dark" | "too_bright" = "good";
        if (brightness < 60) lighting = "too_dark";
        else if (brightness > 230) lighting = "too_bright";
        setLightingCondition(lighting);
        setShowLightingWarning(lighting !== "good");

        // 2. Stability/Motion Check (Threshold found experimentally, adjusted for sensitivity)
        const isMoving = avgMotion > 15;
        setIsStable(!isMoving);

        // 3. Blur Check (Low edge score = blurry)
        // Note: Edge score depends on content complexity, but < 5 is usually very blurry/flat.
        const isBlurry = avgEdge < 3;
        setBlurStatus(isBlurry ? "blurry" : "focused");

        // GLOBAL READY STATE
        // Ready if: Good Lighting AND Stable AND Focused
        const isReady = lighting === "good" && !isMoving && !isBlurry;
        setScanReady(isReady);
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cameraActive && !isScanning && !scanComplete) {
      interval = setInterval(checkQuality, 500); // Check every 500ms
    }
    return () => clearInterval(interval);
  }, [cameraActive, isScanning, scanComplete, checkQuality]);

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }
      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      });
    }
    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      performScan(file);
    }
  };

  const performScan = async (imageSource: Blob | File) => {
    setIsScanning(true);
    toast.info("Analyzing your scan...");

    try {
      const formData = new FormData();
      formData.append("image", imageSource);
      formData.append("scanType", selectedScan || "");

      // Call ML endpoint
      const response = await api.post("/ml/analyze-face", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        stopCamera();

        // Handle Invalid Result (Wrong Body Part)
        if (response.data.data.status === "Invalid") {
          setLightingCondition("good");
          setScanResult(response.data.data);
          // Use summary for error message in this new structure
          setCameraError(response.data.data.summary || "We couldn't detect the correct body part.");

          startCamera();
          setInvalidScanError(response.data.data.summary);
          return;
        }

        setScanResult(response.data.data);
        setScanComplete(true);
        setInvalidScanError(null);
        toast.success("Scan completed successfully!");

        // Auto-trigger hospital finder if result is dangerous/urgent
        if (
          response.data.data.needsHospital ||
          response.data.data.severity === "high"
        ) {
          toast.warning("⚠️ Urgent: Medical attention recommended!");
          setTimeout(() => {
            setShowLocationDialog(true);
          }, 1500); // Delay for user to see the result first
        }
      }
    } catch (error) {
      console.error("Error performing scan:", error);
      toast.error("Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleStartScan = async () => {
    const imageBlob = await captureImage();
    if (!imageBlob) {
      toast.error("Failed to capture image");
      return;
    }
    performScan(imageBlob);
  };

  const handleBack = () => {
    stopCamera();
    setSelectedScan(null);
    setIsScanning(false);
    setScanComplete(false);
    setScanResult(null);
    setScanResult(null);
    setCameraError(null);
    setInvalidScanError(null);
  };

  useEffect(() => {
    if (selectedScan && !cameraActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [selectedScan]);

  if (selectedScan && selectedOption) {
    return (
      <MainLayout>
        <div className="max-w-xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scan Selection
          </Button>

          {/* Header */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-3">
              <selectedOption.icon className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {selectedOption.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedOption.description}
            </p>
          </div>

          {!scanComplete ? (
            <>
              {/* Camera View */}
              <div className="medical-card p-4">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transition-transform duration-200"
                        style={{ transform: `scale(${zoomLevel})` }}
                      />

                      {/* Targeting Overlays */}
                      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                        {selectedScan === "eye" && (
                          <div className="w-64 h-32 border-2 border-white/50 rounded-[50%] box-content shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] flex items-center justify-center">
                            <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
                          </div>
                        )}
                        {selectedScan === "teeth" && (
                          <div className="w-56 h-32 border-2 border-white/50 rounded-[2rem] box-content shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
                        )}
                        {selectedScan === "skin" && (
                          <div className="w-56 h-72 border-2 border-white/50 rounded-[4rem] box-content shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
                        )}
                      </div>

                      {/* Zoom Controls */}
                      <div className="absolute bottom-4 left-0 right-0 px-8 flex items-center gap-4 z-10">
                        <ZoomOut className="w-4 h-4 text-white" />
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.1"
                          value={zoomLevel}
                          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                          className="flex-1 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                      {/* Real-time Quality Badges */}
                      {(showLightingWarning || !isStable || blurStatus === 'blurry') && !isScanning && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col gap-2 items-center w-full pointer-events-none">
                          {showLightingWarning && (
                            <Badge variant="destructive" className="flex items-center gap-1 shadow-lg animate-pulse">
                              <AlertCircle className="w-3 h-3" />
                              {lightingCondition === "too_dark"
                                ? "Too Dark - Add Light"
                                : "Too Bright - Reduce Light"}
                            </Badge>
                          )}
                          {!isStable && (
                            <Badge variant="secondary" className="flex items-center gap-1 shadow-lg bg-yellow-500 text-white animate-pulse">
                              <Maximize className="w-3 h-3" />
                              Hold Camera Steady
                            </Badge>
                          )}
                          {isStable && blurStatus === 'blurry' && !showLightingWarning && (
                            <Badge variant="secondary" className="flex items-center gap-1 shadow-lg bg-orange-500 text-white animate-pulse">
                              <Eye className="w-3 h-3" />
                              Focusing...
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Invalid Scan / Wrong Body Part Warning Overlay */}
                      {invalidScanError && !isScanning && (
                        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center p-4 z-20 backdrop-blur-md">
                          <AlertCircle className="w-12 h-12 text-destructive mb-3" />
                          <h3 className="text-lg font-bold text-foreground mb-1">
                            Incorrect Scan Target
                          </h3>
                          <p className="text-sm text-center text-muted-foreground mb-4 px-4">
                            {invalidScanError}
                          </p>
                          <div className="flex gap-2 w-full max-w-xs flex-col">
                            <Button
                              variant="default"
                              className="w-full gradient-medical"
                              onClick={() => navigate("/chat")}
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Go to AI Symptom Checker
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setInvalidScanError(null)}
                            >
                              Try Again
                            </Button>
                          </div>
                        </div>
                      )}
                      {isScanning && (
                        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                          <div className="w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
                          <p className="text-foreground font-medium">
                            Analyzing {selectedOption?.title}...
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Checking for health indicators
                          </p>
                        </div>
                      )}
                      {!isScanning && (
                        <button
                          onClick={stopCamera}
                          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                        >
                          <X className="w-4 h-4 text-foreground" />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      {cameraError ? (
                        <>
                          <AlertCircle className="w-10 h-10 text-destructive mb-3" />
                          <p className="text-sm text-destructive font-medium mb-2">
                            {cameraError}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={startCamera}
                          >
                            Retry Camera
                          </Button>
                        </>
                      ) : (
                        <>
                          <Camera className="w-10 h-10 text-muted-foreground mb-3" />
                          <p className="text-sm text-muted-foreground">
                            Initializing camera...
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  className={cn("w-full transition-all duration-300", !scanReady ? "bg-muted text-muted-foreground" : "gradient-medical text-primary-foreground")}
                  onClick={handleStartScan}
                  disabled={isScanning || !cameraActive || !scanReady}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isScanning ? "Scanning..." : !scanReady ? "Adjust Camera..." : "Capture & Scan"}
                </Button>

                {/* Upload Button Removed as per request */}
              </div>

              {/* Instructions */}
              <div className="medical-card">
                <h3 className="font-semibold text-foreground mb-3">
                  Quick Tips
                </h3>
                <ul className="space-y-2">
                  {selectedOption.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-accent text-primary text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            /* Results View */
            <div className="space-y-6 animate-fade-in pb-20">
              <div className="medical-card p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      scanResult?.status === "Good"
                        ? "bg-green-100 text-green-600"
                        : scanResult?.status === "Low"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                    )}
                  >
                    {scanResult?.status === "Good" ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <AlertCircle className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Analysis Complete</h2>
                    <p className="text-muted-foreground">
                      Here are your AI-generated results
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between p-4 bg-accent/50 rounded-xl">
                    <span className="font-medium">Overall Status</span>
                    <Badge
                      variant={
                        scanResult?.status === "Good"
                          ? "default" // Green/Primary usually
                          : scanResult?.status === "Critical"
                            ? "destructive"
                            : "secondary" // Yellow/Warning usually needs custom class
                      }
                      className={cn(
                        "text-base px-4 py-1",
                        scanResult?.status === "Good" && "bg-green-500 hover:bg-green-600",
                        scanResult?.status === "Low" && "bg-yellow-500 hover:bg-yellow-600 text-white",
                        scanResult?.status === "Critical" && "bg-red-500 hover:bg-red-600"
                      )}
                    >
                      {scanResult?.status || "Unknown"}
                    </Badge>
                  </div>

                  {/* Health Score */}
                  {scanResult?.healthScore !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Health Score
                        </span>
                        <span className={`font-bold ${scanResult.healthScore > 60 ? "text-green-600" :
                          scanResult.healthScore > 40 ? "text-yellow-600" : "text-red-600"
                          }`}>
                          {scanResult.healthScore}/100
                        </span>
                      </div>
                      <div className="h-4 bg-accent rounded-full overflow-hidden relative">
                        <div
                          className={cn(
                            "h-full transition-all duration-1000 rounded-full",
                            scanResult.healthScore > 60 ? "bg-green-500" :
                              scanResult.healthScore > 40 ? "bg-yellow-500" : "bg-red-500"
                          )}
                          style={{ width: `${scanResult.healthScore}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground px-1">
                        <span>Critical</span>
                        <span>Low</span>
                        <span>Good</span>
                      </div>
                    </div>
                  )}

                  {/* Findings List (Diagnostics) */}
                  {scanResult?.findings && scanResult.findings.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        Key Findings
                      </h3>
                      <ul className="space-y-2 bg-accent/30 p-4 rounded-lg">
                        {scanResult.findings.map((finding: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Notes Summary */}
                  {scanResult?.summary && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="ml-2">
                        {scanResult.summary}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Recommendations */}
                  {scanResult?.recommendations &&
                    scanResult.recommendations.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Recommendations
                        </h3>
                        <ul className="space-y-2">
                          {scanResult.recommendations.map(
                            (rec: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                {rec}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setScanComplete(false);
                      setScanResult(null);
                      startCamera();
                    }}
                  >
                    <ScanIcon className="w-4 h-4 mr-2" />
                    New Scan
                  </Button>
                  <Button className="flex-1 gradient-medical" asChild>
                    <Link to="/history">
                      View History
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-4">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setShowLocationDialog(true)}
                  >
                    Find Nearby Hospitals
                  </Button>
                </div>
              </div>
            </div>
          )}

          <LocationDialog
            open={showLocationDialog}
            onOpenChange={setShowLocationDialog}
            onLocationSubmit={(loc) => {
              setUserLocation(loc);
              setShowHospitalSearch(true);
            }}
          />

          <HospitalSearch
            open={showHospitalSearch}
            onOpenChange={setShowHospitalSearch}
            location={userLocation}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Start a Scan</h1>
          <p className="text-muted-foreground mt-1">
            Choose a scan type to analyze your health
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {scanOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedScan(option.id)}
              className="medical-card-hover text-left group"
            >
              <div className="scan-card-icon mb-4 group-hover:scale-110 transition-transform">
                <option.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {option.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="medical-card bg-accent/50 border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">How it works</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our AI-powered scanning technology analyzes your images to detect
            potential health issues. Results are generated in seconds and stored
            securely in your health profile. All scans are for informational
            purposes and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Scan;
