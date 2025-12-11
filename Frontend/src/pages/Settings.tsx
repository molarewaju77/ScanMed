import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, Palette, Shield, Database, AlertTriangle, Loader2, Cpu, RefreshCw, Users, Save } from "lucide-react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

import { useTheme } from "@/components/theme-provider";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme, adminTheme, setAdminTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState("user");

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      medicationReminders: true,
      healthTips: true,
      scanReminders: false,
    },
    privacy: {
      shareData: false, // mapped from shareAnonymousData
      analytics: true,
      crashReports: true,
    },
    appearance: {
      theme: "system",
      language: "en",
    },
  });

  // Password change dialog
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete account dialog
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSettings();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserRole(parsedUser.role || "user");
      } catch (e) {
        console.error("Error parsing user role", e);
      }
    }
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get("/settings");
      if (response.data.success) {
        // Merge with default structure to ensure all fields exist
        setSettings(prev => ({
          ...prev,
          ...response.data.settings,
          notifications: { ...prev.notifications, ...response.data.settings?.notifications },
          privacy: { ...prev.privacy, ...response.data.settings?.privacy },
          appearance: { ...prev.appearance, ...response.data.settings?.appearance }
        }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      // toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (category: keyof typeof settings, key: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: !settings[category][key as keyof typeof settings[typeof category]],
      },
    });
  };

  const handleSelect = (category: keyof typeof settings, key: string, value: string) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    setSettings(newSettings);

    // Apply theme immediately when changed
    if (category === "appearance" && key === "theme") {
      setTheme(value as "light" | "dark" | "system");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put("/settings", { settings });
      if (response.data.success) {
        toast.success("Settings saved successfully");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    try {
      const response = await api.post("/settings/clear-cache");
      if (response.data.success) {
        toast.success("Cache cleared successfully");
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast.error("Failed to clear cache");
    }
  };

  const handleExportData = async () => {
    try {
      toast.info("Preparing your data export...");
      const response = await api.get("/settings/export-data");

      if (response.data.success) {
        const dataStr = JSON.stringify(response.data.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `scanmed-data-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("Data exported successfully");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await api.post("/settings/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        toast.success("Password changed successfully");
        setPasswordDialog(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password");
      return;
    }

    setDeleting(true);
    try {
      const response = await api.delete("/settings/delete-account", {
        data: { password: deletePassword },
      });

      if (response.data.success) {
        toast.success("Account deleted successfully");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  const isAdmin = ['superadmin', 'admin'].includes(userRole);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Notifications */}
        <div className="medical-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-accent">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure how you receive notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif" className="font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notif"
                checked={settings.notifications.email}
                onCheckedChange={() => handleToggle("notifications", "email")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notif" className="font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
              </div>
              <Switch
                id="push-notif"
                checked={settings.notifications.push}
                onCheckedChange={() => handleToggle("notifications", "push")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="med-reminders" className="font-medium">Medication Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded to take your medications</p>
              </div>
              <Switch
                id="med-reminders"
                checked={settings.notifications.medicationReminders}
                onCheckedChange={() => handleToggle("notifications", "medicationReminders")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="health-tips" className="font-medium">Health Tips</Label>
                <p className="text-sm text-muted-foreground">Receive daily health tips and advice</p>
              </div>
              <Switch
                id="health-tips"
                checked={settings.notifications.healthTips}
                onCheckedChange={() => handleToggle("notifications", "healthTips")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="scan-reminders" className="font-medium">Scan Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders for regular health scans</p>
              </div>
              <Switch
                id="scan-reminders"
                checked={settings.notifications.scanReminders}
                onCheckedChange={() => handleToggle("notifications", "scanReminders")}
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="medical-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-accent">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
              <p className="text-sm text-muted-foreground">Customize how the app looks</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="font-medium">Theme</Label>
              <Select value={settings.appearance.theme} onValueChange={(val) => handleSelect("appearance", "theme", val)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="language" className="font-medium">Language</Label>
              <Select value={settings.appearance.language} onValueChange={(val) => handleSelect("appearance", "language", val)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="yo">Yoruba</SelectItem>
                  <SelectItem value="ig">Igbo</SelectItem>
                  <SelectItem value="ha">Hausa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="medical-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-accent">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Privacy & Security</h2>
              <p className="text-sm text-muted-foreground">Manage your privacy and security settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="anonymous-data" className="font-medium">Share Anonymous Data</Label>
                <p className="text-sm text-muted-foreground">Help improve our services with anonymous usage data</p>
              </div>
              <Switch
                id="anonymous-data"
                checked={settings.privacy.shareData}
                onCheckedChange={() => handleToggle("privacy", "shareData")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics" className="font-medium">Analytics</Label>
                <p className="text-sm text-muted-foreground">Allow us to collect analytics data</p>
              </div>
              <Switch
                id="analytics"
                checked={settings.privacy.analytics}
                onCheckedChange={() => handleToggle("privacy", "analytics")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="crash-reports" className="font-medium">Crash Reports</Label>
                <p className="text-sm text-muted-foreground">Send crash reports to help us fix bugs</p>
              </div>
              <Switch
                id="crash-reports"
                checked={settings.privacy.crashReports}
                onCheckedChange={() => handleToggle("privacy", "crashReports")}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="font-medium">Account Security</Label>
                <p className="text-sm text-muted-foreground">Update your password</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPasswordDialog(true)}>Change Password</Button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="medical-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-accent">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Data Management</h2>
              <p className="text-sm text-muted-foreground">Manage your data and storage</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Export Data</Label>
                <p className="text-sm text-muted-foreground">Download all your health data</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData}>Download Data</Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Clear Cache</Label>
                <p className="text-sm text-muted-foreground">Clear cached data to free up space</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearCache}>Clear Cache</Button>
            </div>
          </div>
        </div>

        {/* ADMIN SETTINGS SECTION (Conditionally Rendered) */}
        {isAdmin && (
          <>
            <div className="border-t border-border pt-6 mt-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Admin Settings
              </h3>
            </div>

            {/* System Configuration */}
            <div className="medical-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">System Configuration</h2>
                  <p className="text-sm text-muted-foreground">General platform settings</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Admin Panel Theme</p>
                    <p className="text-sm text-muted-foreground">Customize the look of the admin area</p>
                  </div>
                  <Select value={adminTheme} onValueChange={(val) => setAdminTheme(val as "light" | "dark" | "system")}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Disable user access during updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-card after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">New User Registration</p>
                    <p className="text-sm text-muted-foreground">Allow new users to sign up</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-card after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Send system notifications to admins</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-card after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Scan Engine */}
            <div className="medical-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Scan Engine</h2>
                  <p className="text-sm text-muted-foreground">Manage AI scan engine versions</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Current Version</span>
                    <span className="text-sm px-2 py-1 bg-medical-green-light text-success rounded-full">
                      v2.4.1 (Stable)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last updated: November 25, 2024
                  </p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Available Update</span>
                    <span className="text-sm px-2 py-1 bg-accent text-accent-foreground rounded-full">
                      v2.5.0 (Beta)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Includes improved eye scan accuracy and faster processing
                  </p>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Update to Beta
                  </Button>
                </div>
              </div>
            </div>

            {/* Admin Accounts */}
            <div className="medical-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Admin Account Management</h2>
                  <p className="text-sm text-muted-foreground">Manage administrator access</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      AD
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Admin User</p>
                      <p className="text-xs text-muted-foreground">admin@scanmed.com</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    Super Admin
                  </span>
                </div>

                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Add New Admin
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Danger Zone */}
        <div className="medical-card border-destructive/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium text-destructive">Delete Account</Label>
              <p className="text-sm text-muted-foreground">This action cannot be undone</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setDeleteDialog(true)}>Delete Account</Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadSettings}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-medical text-primary-foreground">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Enter your password to confirm</Label>
              <Input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Settings;
