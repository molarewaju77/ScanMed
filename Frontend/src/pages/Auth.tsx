import { useState } from "react";
import { Scan, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { PrivacyPolicyDialog } from "@/components/auth/PrivacyPolicyDialog";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validatePassword = (pass: string) => {
      const errors = [];
      if (pass.length < 8) errors.push("at least 8 characters");
      if (!/[A-Z]/.test(pass)) errors.push("one uppercase letter");
      if (!/[0-9]/.test(pass)) errors.push("one number");
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass))
        errors.push("one special character");

      if (errors.length > 0) {
        return "Password is missing: " + errors.join(", ");
      }
      return null;
    };

    try {
      if (isLogin) {
        console.log("Attempting login with:", { email });
        const response = await api.post("/auth/login", { email, password });
        console.log("Login response:", response.data);
        if (response.data.success) {
          toast.success("Welcome back!", {
            description: "You have successfully logged in.",
          });
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/");
        }
      } else {
        // Signup validation
        if (!agreedToTerms) {
          toast.error("Terms & Privacy", {
            description:
              "You must agree to the Privacy Policy and Terms of Service to create an account.",
          });
          setIsLoading(false);
          return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
          toast.error("Invalid Password", { description: passwordError });
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setIsLoading(false);
          return;
        }

        // Signup - only send email, password, name (backend doesn't expect phone)
        console.log("Attempting signup with:", { email, name });
        const response = await api.post("/auth/signup", {
          email,
          password,
          name,
        });
        console.log("Signup response:", response.data);

        if (response.data.success) {
          toast.success("Account created!", {
            description: "Your account has been created successfully.",
          });

          // Auto login after signup
          try {
            const loginResponse = await api.post("/auth/login", {
              email,
              password,
            });
            if (loginResponse.data.success) {
              localStorage.setItem(
                "user",
                JSON.stringify(loginResponse.data.user)
              );
              navigate("/");
            }
          } catch (loginError) {
            // If auto-login fails, switch to login view
            setIsLogin(true);
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Authentication failed", {
        description:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <PrivacyPolicyDialog
        open={privacyDialogOpen}
        onOpenChange={setPrivacyDialogOpen}
      />

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-medical items-center justify-center p-12">
        <div className="text-center text-primary-foreground">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Scan className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">ScanMed</h1>
          <p className="text-lg opacity-90 max-w-md">
            Your AI-powered health companion. Scan, analyze, and track your
            health with confidence.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-xl gradient-medical flex items-center justify-center mx-auto mb-4">
              <Scan className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ScanMed</h1>
          </div>

          <div className="medical-card">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Fill in your details to get started"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
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
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {!isLogin && (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) =>
                      setAgreedToTerms(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setPrivacyDialogOpen(true)}
                      className="text-primary hover:underline hover:text-primary/90"
                    >
                      Privacy Policy & Terms
                    </button>
                  </label>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-medium hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
