import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Hospital } from "../models/hospital.model.js";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";

dotenv.config();

const dummyUsers = {
    superadmins: [
        { name: "Super Admin", email: "superadmin@scanmed.com", password: "SuperAdmin123!", role: "superadmin" },
        { name: "Micheal", email: "michaelolarewaju@gmail.com", password: "Welcome123.", role: "admin" },
        { name: "Micheal", email: "makindeolasubomi3@gmail.com", password: "Welcome123.", role: "admin" },
        { name: "Micheal", email: "naheematakinyemi@@gmail.com", password: "Welcome123.", role: "admin" }
    ],
    admins: [
        { name: "Admin One", email: "admin1@scanmed.com", password: "Admin123!", role: "admin" },
        { name: "Olasubomi", email: "makindeolasubomi2@gmail.com", password: "Welcome123.", role: "admin" },
        { name: "Admin Two", email: "admin2@scanmed.com", password: "Admin123!", role: "admin" },
        { name: "Admin Three", email: "admin3@scanmed.com", password: "Admin123!", role: "admin" },
        { name: "Admin Four", email: "admin4@scanmed.com", password: "Admin123!", role: "admin" },
        { name: "Admin Five", email: "admin5@scanmed.com", password: "Admin123!", role: "admin" }
    ],
    managers: [
        { name: "Manager James", email: "manager1@scanmed.com", password: "Manager123!", role: "manager" },
        { name: "Manager Sarah", email: "manager2@scanmed.com", password: "Manager123!", role: "manager" },
        { name: "Manager John", email: "manager3@scanmed.com", password: "Manager123!", role: "manager" },
        { name: "Manager Lisa", email: "manager4@scanmed.com", password: "Manager123!", role: "manager" },
        { name: "Manager Mike", email: "manager5@scanmed.com", password: "Manager123!", role: "manager" }
    ],
    workers: [
        { name: "Worker Tom", email: "worker1@scanmed.com", password: "Worker123!", role: "worker" },
        { name: "Worker Emma", email: "worker2@scanmed.com", password: "Worker123!", role: "worker" },
        { name: "Worker Chris", email: "worker3@scanmed.com", password: "Worker123!", role: "worker" },
        { name: "Worker Anna", email: "worker4@scanmed.com", password: "Worker123!", role: "worker" },
        { name: "Worker David", email: "worker5@scanmed.com", password: "Worker123!", role: "worker" }
    ],
    users: [
        { name: "User Alice", email: "user1@scanmed.com", password: "User123!", role: "user" },
        { name: "User Bob", email: "user2@scanmed.com", password: "User123!", role: "user" },
        { name: "User Carol", email: "user3@scanmed.com", password: "User123!", role: "user" },
        { name: "User Daniel", email: "user4@scanmed.com", password: "User123!", role: "user" },
        { name: "User Eve", email: "user5@scanmed.com", password: "User123!", role: "user" }
    ],
    doctors: [
        {
            name: "Dr. Smith", email: "doctor1@scanmed.com", password: "Doctor123!", role: "user",
            doctorInfo: { specialization: "Ophthalmology", licenseNumber: "DOC-2024-001", yearsOfExperience: 10 }
        },
        {
            name: "Dr. Johnson", email: "doctor2@scanmed.com", password: "Doctor123!", role: "user",
            doctorInfo: { specialization: "Dentistry", licenseNumber: "DOC-2024-002", yearsOfExperience: 8 }
        },
        {
            name: "Dr. Williams", email: "doctor3@scanmed.com", password: "Doctor123!", role: "user",
            doctorInfo: { specialization: "Dermatology", licenseNumber: "DOC-2024-003", yearsOfExperience: 12 }
        },
        {
            name: "Dr. Brown", email: "doctor4@scanmed.com", password: "Doctor123!", role: "user",
            doctorInfo: { specialization: "General Medicine", licenseNumber: "DOC-2024-004", yearsOfExperience: 15 }
        },
        {
            name: "Dr. Davis", email: "doctor5@scanmed.com", password: "Doctor123!", role: "user",
            doctorInfo: { specialization: "Pediatrics", licenseNumber: "DOC-2024-005", yearsOfExperience: 7 }
        }
    ]
};

