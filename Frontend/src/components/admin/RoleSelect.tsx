import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface RoleSelectProps {
    userId: string;
    currentRole: string;
    currentUserRole: string;
    onRoleUpdate: (newRole: string) => void;
}

export const RoleSelect = ({ userId, currentRole, currentUserRole, onRoleUpdate }: RoleSelectProps) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("");

    // Determine if user can edit this role
    const canEdit = () => {
        if (currentUserRole === "superadmin") return true;
        if (currentUserRole === "admin") {
            // Admin cannot edit other admins or superadmins
            return !["admin", "superadmin"].includes(currentRole);
        }
        if (currentUserRole === "manager") {
            // Manager can only edit users and workers
            return ["user", "worker"].includes(currentRole);
        }
        return false;
    };

    // Get available options based on permission
    const getOptions = () => {
        const allRoles = ["user", "worker", "manager", "admin", "superadmin"];

        if (currentUserRole === "superadmin") return allRoles;
        if (currentUserRole === "admin") return ["user", "worker", "manager"];
        if (currentUserRole === "manager") return ["user", "worker"];

        return [];
    };

    const handleValueChange = (value: string) => {
        setSelectedRole(value);
        setOpen(true);
    };

    const confirmUpdate = async () => {
        setLoading(true);
        try {
            const response = await api.put(`/admin/users/${userId}/role`, { role: selectedRole });
            if (response.data.success) {
                toast.success("Role updated successfully");
                onRoleUpdate(selectedRole);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update role");
            // Reset selection on error
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "superadmin": return "bg-purple-500 hover:bg-purple-600";
            case "admin": return "bg-red-500 hover:bg-red-600";
            case "manager": return "bg-orange-500 hover:bg-orange-600";
            case "worker": return "bg-blue-500 hover:bg-blue-600";
            default: return "bg-gray-500 hover:bg-gray-600";
        }
    };

    if (!canEdit()) {
        return (
            <Badge className={`${getRoleBadgeColor(currentRole)} text-white`}>
                {currentRole}
            </Badge>
        );
    }

    return (
        <>
            <Select defaultValue={currentRole} onValueChange={handleValueChange} disabled={loading}>
                <SelectTrigger className={`w-[130px] h-8 ${getRoleBadgeColor(currentRole)} text-white border-0`}>
                    <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                    {getOptions().map((role) => (
                        <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change User Role?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change this user's role from <strong>{currentRole}</strong> to <strong>{selectedRole}</strong>?
                            This will update their permissions immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmUpdate} disabled={loading} className="bg-primary">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Confirm Change
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
