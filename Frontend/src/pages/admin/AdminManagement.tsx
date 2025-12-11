import { useState, useEffect } from "react";
import { Plus, UserX, UserCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AdminManagement() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await api.get("/admin-management/admins");
            if (response.data.success) {
                setAdmins(response.data.admins);
            }
        } catch (error) {
            toast.error("Failed to fetch admins");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/admin-management/admins/create", formData);
            toast.success("Admin created successfully");
            setIsDialogOpen(false);
            setFormData({ name: "", email: "", password: "" });
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create admin");
        }
    };

    const handleBlock = async (adminId) => {
        if (!confirm("Are you sure you want to block this admin?")) return;

        try {
            await api.put(`/admin-management/admins/${adminId}/block`);
            toast.success("Admin blocked successfully");
            fetchAdmins();
        } catch (error) {
            toast.error("Failed to block admin");
        }
    };

    const handleUnblock = async (adminId) => {
        try {
            await api.put(`/admin-management/admins/${adminId}/unblock`);
            toast.success("Admin unblocked successfully");
            fetchAdmins();
        } catch (error) {
            toast.error("Failed to unblock admin");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Shield className="w-8 h-8 text-yellow-500" />
                        Admin Management
                    </h1>
                    <p className="text-muted-foreground">SuperAdmin only - Manage admin accounts</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setFormData({ name: "", email: "", password: "" })}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Admin</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Full Name *</Label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <Label>Email *</Label>
                                <Input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@scanmed.com"
                                />
                            </div>
                            <div>
                                <Label>Password *</Label>
                                <Input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Minimum 6 characters"
                                />
                            </div>
                            <div className="flex gap-4">
                                <Button type="submit" className="flex-1">Create Admin</Button>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : admins.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No admins found</div>
            ) : (
                <div className="grid gap-4">
                    {admins.map((admin) => (
                        <div key={admin._id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold">{admin.name}</h3>
                                        <Badge className="bg-blue-500">Admin</Badge>
                                        {admin.isBlocked && (
                                            <Badge variant="destructive">Blocked</Badge>
                                        )}
                                        {admin.isVerified && (
                                            <Badge className="bg-green-500">Verified</Badge>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-1">
                                        ✉️ {admin.email}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        📅 Joined: {new Date(admin.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {admin.isBlocked ? (
                                        <Button size="sm" variant="outline" onClick={() => handleUnblock(admin._id)}>
                                            <UserCheck className="w-4 h-4 mr-1" />
                                            Unblock
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="destructive" onClick={() => handleBlock(admin._id)}>
                                            <UserX className="w-4 h-4 mr-1" />
                                            Block
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
