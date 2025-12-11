import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const uri = process.env.MONGO_URI;
const logFile = 'db_check_result.txt';

console.log(`Testing connection to: ${uri}`);

if (!uri) {
    fs.writeFileSync(logFile, 'Error: MONGO_URI is undefined in environment.');
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        const msg = 'Success: Connected to MongoDB successfully.';
        console.log(msg);
        fs.writeFileSync(logFile, msg);
        process.exit(0);
    })
    .catch(err => {
        const msg = `Error: Failed to connect. ${err.message}`;
        console.error(msg);
        fs.writeFileSync(logFile, msg);
        process.exit(1);
    });
