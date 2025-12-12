import { Plus, Pill, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  });

  // New State for Detailed Scheduling
  const [timesPerDay, setTimesPerDay] = useState("1");
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["09:00"]);
  const [durationValue, setDurationValue] = useState("7");
  const [durationUnit, setDurationUnit] = useState("Days");

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
      if (!newMed.name || !newMed.dosage) {
        toast.error("Please fill in name and dosage");
        return;
      }

      // 1. Calculate End Date
      const startDate = new Date();
      const endDate = new Date(startDate);
      const duration = parseInt(durationValue);

      if (durationUnit === "Days") endDate.setDate(startDate.getDate() + duration);
      if (durationUnit === "Weeks") endDate.setDate(startDate.getDate() + (duration * 7));
      if (durationUnit === "Months") endDate.setMonth(startDate.getMonth() + duration);

      // 2. Format Frequency Text
      const frequencyText = `Daily (${timesPerDay}x)`;

      // 3. Prepare Payload
      const validTimes = selectedTimes.filter(t => t !== "");

      await api.post("/medications", {
        name: newMed.name,
        dosage: newMed.dosage,
        frequency: frequencyText,
        startDate: startDate,
        endDate: endDate,
        reminderTimes: validTimes,
        reminderEnabled: true,
      });

      toast.success("Medication schedule created");
      setIsAddOpen(false);
      // Reset form
      setNewMed({ name: "", dosage: "", frequency: "" });
      setTimesPerDay("1");
      setSelectedTimes(["09:00"]);
      setDurationValue("7");
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
      const newStatus = currentStatus === "Taken" ? "Skipped" : "Taken";
      await api.post(`/medications/${id}/log`, {
        status: newStatus,
        date: new Date()
      });
      toast.success(`Medication marked as ${newStatus}`);

      // Refresh to get any other updates if needed, though optimistic is fine
      // fetchMedications(); 
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
              {/* Frequency Section */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Frequency</Label>
                <div className="col-span-3">
                  <Select
                    value={timesPerDay}
                    onValueChange={(val) => {
                      setTimesPerDay(val);
                      // Adjust selectedTimes array size
                      const count = parseInt(val);
                      const newTimes = Array(count).fill("09:00");
                      // Preserve existing values if possible
                      selectedTimes.forEach((t, i) => {
                        if (i < count) newTimes[i] = t;
                      });
                      setSelectedTimes(newTimes);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Times per day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Once a day</SelectItem>
                      <SelectItem value="2">Twice a day</SelectItem>
                      <SelectItem value="3">3 times a day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dynamic Time Inputs */}
              {timesPerDay === "1" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Timing</Label>
                  <div className="col-span-3">
                    <Select
                      onValueChange={(val) => {
                        setSelectedTimes([val]);
                      }}
                      defaultValue="08:00"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">Morning (8:00 AM)</SelectItem>
                        <SelectItem value="14:00">Afternoon (2:00 PM)</SelectItem>
                        <SelectItem value="20:00">Night (8:00 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {selectedTimes.map((time, index) => (
                <div key={index} className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    {timesPerDay === "1" ? "Exact Time" :
                      index === 0 ? "Morning" :
                        index === 1 && timesPerDay === "2" ? "Night" :
                          index === 1 ? "Afternoon" :
                            index === 2 ? "Night" : `Time ${index + 1}`}
                  </Label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      const newTimes = [...selectedTimes];
                      newTimes[index] = e.target.value;
                      setSelectedTimes(newTimes);
                    }}
                    className="col-span-3"
                  />
                </div>
              ))}

              {/* Duration Section */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Duration</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={durationValue}
                    onChange={(e) => setDurationValue(e.target.value)}
                    className="w-20"
                  />
                  <Select value={durationUnit} onValueChange={setDurationUnit}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Days">Days</SelectItem>
                      <SelectItem value="Weeks">Weeks</SelectItem>
                      <SelectItem value="Months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
