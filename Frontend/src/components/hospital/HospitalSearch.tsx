import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Phone, Navigation } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Hospital {
    _id?: string;
    name: string;
    address: string;
    isPartner: boolean;
    bookingEnabled: boolean;
    rating: number;
    image?: string;
    distance?: string;
    tags?: string[];
}

interface HospitalSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    location: string;
}

export function HospitalSearch({ open, onOpenChange, location }: HospitalSearchProps) {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && location) {
            fetchHospitals();
        }
    }, [open, location]);

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/hospitals/nearby?location=${encodeURIComponent(location)}`);
            if (response.data.success) {
                setHospitals(response.data.hospitals);
            }
        } catch (error) {
            console.error("Error fetching hospitals:", error);
            toast.error("Failed to find hospitals.");
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (hospital: Hospital) => {
        // In a real app, this would open a booking form pre-filled with the hospital
        // For now, let's just create a generic appointment to simulate the flow
        try {
            await api.post("/appointments", {
                doctorName: "General Practitioner",
                hospitalName: hospital.name,
                specialty: "General Medicine",
                date: new Date().toISOString().split('T')[0], // Today
                time: "09:00",
                notes: `Booking at ${hospital.name} via ScanMed`
            });
            toast.success(`Request sent to ${hospital.name}! They will contact you shortly.`);
            onOpenChange(false);
        } catch (error) {
            toast.error("Booking failed. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Hospitals near "{location}"</DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 pt-2">
                    {loading ? (
                        <div className="flex justify-center p-8">Loading...</div>
                    ) : hospitals.length === 0 ? (
                        <div className="text-center text-muted-foreground p-8">No hospitals found in this area.</div>
                    ) : (
                        <div className="space-y-4">
                            {hospitals.map((hospital, index) => (
                                <div key={index} className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors">
                                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                                        {hospital.image ? (
                                            <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                                <MapPin />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    {hospital.name}
                                                    {hospital.isPartner && <Badge variant="default" className="text-xs">Partner</Badge>}
                                                </h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {hospital.address}
                                                </p>
                                            </div>
                                            {hospital.rating > 0 && (
                                                <div className="flex items-center gap-1 text-amber-500 font-medium text-sm">
                                                    <Star className="w-3 h-3 fill-current" /> {hospital.rating}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {hospital.tags?.map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                                            ))}
                                        </div>

                                        <div className="pt-2 flex gap-2">
                                            {hospital.bookingEnabled ? (
                                                <Button size="sm" onClick={() => handleBook(hospital)} className="flex-1">
                                                    Book Appointment
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" className="flex-1" asChild>
                                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + " " + hospital.address)}`} target="_blank" rel="noreferrer">
                                                        <Navigation className="w-3 h-3 mr-2" />
                                                        Get Directions
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
