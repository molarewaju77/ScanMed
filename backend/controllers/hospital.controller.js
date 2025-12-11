import { Hospital } from "../models/hospital.model.js";

// Mock data to simulate Google Places results when no API key is present
const MOCK_GOOGLE_RESULTS = [
    {
        name: "General Hospital Ikorodu",
        address: "T.O.S Benson Rd, Ikorodu",
        isPartner: true,
        bookingEnabled: true,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1587351021759-3e566b9af922?q=80&w=1000&auto=format&fit=crop",
        tags: ["General", "Emergency"],
        distance: "1.2 km"
    },
    {
        name: "Life Care Clinic",
        address: "15 Lagos Rd, Ikorodu",
        isPartner: false,
        bookingEnabled: false,
        rating: 3.8,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop",
        tags: ["Clinic", "Pediatrics"],
        distance: "2.5 km"
    },
    {
        name: "Best Care Specialist Hospital",
        address: "By Garage, Ikorodu",
        isPartner: true,
        bookingEnabled: true,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1516549655169-df83a0674503?q=80&w=1000&auto=format&fit=crop",
        tags: ["Specialist", "Surgery"],
        distance: "0.8 km"
    }
];

export const findNearbyHospitals = async (req, res) => {
    try {
        const { location } = req.query; // e.g., "Ikorodu" or lat,lng

        // In a real implementation:
        // 1. Geocode the location string to coordinates (if string provided)
        // 2. Query DB for partners within X km
        // 3. Query Google Places API for others

        console.log(`Searching hospitals in: ${location}`);

        // For now, return mock data mixed with database partners
        // We simulate a DB query for partners
        const dbPartners = await Hospital.find({ isPartner: true }).limit(5);

        // Filter mocks based on location string (simple inclusivity check for demo)
        // If location is "Ikorodu", we return our mocks. Else, generic ones.
        let results = [];

        if (location && location.toLowerCase().includes("ikorodu")) {
            results = [...MOCK_GOOGLE_RESULTS];
        } else {
            // Generic mocks for other locations
            results = [
                {
                    name: `City General Hospital (${location})`,
                    address: `Main St, ${location}`,
                    isPartner: true,
                    bookingEnabled: true,
                    rating: 4.0,
                    tags: ["General"],
                    distance: "1.5 km",
                    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000&auto=format&fit=crop"
                },
                {
                    name: `Community Clinic (${location})`,
                    address: `4th Ave, ${location}`,
                    isPartner: false,
                    bookingEnabled: false,
                    rating: 3.5,
                    tags: ["Clinic"],
                    distance: "3.2 km",
                    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
                }
            ];
        }

        // Sort: Partners first
        results.sort((a, b) => (b.isPartner === true ? 1 : 0) - (a.isPartner === true ? 1 : 0));

        res.status(200).json({
            success: true,
            hospitals: results,
        });
    } catch (error) {
        console.error("Error finding hospitals:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createHospital = async (req, res) => {
    try {
        const hospital = new Hospital(req.body);
        await hospital.save();
        res.status(201).json({ success: true, hospital });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===== ADMIN-ONLY FUNCTIONS =====

export const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, hospitals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const hospital = await Hospital.findByIdAndUpdate(id, req.body, { new: true });

        if (!hospital) {
            return res.status(404).json({ success: false, message: "Hospital not found" });
        }

        res.status(200).json({ success: true, hospital });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const hospital = await Hospital.findByIdAndDelete(id);

        if (!hospital) {
            return res.status(404).json({ success: false, message: "Hospital not found" });
        }

        res.status(200).json({ success: true, message: "Hospital deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const togglePartnerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const hospital = await Hospital.findById(id);

        if (!hospital) {
            return res.status(404).json({ success: false, message: "Hospital not found" });
        }

        hospital.isPartner = !hospital.isPartner;
        hospital.bookingEnabled = hospital.isPartner; // Auto-enable booking for partners
        await hospital.save();

        res.status(200).json({ success: true, hospital });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
