import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { UsersTable } from "@/components/admin/UsersTable";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDetailsDialog } from "@/components/admin/UserDetailsDialog";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  // Dialog states
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
    getCurrentUserRole();
  }, [selectedRole]); // Re-fetch when filter changes

  const getCurrentUserRole = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserRole(user.role);
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Pass role filter if not 'all'
      const roleQuery = selectedRole !== 'all' ? `?role=${selectedRole}` : '';
      const response = await api.get(`/admin/users${roleQuery}`);

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = (userId: string, newRole: string) => {
    setUsers(users.map((user: any) =>
      user._id === userId ? { ...user, role: newRole } : user
    ));

    // Also update selected user if open in dialog
    if (selectedUser && selectedUser._id === userId) {
      setSelectedUser({ ...selectedUser, role: newRole });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      setUsers(users.filter((user: any) => user._id !== userId));

      if (selectedUser && selectedUser._id === userId) {
        setDetailsOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleViewDetails = (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setDetailsOpen(true);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage user roles and permissions
            </p>
          </div>

          {/* Role Filter Tabs */}
          <Tabs defaultValue="all" value={selectedRole} onValueChange={setSelectedRole} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="manager">Managers</TabsTrigger>
              <TabsTrigger value="worker">Workers</TabsTrigger>
              <TabsTrigger value="user">Users</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <UsersTable
            users={users}
            currentUserRole={currentUserRole}
            onRoleUpdate={handleRoleUpdate}
            onDelete={handleDelete}
            onView={handleViewDetails}
          />
        )}

        <UserDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          user={selectedUser}
        />
      </div>
    </MainLayout>
  );
};

export default AdminUsers;
