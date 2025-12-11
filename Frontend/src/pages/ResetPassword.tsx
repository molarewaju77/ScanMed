import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Scan, Loader2, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid reset link");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(`/auth/reset-password/${token}`, { password });

            if (response.data.success) {
                setSuccess(true);
                toast.success("Password reset successful!", {
                    description: "Redirecting to login..."
                });
                setTimeout(() => {
                    navigate("/auth");
                }, 2000);
            }
        } catch (error: any) {
            console.error("Reset password error:", error);
            toast.error("Failed to reset password", {
                description: error.response?.data?.message || "Invalid or expired reset link"
            });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen gradient-medical flex items-center justify-center p-4">
                <div className="medical-card max-w-md w-full text-center" style={{ borderRadius: "24px" }}>
                    <div className="p-8">
                        <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-10 h-10 text-destructive" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Reset Link</h1>
                        <p className="text-muted-foreground mb-6">
                            This password reset link is invalid or has expired.
                        </p>
                        <Button onClick={() => navigate("/auth")} className="gradient-medical text-white">
                            Back to Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen gradient-medical flex items-center justify-center p-4">
                <div className="medical-card max-w-md w-full text-center" style={{ borderRadius: "24px" }}>
                    <div className="p-8">
                        <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-success" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Password Reset!</h1>
                        <p className="text-muted-foreground mb-6">
                            Your password has been successfully reset. You can now log in with your new password.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 text-success text-sm">
                                <CheckCircle className="h-4 w-4" />
                                <span>Your account is now secure</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Redirecting to login...</p>
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
                        <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
                        <p className="text-muted-foreground mt-2">
                            Enter your new password below
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {password && password.length < 6 && (
                                <p className="text-xs text-destructive">Password must be at least 6 characters</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-destructive">Passwords do not match</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || password.length < 6 || password !== confirmPassword}
                            className="w-full gradient-medical text-white h-12 text-base font-semibold mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Reset Password
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate("/auth")}
                            className="text-sm text-primary hover:underline"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
