import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/check-auth");
      if (response.data.success) {
        const user = response.data.user;
        setProfile({
          name: user.name || "",
          username: user.username || user.email?.split("@")[0] || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
          bio: user.bio || "",
          address: user.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.put("/users/profile", {
        name: profile.name,
        phoneNumber: profile.phone,
        address: profile.address,
        bio: profile.bio,
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        // Update local storage if needed
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, ...response.data.user })
          );
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information
          </p>
        </div>

        <div className="medical-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Profile Settings
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full gradient-medical flex items-center justify-center text-primary-foreground font-bold text-2xl">
              {profile.name
                ? profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "U"}
            </div>
            <div>
              <p className="font-medium text-foreground">
                {profile.name || "User"}
              </p>
              <p className="text-sm text-muted-foreground">
                @{profile.username || "username"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                  disabled // Username usually not editable or handled differently
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  disabled // Email usually not editable directly here
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={3}
              />
            </div>

            <Button onClick={handleSave} className="w-full md:w-auto">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
