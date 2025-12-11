import { useState, useRef, useEffect } from "react";
import { Eye, Smile, User, Camera, ArrowLeft, X, CheckCircle, AlertCircle, Sparkles, Info, Scan as ScanIcon } from "lucide-react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = scanOptions.find((opt) => opt.id === selectedScan);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }
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
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Attach stream to video element when it becomes available
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive, selectedScan]);

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
        setScanResult(response.data.data);
        setScanComplete(true);
        toast.success("Scan completed successfully!");

        // Auto-trigger hospital finder if result is dangerous/urgent
        if (response.data.data.needsHospital || response.data.data.severity === "high") {
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
    setCameraError(null);
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
            <h1 className="text-xl font-bold text-foreground">{selectedOption.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{selectedOption.description}</p>
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
                        className="w-full h-full object-cover"
                      />
                      {isScanning && (
                        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                          <div className="w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
                          <p className="text-foreground font-medium">Analyzing {selectedOption?.title}...</p>
                          <p className="text-sm text-muted-foreground">Checking for health indicators</p>
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
                          <p className="text-sm text-destructive font-medium mb-2">{cameraError}</p>
                          <Button variant="outline" size="sm" onClick={startCamera}>Retry Camera</Button>
                        </>
                      ) : (
                        <>
                          <Camera className="w-10 h-10 text-muted-foreground mb-3" />
                          <p className="text-sm text-muted-foreground">Initializing camera...</p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  className="w-full gradient-medical text-primary-foreground mt-4"
                  onClick={handleStartScan}
                  disabled={isScanning || !cameraActive}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isScanning ? "Scanning..." : "Capture & Scan"}
                </Button>

                <div className="mt-3 text-center">
                  <span className="text-sm text-muted-foreground">or</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                >
                  Upload Image
                </Button>
              </div>

              {/* Instructions */}
              <div className="medical-card">
                <h3 className="font-semibold text-foreground mb-3">Quick Tips</h3>
                <ul className="space-y-2">
                  {selectedOption.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-accent text-primary text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            /* Results View */
            <div className="space-y-6 animate-fade-in">
              <div className="medical-card p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    scanResult?.result === 'Healthy' ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                  )}>
                    {scanResult?.result === 'Healthy' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Analysis Complete</h2>
                    <p className="text-muted-foreground">Here are your AI-generated results</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between p-4 bg-accent/50 rounded-xl">
                    <span className="font-medium">Overall Status</span>
                    <Badge variant={scanResult?.result === 'Healthy' ? "default" : "destructive"} className="text-base px-4 py-1">
                      {scanResult?.result || "Unknown"}
                    </Badge>
                  </div>

                  {/* Confidence */}
                  {scanResult?.confidence && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">AI Confidence</span>
                        <span className="font-medium">{scanResult.confidence}%</span>
                      </div>
                      <div className="h-2 bg-accent rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: `${scanResult.confidence}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="ml-2">
                      {scanResult?.notes}
                    </AlertDescription>
                  </Alert>

                  {/* Recommendations */}
                  {scanResult?.recommendations && scanResult.recommendations.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {scanResult.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            {rec}
                          </li>
                        ))}
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
                  <Button variant="secondary" className="w-full" onClick={() => setShowLocationDialog(true)}>
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
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="medical-card bg-accent/50 border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">How it works</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our AI-powered scanning technology analyzes your images to detect potential health issues.
            Results are generated in seconds and stored securely in your health profile.
            All scans are for informational purposes and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Scan;
