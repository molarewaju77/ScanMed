import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MapPin } from "lucide-react";

interface LocationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLocationSubmit: (location: string) => void;
}

export function LocationDialog({ open, onOpenChange, onLocationSubmit }: LocationDialogProps) {
    const [location, setLocation] = useState("");

    const handleSubmit = () => {
        if (location.trim()) {
            onLocationSubmit(location);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Find Nearby Hospitals</DialogTitle>
                    <DialogDescription>
                        Enter your location to see partner hospitals near you.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 py-4">
                    <div className="grid flex-1 gap-2">
                        <div className="relative">
                            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Enter city or area (e.g., Ikorodu)"
                                className="pl-9"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button type="button" onClick={handleSubmit} className="w-full">
                        Search Hospitals
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
