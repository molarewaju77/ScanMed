import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scan, Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/auth/forgot-password", { email });

            if (response.data.success) {
                setEmailSent(true);
                toast.success("Reset link sent!", {
                    description: "Check your email for the password reset link."
                });
            }
        } catch (error: any) {
            console.error("Forgot password error:", error);
            toast.error("Failed to send reset link", {
                description: error.response?.data?.message || "Please try again later."
            });
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen gradient-medical flex items-center justify-center p-4">
                <div className="medical-card max-w-md w-full text-center" style={{ borderRadius: "24px" }}>
                    <div className="p-8">
                        <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-success" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
                        <p className="text-muted-foreground mb-6">
                            We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
                        </p>
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setEmailSent(false)}
                                className="w-full"
                            >
                                Send Again
                            </Button>
                            <Button
                                onClick={() => navigate("/auth")}
                                className="w-full gradient-medical text-white"
                            >
                                Back to Login
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-medical flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="medical-card" style={{ borderRadius: "24px", overflow: "hidden" }}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 rounded-2xl gradient-medical flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Scan className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Forgot Password?</h1>
                        <p className="text-muted-foreground mt-2">
                            No worries! Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full gradient-medical text-white h-12 text-base font-semibold"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="h-5 w-5 mr-2" />
                                    Send Reset Link
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate("/auth")}
                            className="text-sm text-primary hover:underline flex items-center justify-center gap-2 mx-auto"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
