import { useState, useEffect } from "react";
import { UserCheck, UserX, Trash2, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";

export default function DoctorManagement() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get("/admin-management/doctors");
            if (response.data.success) {
                setDoctors(response.data.doctors);
            }
        } catch (error) {
            toast.error("Failed to fetch doctors");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (doctorId) => {
        try {
            await api.put(`/admin-management/doctors/${doctorId}/verify`);
            toast.success("Doctor verified successfully");
            fetchDoctors();
        } catch (error) {
            toast.error("Failed to verify doctor");
        }
    };

    const handleBlock = async (doctorId) => {
        if (!confirm("Are you sure you want to block this doctor?")) return;

        try {
            await api.put(`/admin-management/doctors/${doctorId}/block`);
            toast.success("Doctor blocked successfully");
            fetchDoctors();
        } catch (error) {
            toast.error("Failed to block doctor");
        }
    };

    const handleUnblock = async (doctorId) => {
        try {
            await api.put(`/admin-management/doctors/${doctorId}/unblock`);
            toast.success("Doctor unblocked successfully");
            fetchDoctors();
        } catch (error) {
            toast.error("Failed to unblock doctor");
        }
    };

    const handleDelete = async (doctorId) => {
        if (!confirm("Are you sure you want to delete this doctor? This action cannot be undone.")) return;

        try {
            await api.delete(`/admin-management/doctors/${doctorId}`);
            toast.success("Doctor deleted successfully");
            fetchDoctors();
        } catch (error) {
            toast.error("Failed to delete doctor");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Doctor Management</h1>
                <p className="text-muted-foreground">Manage doctor accounts and permissions</p>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : doctors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No doctors registered yet</div>
            ) : (
                <div className="grid gap-4">
                    {doctors.map((doctor) => (
                        <div key={doctor._id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold">{doctor.userId?.name || "N/A"}</h3>
                                        {doctor.verified ? (
                                            <Badge className="bg-green-500">Verified</Badge>
                                        ) : (
                                            <Badge variant="secondary">Unverified</Badge>
                                        )}
                                        {doctor.userId?.isBlocked && (
                                            <Badge variant="destructive">Blocked</Badge>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-1">
                                        ✉️ {doctor.userId?.email || "N/A"}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        🏥 {doctor.hospitalId?.name || "No Hospital Assigned"}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        🩺 Specialization: {doctor.specialization}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        📋 License: {doctor.licenseNumber}
                                    </p>
                                    {doctor.yearsOfExperience > 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            ⏱️ Experience: {doctor.yearsOfExperience} years
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 flex-wrap justify-end">
                                    {!doctor.verified && (
                                        <Button size="sm" onClick={() => handleVerify(doctor._id)}>
                                            <Shield className="w-4 h-4 mr-1" />
                                            Verify
                                        </Button>
                                    )}

                                    {doctor.userId?.isBlocked ? (
                                        <Button size="sm" variant="outline" onClick={() => handleUnblock(doctor._id)}>
                                            <UserCheck className="w-4 h-4 mr-1" />
                                            Unblock
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="destructive" onClick={() => handleBlock(doctor._id)}>
                                            <UserX className="w-4 h-4 mr-1" />
                                            Block
                                        </Button>
                                    )}

                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(doctor._id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {!doctor.verified && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>This doctor is awaiting verification</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
