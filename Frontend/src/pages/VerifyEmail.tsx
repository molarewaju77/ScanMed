import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Scan, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [autoVerifying, setAutoVerifying] = useState(false);

    // Auto-verify if code is in URL
    useEffect(() => {
        const urlCode = searchParams.get("code");
        if (urlCode) {
            setCode(urlCode);
            handleVerify(urlCode);
        }
    }, [searchParams]);

    const handleVerify = async (verificationCode?: string) => {
        const codeToVerify = verificationCode || code;

        if (!codeToVerify || codeToVerify.length !== 6) {
            toast.error("Please enter a valid 6-digit code");
            return;
        }

        setLoading(true);
        if (verificationCode) setAutoVerifying(true);

        try {
            const response = await api.post("/auth/verify-email", { code: codeToVerify });

            if (response.data.success) {
                toast.success("Email verified successfully!", {
                    description: "Redirecting to login..."
                });
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }
        } catch (error: any) {
            console.error("Verification error:", error);
            toast.error("Verification failed", {
                description: error.response?.data?.message || "Invalid or expired code"
            });
        } finally {
            setLoading(false);
            setAutoVerifying(false);
        }
    };

    return (
        <div className="min-h-screen gradient-medical flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="medical-card" style={{ borderRadius: "24px", overflow: "hidden" }}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 rounded-2xl gradient-medical flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Scan className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Verify Your Email</h1>
                        <p className="text-muted-foreground mt-2">
                            Enter the 6-digit code we sent to your email
                        </p>
                    </div>

                    {autoVerifying ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Verifying your email...</p>
                        </div>
                    ) : (
                        <>
                            {/* Code Input */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="000000"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        className="text-center text-2xl font-bold letter-spacing-wider h-16"
                                        maxLength={6}
                                    />
                                </div>

                                <Button
                                    onClick={() => handleVerify()}
                                    disabled={loading || code.length !== 6}
                                    className="w-full gradient-medical text-white h-12 text-base font-semibold"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            Verify Email
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Help Text */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground mb-3">
                                    Didn't receive the code?
                                </p>
                                <Button variant="outline" size="sm">
                                    Resend Code
                                </Button>
                            </div>

                            {/* Back to Login */}
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => navigate("/auth")}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
