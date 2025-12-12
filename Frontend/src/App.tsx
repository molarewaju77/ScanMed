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
import PrivacyPolicy from "./pages/privacypages/PrivacyPolicy";
import TermsOfService from "./pages/privacypages/TermsOfService";
import CookiePolicy from "./pages/privacypages/CookiePolicy";
import MedicalDisclaimer from "./pages/privacypages/MedicalDisclaimer";
import UserGuide from "./pages/privacypages/UserGuide";
import DataBylaws from "./pages/privacypages/DataBylaws";
import Compliance from "./pages/privacypages/Compliance";
import HelpCenter from "./pages/privacypages/HelpCenter";
import ContactUs from "./pages/privacypages/ContactUs";
import ReportBug from "./pages/privacypages/ReportBug";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminChats from "./pages/admin/AdminChats";

import AdminBlogs from "./pages/admin/AdminBlogs";
import CreateBlog from "./pages/admin/CreateBlog";
import HospitalManagement from "./pages/admin/HospitalManagement";
import DoctorManagement from "./pages/admin/DoctorManagement";
import AdminManagement from "./pages/admin/AdminManagement";
import DoctorDashboard from "./pages/hospitals/DoctorDashboard";
import DoctorAppointments from "./pages/hospitals/DoctorAppointments";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import useFcm from "./hooks/use-fcm";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const location = useLocation();
  const user = localStorage.getItem("user");

  if (!user && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Auth Route Component
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const user = localStorage.getItem("user");

  if (user || isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Admin Route Component (Admin + SuperAdmin)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userStr = localStorage.getItem("user");
  const location = useLocation();

  if (!userStr && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(userStr || "{}");
    const allowedRoles = ["superadmin", "admin", "manager"];

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// SuperAdmin Route Component (SuperAdmin only)
const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userStr = localStorage.getItem("user");
  const location = useLocation();

  if (!userStr && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(userStr || "{}");

    if (user.role !== "superadmin") {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Doctor Route Component (Doctor only)
const DoctorRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userStr = localStorage.getItem("user");
  const location = useLocation();

  if (!userStr && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(userStr || "{}");

    if (user.role !== "doctor") {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  useFcm(); // Initialize FCM hook

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider
          defaultTheme="system"
          storageKey="vite-ui-theme"
          adminStorageKey="vite-admin-theme"
        >
          <Routes>
            {/* Auth Routes */}
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
            <Route path="/legal/privacy" element={<PrivacyPolicy />} />
            <Route path="/legal/terms" element={<TermsOfService />} />
            <Route path="/legal/cookies" element={<CookiePolicy />} />
            <Route
              path="/legal/medical-disclaimer"
              element={<MedicalDisclaimer />}
            />

            <Route path="/docs/user-guide" element={<UserGuide />} />
            <Route path="/docs/data-bylaws" element={<DataBylaws />} />
            <Route path="/docs/compliance" element={<Compliance />} />

            <Route path="/support/help" element={<HelpCenter />} />
            <Route path="/support/contact" element={<ContactUs />} />
            <Route path="/support/bug-report" element={<ReportBug />} />

            {/* Protected User Routes */}
            <Route
              path="/"
              element={
                // <ProtectedRoute>
                <Index />
                // </ProtectedRoute>
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

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/chats"
              element={
                <AdminRoute>
                  <AdminChats />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/blogs"
              element={
                <AdminRoute>
                  <AdminBlogs />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/blogs/new"
              element={
                <AdminRoute>
                  <CreateBlog />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/blogs/edit/:id"
              element={
                <AdminRoute>
                  <CreateBlog />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/hospitals"
              element={
                <AdminRoute>
                  <HospitalManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <AdminRoute>
                  <DoctorManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/admins"
              element={
                <SuperAdminRoute>
                  <AdminManagement />
                </SuperAdminRoute>
              }
            />

            {/* Doctor Portal Routes */}
            <Route
              path="/hospitals/dashboard"
              element={
                <DoctorRoute>
                  <DoctorDashboard />
                </DoctorRoute>
              }
            />
            <Route
              path="/hospitals/appointments"
              element={
                <DoctorRoute>
                  <DoctorAppointments />
                </DoctorRoute>
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
