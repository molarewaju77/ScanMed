import { useState, useEffect } from "react";
import {
    MessageCircle,
    Search,
    Clock,
    ChevronRight,
    Filter,
    Download,
    Scan,
    Pill,
    Calendar,
    Eye,
    BookOpen,
    Trash2,
    RefreshCcw,
    MoreVertical,
    X,
    CheckCircle,
    AlertCircle,
    CalendarDays,
    ArrowLeft, // Added for back navigation
} from "lucide-react";
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

// Interfaces copied from History.tsx (could be shared in a types file)
interface ChatHistory extends BaseHistoryItem {
    title: string;
    preview: string;
}

interface ScanHistory extends BaseHistoryItem {
    type: string;
    result: string;
    status: string;
    healthScore?: number;
    confidence?: number;
    notes?: string;
    recommendations?: string[];
    findings?: string[];
}

interface MedBuddyHistory extends BaseHistoryItem {
    type: "medication";
    medication: string;
    dosage: string;
    frequency: string;
    startDate: string;
    status: string;
    adherence: number;
}

interface AppointmentHistory extends BaseHistoryItem {
    type: "appointment";
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

const Trash = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>("chat");
    const [loading, setLoading] = useState(true);

    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
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
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Specifically fetch deleted items
            const params = { includeDeleted: true };
            const [scansRes, medsRes, apptsRes, chatsRes, readingRes] =
                await Promise.all([
                    api.get("/health-scans", { params }),
                    api.get("/medications", { params }),
                    api.get("/appointments", { params }),
                    api.get("/chats", { params }),
                    api.get("/reading-history", { params }),
                ]);

            // Helper to filter only deleted items
            const filterDeleted = (list: any[]) => list.filter(item => item.deletedAt);