const dummyHospitals = [
    {
        name: "General Hospital Ikorodu",
        address: "T.O.S Benson Rd, Ikorodu, Lagos",
        phone: "+234 803 123 4567",
        email: "info@generalhospital.com",
        isPartner: true,
        bookingEnabled: true,
        tags: ["General", "Emergency", "Surgery"]
    },
    {
        name: "ScanMed Specialist Clinic",
        address: "15 Lagos Rd, Ikorodu, Lagos",
        phone: "+234 803 234 5678",
        email: "contact@scanmedclinic.com",
        isPartner: true,
        bookingEnabled: true,
        tags: ["Specialist", "Ophthalmology", "Dentistry"]
    },
    {
        name: "Best Care Medical Center",
        address: "By Garage, Ikorodu, Lagos",
        phone: "+234 803 345 6789",
        email: "info@bestcare.com",
        isPartner: false,
        bookingEnabled: false,
        tags: ["General", "Pediatrics"]
    }
];

async function seedDatabase() {
    try {
        console.log("🌱 Starting database seeding...");

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/scanmed");
        console.log("✅ Connected to MongoDB");

        // Clear existing data (optional - comment out if you want to keep existing data)
        // Clear existing data
        await User.deleteMany({});
        await Doctor.deleteMany({});
        await Hospital.deleteMany({});
        console.log("🗑️  Cleared existing data");

        // Create hospitals first
        console.log("\n🏥 Creating hospitals...");
        const hospitals = await Hospital.insertMany(dummyHospitals);
        console.log(`✅ Created ${hospitals.length} hospitals`);

        // Create all users
        const allUsers = [
            ...dummyUsers.superadmins,
            ...dummyUsers.admins,
            ...dummyUsers.managers,
            ...dummyUsers.workers,
            ...dummyUsers.users,
            ...dummyUsers.doctors.map(d => ({ name: d.name, email: d.email, password: d.password, role: d.role }))
        ];

        console.log("\n👥 Creating users...");
        const createdUsers = [];
        for (const userData of allUsers) {
            // Hash password before creating user
            // Note: Since we are using User.create(), and there is no pre-save hook in the model shown,
            // we must hash it here manually.
            const hashedPassword = await bcryptjs.hash(userData.password, 10);

            const user = await User.create({
                ...userData,
                password: hashedPassword,
                isVerified: true // Auto-verify for testing
            });
            createdUsers.push(user);
            console.log(`✅ Created ${userData.role}: ${userData.email}`);
        }

        // Create doctor profiles
        console.log("\n🩺 Creating doctor profiles...");
        const doctorUsers = createdUsers.filter((_, index) =>
            index >= allUsers.length - dummyUsers.doctors.length
        );

        for (let i = 0; i < doctorUsers.length; i++) {
            const doctorInfo = dummyUsers.doctors[i].doctorInfo;
            await Doctor.create({
                userId: doctorUsers[i]._id,
                hospitalId: hospitals[i % hospitals.length]._id, // Rotate through hospitals
                specialization: doctorInfo.specialization,
                licenseNumber: doctorInfo.licenseNumber,
                verified: true,
                yearsOfExperience: doctorInfo.yearsOfExperience,
                consultationFee: 5000 + (i * 1000),
                bio: `Experienced ${doctorInfo.specialization} specialist with ${doctorInfo.yearsOfExperience} years of practice.`,
                availableHours: [
                    { day: "Monday", startTime: "09:00", endTime: "17:00" },
                    { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
                    { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
                    { day: "Thursday", startTime: "09:00", endTime: "17:00" },
                    { day: "Friday", startTime: "09:00", endTime: "15:00" }
                ]
            });
            console.log(`✅ Created doctor profile for ${doctorUsers[i].email}`);
        }

        console.log("\n✅ Database seeding completed successfully!");
        console.log("\n📋 Summary:");
        console.log(`   - SuperAdmins: ${dummyUsers.superadmins.length}`);
        console.log(`   - Admins: ${dummyUsers.admins.length}`);
        console.log(`   - Managers: ${dummyUsers.managers.length}`);
        console.log(`   - Workers: ${dummyUsers.workers.length}`);
        console.log(`   - Users: ${dummyUsers.users.length}`);
        console.log(`   - Doctors: ${dummyUsers.doctors.length}`);
        console.log(`   - Hospitals: ${hospitals.length}`);

    } catch (error) {
        console.error("❌ Seeding error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n👋 Database connection closed");
        process.exit(0);
    }
}

// Run seeder
seedDatabase();
