import { useState, useEffect } from "react";
import { MessageCircle, Search, Clock, ChevronRight, Filter, Download, Scan, Pill, Calendar, Eye, BookOpen, Trash2, RefreshCcw, MoreVertical, X, CheckCircle, AlertCircle, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type TabType = "chat" | "scans" | "medbuddy" | "reading";

interface BaseHistoryItem {
  id: string;
  date: string;
  time: string;
  deletedAt?: string | null;
}

interface ChatHistory extends BaseHistoryItem {
  title: string;
  preview: string;
}

interface ScanHistory extends BaseHistoryItem {
  type: string;
  result: string;
  status: string;
  confidence?: number;
  notes?: string;
  recommendations?: string[];
}

interface MedBuddyHistory extends BaseHistoryItem {
  type: 'medication';
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  status: string;
  adherence: number;
}

interface AppointmentHistory extends BaseHistoryItem {
  type: 'appointment';
  doctorName: string;
  specialty: string;
  notes?: string;
  location?: string;
}

interface ReadingHistory extends BaseHistoryItem {
  title: string;
  category: string;
  readTime: string;
}

const History = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [loading, setLoading] = useState(true);
  const [showTrash, setShowTrash] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  // Combined MedBuddy History
  const [medBuddyItems, setMedBuddyItems] = useState<(MedBuddyHistory | AppointmentHistory)[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tabs = [
    { id: "chat" as const, label: "Chat", icon: MessageCircle },
    { id: "scans" as const, label: "Scans", icon: Scan },
    { id: "medbuddy" as const, label: "MedBuddy", icon: Pill },
    { id: "reading" as const, label: "Reading", icon: BookOpen },
  ];

  useEffect(() => {
    fetchData();
  }, [showTrash]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { includeDeleted: showTrash };
      const [scansRes, medsRes, apptsRes, chatsRes, readingRes] = await Promise.all([
        api.get("/health-scans", { params }),
        api.get("/medications", { params }),
        api.get("/appointments", { params }),
        api.get("/chats", { params }),
        api.get("/reading-history", { params })
      ]);

      if (scansRes.data.success) {
        setScanHistory(scansRes.data.scans.map((scan: any) => ({
          id: scan._id,
          type: scan.scanType === 'eyes' ? 'Eye Scan' : scan.scanType === 'teeth' ? 'Dental Scan' : 'Skin Scan',
          date: new Date(scan.createdAt).toLocaleDateString(),
          time: new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          result: scan.result,
          status: scan.status,
          confidence: scan.confidence,
          notes: scan.notes,
          recommendations: scan.recommendations,
          deletedAt: scan.deletedAt
        })));
      }

      // Combine Medications and Appointments for MedBuddy
      let combinedMedBuddy: (MedBuddyHistory | AppointmentHistory)[] = [];

      if (medsRes.data.success) {
        combinedMedBuddy.push(...medsRes.data.medications.map((med: any) => ({
          type: 'medication',
          id: med._id,
          medication: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          startDate: new Date(med.startDate).toLocaleDateString(),
          date: new Date(med.createdAt).toLocaleDateString(), // Use creation for sorting or startDate?
          time: '--',
          status: med.status || "Active",
          adherence: med.adherence || 0,
          deletedAt: med.deletedAt
        })));
      }

      if (apptsRes.data.success) {
        combinedMedBuddy.push(...apptsRes.data.appointments.map((appt: any) => ({
          type: 'appointment',
          id: appt._id,
          doctorName: appt.doctorName,
          specialty: appt.specialty,
          date: new Date(appt.date).toLocaleDateString(),
          time: appt.time,
          location: appt.location || appt.hospitalName,
          notes: appt.notes,
          deletedAt: appt.deletedAt
        })));
      }

      // Sort by date (descending typically for history)
      combinedMedBuddy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMedBuddyItems(combinedMedBuddy);


      if (chatsRes.data.success) {
        setChatHistory(chatsRes.data.chats.map((chat: any) => ({
          id: chat._id,
          title: chat.title,
          preview: chat.preview,
          date: new Date(chat.createdAt).toLocaleDateString(),
          time: new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          deletedAt: chat.deletedAt
        })));
      }

      if (readingRes.data.success) {
        setReadingHistory(readingRes.data.history.map((log: any) => ({
          id: log._id,
          title: log.title,
          category: log.category,
          readTime: log.readTime,
          date: new Date(log.createdAt).toLocaleDateString(),
          time: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          deletedAt: log.deletedAt
        })));
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string, type: string) => { // Type changed to generic string to handle sub-types
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      let endpoint = "";
      switch (type) {
        case "scans": endpoint = `/health-scans/${id}`; break;
        case "medication": endpoint = `/medications/${id}`; break;
        case "appointment": endpoint = `/appointments/${id}`; break;
        case "chat": endpoint = `/chats/${id}`; break;
        case "reading":
          toast.error("Cannot delete reading history yet");
          return;
      }

      await api.delete(endpoint);
      toast.success("Item moved to trash");
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleRestore = async (e: React.MouseEvent, id: string, type: string) => {
    e.stopPropagation();
    try {
      let endpoint = "";
      switch (type) {
        case "scans": endpoint = `/health-scans/${id}/restore`; break;
        case "medication": endpoint = `/medications/${id}/restore`; break;
        case "appointment": endpoint = `/appointments/${id}/restore`; break;
        case "chat": endpoint = `/chats/${id}/restore`; break;
        case "reading": return;
      }

      await api.patch(endpoint);
      toast.success("Item restored");
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error restoring item:", error);
      toast.error("Failed to restore item");
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "success" || status === "Active" || status === "Healthy") return "text-green-500 bg-green-500/10";
    if (status === "moderate" || status === "Concern") return "text-yellow-500 bg-yellow-500/10";
    return "text-destructive bg-destructive/10";
  };

  const openDetails = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">History</h1>
            <p className="text-muted-foreground mt-1">View your past activities</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={showTrash ? "destructive" : "outline"}
              size="sm"
              onClick={() => setShowTrash(!showTrash)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {showTrash ? "View Active" : "View Trash"}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Content */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Loading history...</div>
          ) : (
            <>
              {activeTab === "chat" && chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => openDetails(chat)}
                  className="w-full medical-card-hover text-left flex items-center gap-4 p-4 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{chat.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{chat.preview}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {chat.date} at {chat.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {showTrash ? (
                      <Button size="icon" variant="ghost" onClick={(e) => handleRestore(e, chat.id, "chat")}>
                        <RefreshCcw className="w-4 h-4 text-green-500" />
                      </Button>
                    ) : (
                      <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleDelete(e, chat.id, "chat")}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                </div>
              ))}

              {activeTab === "scans" && scanHistory.map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => openDetails(scan)}
                  className="medical-card-hover flex items-center gap-4 p-4 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{scan.type}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {scan.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <span className={cn("block text-xs px-2 py-0.5 rounded-full capitalize", getStatusColor(scan.result))}>
                        {scan.result}
                      </span>
                      {scan.confidence && <span className="text-xs text-muted-foreground block mt-1">{scan.confidence}% conf.</span>}
                    </div>
                    {showTrash ? (
                      <Button size="icon" variant="ghost" onClick={(e) => handleRestore(e, scan.id, "scans")}>
                        <RefreshCcw className="w-4 h-4 text-green-500" />
                      </Button>
                    ) : (
                      <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleDelete(e, scan.id, "scans")}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {activeTab === "medbuddy" && medBuddyItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openDetails(item)}
                  className="medical-card-hover flex items-center gap-4 p-4 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    {item.type === 'medication' ? (
                      <Pill className="w-5 h-5 text-primary" />
                    ) : (
                      <CalendarDays className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">
                      {item.type === 'medication' ? (item as MedBuddyHistory).medication : `Appt: ${(item as AppointmentHistory).doctorName}`}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {item.type === 'medication'
                          ? `${(item as MedBuddyHistory).dosage} • ${(item as MedBuddyHistory).frequency}`
                          : `${item.time} • ${(item as AppointmentHistory).specialty}`
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {item.type === 'medication' && (
                      <span className={cn(
                        "text-xs px-3 py-1 rounded-full font-medium hidden sm:block",
                        getStatusColor((item as MedBuddyHistory).status)
                      )}>
                        {(item as MedBuddyHistory).status}
                      </span>
                    )}
                    {showTrash ? (
                      <Button size="icon" variant="ghost" onClick={(e) => handleRestore(e, item.id, item.type)}>
                        <RefreshCcw className="w-4 h-4 text-green-500" />
                      </Button>
                    ) : (
                      <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleDelete(e, item.id, item.type)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {activeTab === "reading" && readingHistory.map((log) => (
                <div
                  key={log.id}
                  className="medical-card flex items-center gap-4 p-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{log.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{log.category} • {log.readTime}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">{log.date}</span>
                  </div>
                </div>
              ))}

              {activeTab === "chat" && chatHistory.length === 0 && <div className="text-center py-8 text-muted-foreground">No chat history found</div>}
              {activeTab === "scans" && scanHistory.length === 0 && <div className="text-center py-8 text-muted-foreground">No scan history found</div>}
              {activeTab === "medbuddy" && medBuddyItems.length === 0 && <div className="text-center py-8 text-muted-foreground">No history found</div>}
              {activeTab === "reading" && readingHistory.length === 0 && <div className="text-center py-8 text-muted-foreground">No reading history found</div>}
            </>
          )}
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {activeTab === "chat" && "Chat Details"}
              {activeTab === "scans" && "Scan Results"}
              {/* @ts-ignore */}
              {activeTab === "medbuddy" && (selectedItem?.type === 'appointment' ? "Appointment Details" : "Medication Details")}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.date} at {selectedItem?.time}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {activeTab === "chat" && selectedItem && (
              <div className="space-y-3">
                <h4 className="font-semibold">{selectedItem.title}</h4>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  {selectedItem.preview}
                </div>
                <Button className="w-full" onClick={() => navigate("/chat")}>
                  Open Chat
                </Button>
              </div>
            )}

            {activeTab === "scans" && selectedItem && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Type</span>
                  <span>{selectedItem.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Result</span>
                  <Badge variant={selectedItem.result === 'Healthy' ? "default" : "destructive"}>
                    {selectedItem.result}
                  </Badge>
                </div>
                {selectedItem.confidence && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Confidence</span>
                      <span>{selectedItem.confidence}%</span>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${selectedItem.confidence}%` }} />
                    </div>
                  </div>
                )}
                {selectedItem.notes && (
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <p className="font-medium mb-1">Notes:</p>
                    {selectedItem.notes}
                  </div>
                )}
              </div>
            )}

            {activeTab === "medbuddy" && selectedItem && (
              <div className="space-y-3">
                {/* @ts-ignore */}
                {selectedItem.type === 'medication' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Medication</span>
                      <span>{selectedItem.medication}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Dosage</span>
                      <span>{selectedItem.dosage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Frequency</span>
                      <span>{selectedItem.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Status</span>
                      <Badge variant="outline">{selectedItem.status}</Badge>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Doctor</span>
                      <span>{selectedItem.doctorName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Specialty</span>
                      <span>{selectedItem.specialty}</span>
                    </div>
                    {selectedItem.location && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Location</span>
                        <span>{selectedItem.location}</span>
                      </div>
                    )}
                    {selectedItem.notes && (
                      <div className="bg-muted p-2 rounded text-sm mt-2">
                        <p className="font-semibold text-xs text-muted-foreground">Notes</p>
                        {selectedItem.notes}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default History;