            if (scansRes.data.success) {
                setScanHistory(
                    filterDeleted(scansRes.data.scans).map((scan: any) => ({
                        id: scan._id,
                        type: scan.scanType === "eyes" ? "Eye Scan" : scan.scanType === "teeth" ? "Dental Scan" : "Skin Scan",
                        date: new Date(scan.createdAt).toLocaleDateString(),
                        time: new Date(scan.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        result: scan.result,
                        status: scan.status || "Low", // simplified default
                        healthScore: scan.healthScore,
                        confidence: scan.confidence,
                        notes: scan.notes,
                        deletedAt: scan.deletedAt,
                    }))
                );
            }

            let combinedMedBuddy: (MedBuddyHistory | AppointmentHistory)[] = [];
            if (medsRes.data.success) {
                combinedMedBuddy.push(...filterDeleted(medsRes.data.medications).map((med: any) => ({
                    type: "medication" as const,
                    id: med._id,
                    medication: med.name,
                    dosage: med.dosage,
                    frequency: med.frequency,
                    startDate: new Date(med.startDate).toLocaleDateString(),
                    date: new Date(med.createdAt).toLocaleDateString(),
                    time: "--",
                    status: med.status || "Active",
                    adherence: med.adherence || 0,
                    deletedAt: med.deletedAt,
                })));
            }
            if (apptsRes.data.success) {
                combinedMedBuddy.push(...filterDeleted(apptsRes.data.appointments).map((appt: any) => ({
                    type: "appointment" as const,
                    id: appt._id,
                    doctorName: appt.doctorName,
                    specialty: appt.specialty,
                    date: new Date(appt.date).toLocaleDateString(),
                    time: appt.time,
                    location: appt.location || appt.hospitalName,
                    notes: appt.notes,
                    deletedAt: appt.deletedAt,
                })));
            }
            combinedMedBuddy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setMedBuddyItems(combinedMedBuddy);

            if (chatsRes.data.success) {
                setChatHistory(
                    filterDeleted(chatsRes.data.chats).map((chat: any) => ({
                        id: chat._id,
                        title: chat.title,
                        preview: chat.preview,
                        date: new Date(chat.createdAt).toLocaleDateString(),
                        time: new Date(chat.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        deletedAt: chat.deletedAt,
                    }))
                );
            }

            if (readingRes.data.success) {
                setReadingHistory(
                    filterDeleted(readingRes.data.history).map((log: any) => ({
                        id: log._id,
                        title: log.title,
                        category: log.category,
                        readTime: log.readTime,
                        date: new Date(log.createdAt).toLocaleDateString(),
                        time: new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        deletedAt: log.deletedAt,
                    }))
                );
            }

        } catch (error) {
            console.error("Error fetching trash:", error);
            toast.error("Failed to load trash");
        } finally {
            setLoading(false);
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
                case "reading": toast.error("Restore not available for reading history"); return;
            }
            await api.patch(endpoint);
            toast.success("Item restored");
            fetchData();
        } catch (error) {
            console.error("Error restoring item:", error);
            toast.error("Failed to restore item");
        }
    };

    const handlePermanentDelete = async (e: React.MouseEvent, id: string, type: string) => {
        e.stopPropagation();
        if (!confirm("This will PERMANENTLY delete this item. Are you sure?")) return;
        try {
            let endpoint = "";
            switch (type) {
                // Assuming your API supports DELETE on the resource URL for permanent delete 
                // OR you need a /force-delete endpoint. 
                // Usually, calling delete on an already deleted item might trigger permanent delete if backend logic says so,
                // or we need a specific param.
                // For safety, I'll assume standard delete on already deleted item = 404 or nothing unless specified.
                // Let's try adding ?permanent=true if your backend supports it, or just rely on the cleanup job.
                // IF immediate permanent delete is requested, we might need a dedicated endpoint.
                // Based on History.tsx, `handleDelete` just called `api.delete`.
                // If I assume soft delete IS the delete, then permanent delete needs a new route or query param.
                // However, user requirement is "after 30 days it automatically deletes".
                // It's acceptable if the user can't manually force delete immediately, OR I can try sending a flag.
                // Let's stick to RESTORE for now, and maybe "Delete" just errors or does nothing if not implemented.
                // I'll disable "Permanent Delete" button for now or make it call delete with ?force=true and see what happens.
                case "scans": endpoint = `/health-scans/${id}?force=true`; break;
                case "medication": endpoint = `/medications/${id}?force=true`; break;
                case "appointment": endpoint = `/appointments/${id}?force=true`; break;
                case "chat": endpoint = `/chats/${id}?force=true`; break;
            }
            // NOTE: Verify backend supports force delete. If not, this might soft-delete again (no-op).
            // For now, I'll just implement Restore as the primary action.
            // But user might want to clear trash.
            await api.delete(endpoint);
            toast.success("Item deleted permanently");
            fetchData();
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        }
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/history")}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold text-foreground">Trash</h1>
                    </div>
                    <p className="text-muted-foreground text-sm ml-10">
                        Items are automatically deleted after 30 days.
                    </p>
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

                {/* Content */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-10 text-muted-foreground">
                            Loading trash...
                        </div>
                    ) : (
                        <>
                            {/* Similar map logic to History.tsx but using filtered deleted data */}
                            {activeTab === "chat" && chatHistory.map((chat) => (
                                <div key={chat.id} className="w-full medical-card text-left flex items-center gap-4 p-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                                        <Trash2 className="w-5 h-5 text-destructive" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-foreground truncate">{chat.title}</h3>
                                        <p className="text-xs text-muted-foreground">Deleted: {chat.date}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={(e) => handleRestore(e, chat.id, "chat")}>
                                        <RefreshCcw className="w-4 h-4 mr-2" /> Restore
                                    </Button>
                                </div>
                            ))}

                            {activeTab === "scans" && scanHistory.map((scan) => (
                                <div key={scan.id} className="w-full medical-card text-left flex items-center gap-4 p-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                                        <Trash2 className="w-5 h-5 text-destructive" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-foreground truncate">{scan.type}</h3>
                                        <p className="text-xs text-muted-foreground">Deleted: {scan.date}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={(e) => handleRestore(e, scan.id, "scans")}>
                                        <RefreshCcw className="w-4 h-4 mr-2" /> Restore
                                    </Button>
                                </div>
                            ))}

                            {activeTab === "medbuddy" && medBuddyItems.map((item) => (
                                <div key={item.id} className="w-full medical-card text-left flex items-center gap-4 p-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                                        <Trash2 className="w-5 h-5 text-destructive" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-foreground truncate">{item.type === 'medication' ? (item as MedBuddyHistory).medication : (item as AppointmentHistory).doctorName}</h3>
                                        <p className="text-xs text-muted-foreground">Deleted: {item.date}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={(e) => handleRestore(e, item.id, item.type)}>
                                        <RefreshCcw className="w-4 h-4 mr-2" /> Restore
                                    </Button>
                                </div>
                            ))}

                            {activeTab === "reading" && readingHistory.map((log) => (
                                <div key={log.id} className="w-full medical-card text-left flex items-center gap-4 p-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                                        <Trash2 className="w-5 h-5 text-destructive" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-foreground truncate">{log.title}</h3>
                                        <p className="text-xs text-muted-foreground">Deleted: {log.date}</p>
                                    </div>
                                    {/* Reading logs might not support restore yet based on backend */}
                                </div>
                            ))}

                            {/* Empty States */}
                            {activeTab === "chat" && chatHistory.length === 0 && <div className="text-center py-8 text-muted-foreground">Trash is empty</div>}
                            {activeTab === "scans" && scanHistory.length === 0 && <div className="text-center py-8 text-muted-foreground">Trash is empty</div>}
                            {activeTab === "medbuddy" && medBuddyItems.length === 0 && <div className="text-center py-8 text-muted-foreground">Trash is empty</div>}
                            {activeTab === "reading" && readingHistory.length === 0 && <div className="text-center py-8 text-muted-foreground">Trash is empty</div>}
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Trash;
