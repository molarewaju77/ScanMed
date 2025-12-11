import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Appointment {
  _id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location?: string;
  status: string;
}

export function AppointmentsCard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({
    doctorName: "",
    specialty: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments");
      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // toast.error("Failed to load appointments"); // Suppress initial load error if empty
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async () => {
    try {
      if (!newAppt.doctorName || !newAppt.date || !newAppt.time) {
        toast.error("Please fill in required fields");
        return;
      }

      await api.post("/appointments", newAppt);
      toast.success("Appointment scheduled");
      setIsAddOpen(false);
      setNewAppt({ doctorName: "", specialty: "", date: "", time: "", notes: "" });
      fetchAppointments();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to schedule appointment");
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Appointment cancelled");
      setAppointments(appointments.filter(a => a._id !== id));
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  return (
    <div className="medical-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Upcoming Appointments</h2>
          <p className="text-sm text-muted-foreground">Your scheduled visits</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Book New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Appointment</DialogTitle>
              <DialogDescription>Add details for your upcoming doctor's visit.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doctor" className="text-right">Doctor</Label>
                <Input
                  id="doctor"
                  value={newAppt.doctorName}
                  onChange={(e) => setNewAppt({ ...newAppt, doctorName: e.target.value })}
                  className="col-span-3"
                  placeholder="Dr. Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialty" className="text-right">Specialty</Label>
                <Input
                  id="specialty"
                  value={newAppt.specialty}
                  onChange={(e) => setNewAppt({ ...newAppt, specialty: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g. Cardiologist"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newAppt.date}
                  onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newAppt.time}
                  onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAppointment}>Save Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground text-center">Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No upcoming appointments.</p>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt._id}
              className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {apt.doctorName.split(" ")[1]?.charAt(0) || "D"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{apt.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-foreground">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(apt.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {apt.time}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDeleteAppointment(apt._id)}
                  title="Cancel Appointment"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
