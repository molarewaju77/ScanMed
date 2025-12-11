import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { connectDB } from "../db/connectDb.js";

dotenv.config();

const createSuperAdmin = async () => {
    try {
        console.log("🔄 Connecting to database...");
        await connectDB();

        const superAdminEmail = "makindeolasubomi2@gmail.com";
        const superAdminPassword = "SuperAdmin1$";

        // Check if super admin already exists
        const existingUser = await User.findOne({ email: superAdminEmail });

        if (existingUser) {
            const hashedPassword = await bcryptjs.hash(superAdminPassword, 10);
            existingUser.password = hashedPassword;
            existingUser.role = "superadmin";
            existingUser.isVerified = true;
            await existingUser.save();

            console.log("✅ Updated existing super admin credentials!");
            console.log("📧 Email:", existingUser.email);
            console.log("🔑 New Password:", superAdminPassword);
            console.log("👤 Name:", existingUser.name);
            process.exit(0);
        }

        // Create new super admin
        const hashedPassword = await bcryptjs.hash(superAdminPassword, 10);

        const superAdmin = new User({
            email: superAdminEmail,
            password: hashedPassword,
            name: "Makinde olasubomi",
            role: "superadmin",
            isVerified: true,
            lastLogin: new Date(),
        });

        await superAdmin.save();

        console.log("🎉 Super admin created successfully!");
        console.log("📧 Email:", superAdminEmail);
        console.log("🔑 Password:", superAdminPassword);
        console.log("👤 Name:", superAdmin.name);
        console.log("🔐 Role:", superAdmin.role);

        process.exit(0);
    } catch (error) {
        console.error(" Error creating super admin:", error);
        process.exit(1);
    }
};

createSuperAdmin();
