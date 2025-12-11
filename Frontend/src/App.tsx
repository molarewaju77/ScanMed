import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Index from "./pages/Index";
import Scan from "./pages/Scan";
import Chat from "./pages/Chat";
import History from "./pages/History";
import MedBuddy from "./pages/MedBuddy";
import HealthBlog from "./pages/HealthBlog";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

import { ThemeProvider } from "./components/theme-provider";
import useFcm from "./hooks/use-fcm";

const queryClient = new QueryClient();

// Protected Route Component (Simplified)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const location = useLocation();
  const user = localStorage.getItem("user");

  if (!user && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Auth Route Component (Simplified)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const user = localStorage.getItem("user");

  if (user || isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// NOTE: All Admin, SuperAdmin, and Doctor Route Guards have been REMOVED for this minimal commit.

const AppContent = () => {
  useFcm(); // Initialize FCM hook

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Removed adminStorageKey as Admin routes are not present */}
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Routes>
            {/* Minimal Auth Routes */}
            <Route
              path="/auth"
              element={
                <AuthRoute>
                  <Auth />
                </AuthRoute>
              }
            />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Minimal Protected User Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <Scan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/med-buddy"
              element={
                <ProtectedRoute>
                  <MedBuddy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/health-blog"
              element={
                <ProtectedRoute>
                  <HealthBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
