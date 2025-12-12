
import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const email = "user1@scanmed.com";
const passwordToCheck = "User123!"; // The password we expect to work

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            console.log(`User ${email} NOT FOUND in database.`);
        } else {
            console.log(`User ${email} FOUND.`);
            console.log(`Stored Hashed Password: ${user.password}`);
            console.log(`Role: ${user.role}`);

            const isMatch = await bcryptjs.compare(passwordToCheck, user.password);
            console.log(`Password '${passwordToCheck}' match result: ${isMatch}`);

            if (!isMatch) {
                console.log("Password mismatch! The stored password is not 'User123!'");
            } else {
                console.log("Password correct! Login should work.");
            }
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

checkUser();
