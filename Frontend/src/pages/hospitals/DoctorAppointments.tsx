import { useState, useEffect } from "react";
import { Eye, FileText, CheckCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { toast } from "sonner";

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [patientScans, setPatientScans] = useState([]);
    const [consultationNotes, setConsultationNotes] = useState("");
    const [showScanDialog, setShowScanDialog] = useState(false);
    const [showNotesDialog, setShowNotesDialog] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get("/doctor/appointments");
            if (response.data.success) {
                setAppointments(response.data.appointments);
            }
        } catch (error) {
            toast.error("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    const viewPatientScans = async (appointment) => {
        try {
            const response = await api.get(`/doctor/appointments/${appointment._id}/scan`);
            if (response.data.success) {
                setPatientScans(response.data.scans);
                setSelectedAppointment(appointment);
                setShowScanDialog(true);
            }
        } catch (error) {
            toast.error("Failed to load patient scans");
        }
    };

    const markComplete = async (appointmentId) => {
        try {
            await api.put(`/doctor/appointments/${appointmentId}/status`, { status: "completed" });
            toast.success("Appointment marked as complete");
            fetchAppointments();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const saveNotes = async () => {
        if (!consultationNotes.trim()) return;

        try {
            await api.put(`/doctor/appointments/${selectedAppointment._id}/notes`, { notes: consultationNotes });
            toast.success("Notes saved successfully");
            setShowNotesDialog(false);
            setConsultationNotes("");
            fetchAppointments();
        } catch (error) {
            toast.error("Failed to save notes");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-500";
            case "confirmed": return "bg-blue-500";
            case "completed": return "bg-green-500";
            case "cancelled": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No appointments yet</div>
                ) : (
                    <div className="grid gap-4">
                        {appointments.map((appointment) => (
                            <div key={appointment._id} className="border rounded-lg p-4 hover:bg-accent/30 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg">{appointment.userId?.name || "Unknown Patient"}</h3>
                                        <p className="text-sm text-muted-foreground">{appointment.userId?.email}</p>
                                        <p className="text-sm mt-1">
                                            📅 {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                                    </div>
                                    <Badge className={getStatusColor(appointment.status)}>
                                        {appointment.status}
                                    </Badge>
                                </div>

                                {appointment.notes && (
                                    <div className="bg-muted/50 rounded p-2 mb-3 text-sm">
                                        <strong>Notes:</strong> {appointment.notes}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => viewPatientScans(appointment)}>
                                        <Eye className="w-4 h-4 mr-1" />
                                        View Scans
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => {
                                        setSelectedAppointment(appointment);
                                        setShowNotesDialog(true);
                                    }}>
                                        <FileText className="w-4 h-4 mr-1" />
                                        Add Notes
                                    </Button>
                                    {appointment.status !== "completed" && (
                                        <Button size="sm" onClick={() => markComplete(appointment._id)}>
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Mark Complete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Patient Scans Dialog */}
                <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Patient Scans - {selectedAppointment?.userId?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {patientScans.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No scans available for this patient</p>
                            ) : (
                                patientScans.map((scan) => (
                                    <div key={scan._id} className="border rounded p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <Badge>{scan.scanType}</Badge>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {new Date(scan.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <Badge variant={scan.result === "Healthy" ? "default" : "destructive"}>
                                                {scan.result}
                                            </Badge>
                                        </div>
                                        <p className="text-sm"><strong>Confidence:</strong> {scan.confidence}%</p>
                                        <p className="text-sm mt-2">{scan.notes}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Consultation Notes Dialog */}
                <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Consultation Notes</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Enter your consultation notes here..."
                                value={consultationNotes}
                                onChange={(e) => setConsultationNotes(e.target.value)}
                                rows={6}
                            />
                            <div className="flex gap-2">
                                <Button onClick={saveNotes} className="flex-1">Save Notes</Button>
                                <Button variant="outline" onClick={() => setShowNotesDialog(false)}>Cancel</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
