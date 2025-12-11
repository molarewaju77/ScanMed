import mongoose from 'mongoose';
import { User } from './models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function getUser() {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne();
    if (user) {
        console.log("VALID_USER_ID=" + user._id);
    } else {
        console.log("NO_USERS_FOUND");
    }
    process.exit();
}

getUser();
