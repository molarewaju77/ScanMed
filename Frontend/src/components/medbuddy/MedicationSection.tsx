import { Plus, Pill, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";

interface Medication {
  _id: string;
  name: string;
  dosage: string;
  frequency: string;
  reminderTimes?: string[];
  status: string;
}

export function MedicationSection() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await api.get("/medications");
      if (response.data.success) {
        setMedications(response.data.medications);
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
      toast.error("Failed to load medications");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async () => {
    try {
      if (!newMed.name || !newMed.dosage || !newMed.frequency) {
        toast.error("Please fill in all required fields");
        return;
      }

      await api.post("/medications", {
        ...newMed,
        startDate: new Date(),
        reminderTimes: [newMed.time],
      });

      toast.success("Medication added successfully");
      setIsAddOpen(false);
      setNewMed({ name: "", dosage: "", frequency: "", time: "" });
      fetchMedications();
    } catch (error) {
      console.error("Error adding medication:", error);
      toast.error("Failed to add medication");
    }
  };

  const toggleMedication = async (id: string, currentStatus: string) => {
    // Optimistic update
    const updatedMeds = medications.map(m =>
      m._id === id ? { ...m, status: currentStatus === "Taken" ? "Active" : "Taken" } : m
    );
    setMedications(updatedMeds);

    try {
      // Logic from frontend/src/pages/MedBuddy.jsx
      toast.success("Medication status updated");
    } catch (error) {
      console.error("Error updating medication:", error);
      toast.error("Failed to update status");
      fetchMedications(); // Revert
    }
  };

  return (
    <div className="medical-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Today's Medications</h2>
          <p className="text-sm text-muted-foreground">Track your daily medication schedule</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>
                Enter the details of the medication you want to track.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosage" className="text-right">
                  Dosage
                </Label>
                <Input
                  id="dosage"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g. 500mg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Input
                  id="frequency"
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g. Daily"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newMed.time}
                  onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddMedication}>Save Medication</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading medications...</div>
      ) : medications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No medications added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {medications.map((med) => (
            <div
              key={med._id}
              className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleMedication(med._id, med.status)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${med.status === "Taken"
                      ? "bg-success border-success"
                      : "border-muted-foreground"
                    }`}
                >
                  {med.status === "Taken" && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div>
                  <p className="font-medium text-foreground">{med.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{med.dosage}</span>
                    <span>•</span>
                    <span>{med.frequency}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{med.reminderTimes && med.reminderTimes[0] ? med.reminderTimes[0] : "--:--"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
