import { useState, useEffect } from "react";
import { Calendar, Users, Clock, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

export default function DoctorDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get("/doctor/dashboard");
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            toast.error("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">Loading...</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
                <p className="text-muted-foreground mb-6">{stats?.hospital}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-white">
                        <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-8 h-8 text-blue-600" />
                            <span className="text-3xl font-bold text-blue-600">{stats?.todayAppointments || 0}</span>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">Today's Appointments</h3>
                    </div>

                    <div className="border rounded-lg p-6 bg-gradient-to-br from-orange-50 to-white">
                        <div className="flex items-center justify-between mb-2">
                            <Clock className="w-8 h-8 text-orange-600" />
                            <span className="text-3xl font-bold text-orange-600">{stats?.pendingAppointments || 0}</span>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">Pending Consultations</h3>
                    </div>

                    <div className="border rounded-lg p-6 bg-gradient-to-br from-green-50 to-white">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-8 h-8 text-green-600" />
                            <span className="text-3xl font-bold text-green-600">{stats?.totalAppointments || 0}</span>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">Total Appointments</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/hospitals/appointments">
                        <div className="border rounded-lg p-6 hover:bg-accent/50 transition-colors cursor-pointer">
                            <Activity className="w-8 h-8 text-primary mb-3" />
                            <h3 className="text-lg font-semibold mb-1">View Appointments</h3>
                            <p className="text-sm text-muted-foreground">Manage your patient appointments and consultations</p>
                        </div>
                    </Link>

                    <div className="border rounded-lg p-6 bg-muted/30">
                        <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                                View Today's Schedule
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                Recent Patient Scans
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
