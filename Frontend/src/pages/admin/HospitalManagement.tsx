import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Building, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";

export default function HospitalManagement() {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingHospital, setEditingHospital] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        rating: 0,
        tags: []
    });

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const response = await api.get("/hospitals/admin/all");
            if (response.data.success) {
                setHospitals(response.data.hospitals);
            }
        } catch (error) {
            toast.error("Failed to fetch hospitals");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingHospital) {
                await api.put(`/hospitals/admin/${editingHospital._id}`, formData);
                toast.success("Hospital updated successfully");
            } else {
                await api.post("/hospitals/admin/create", formData);
                toast.success("Hospital created successfully");
            }
            setIsDialogOpen(false);
            setEditingHospital(null);
            setFormData({ name: "", address: "", phone: "", email: "", rating: 0, tags: [] });
            fetchHospitals();
        } catch (error) {
            toast.error("Failed to save hospital");
        }
    };

    const handleEdit = (hospital) => {
        setEditingHospital(hospital);
        setFormData({
            name: hospital.name,
            address: hospital.address,
            phone: hospital.phone || "",
            email: hospital.email || "",
            rating: hospital.rating || 0,
            tags: hospital.tags || []
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this hospital?")) return;

        try {
            await api.delete(`/hospitals/admin/${id}`);
            toast.success("Hospital deleted successfully");
            fetchHospitals();
        } catch (error) {
            toast.error("Failed to delete hospital");
        }
    };

    const togglePartner = async (hospital) => {
        try {
            await api.put(`/hospitals/admin/${hospital._id}/partner`);
            toast.success(`Partner status ${hospital.isPartner ? "removed" : "added"}`);
            fetchHospitals();
        } catch (error) {
            toast.error("Failed to update partner status");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Hospital Management</h1>
                    <p className="text-muted-foreground">Manage hospitals and partnerships</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            setEditingHospital(null);
                            setFormData({ name: "", address: "", phone: "", email: "", rating: 0, tags: [] });
                        }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Hospital
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingHospital ? "Edit Hospital" : "Add New Hospital"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Hospital Name *</Label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="General Hospital"
                                />
                            </div>
                            <div>
                                <Label>Address *</Label>
                                <Input
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="123 Main St, City"
                                />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+234 XXX XXX XXXX"
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="info@hospital.com"
                                />
                            </div>
                            <div className="flex gap-4">
                                <Button type="submit" className="flex-1">
                                    {editingHospital ? "Update" : "Create"}
                                </Button>
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
            ) : (
                <div className="grid gap-4">
                    {hospitals.map((hospital) => (
                        <div key={hospital._id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Building className="w-5 h-5 text-primary" />
                                        <h3 className="text-lg font-semibold">{hospital.name}</h3>
                                        {hospital.isPartner && (
                                            <Badge className="bg-green-500">Partner</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">📍 {hospital.address}</p>
                                    {hospital.phone && (
                                        <p className="text-sm text-muted-foreground">📞 {hospital.phone}</p>
                                    )}
                                    {hospital.email && (
                                        <p className="text-sm text-muted-foreground">✉️ {hospital.email}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant={hospital.isPartner ? "destructive" : "default"}
                                        onClick={() => togglePartner(hospital)}
                                    >
                                        {hospital.isPartner ? (
                                            <><XCircle className="w-4 h-4 mr-1" /> Remove Partner</>
                                        ) : (
                                            <><CheckCircle className="w-4 h-4 mr-1" /> Make Partner</>
                                        )}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(hospital)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(hospital._id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
