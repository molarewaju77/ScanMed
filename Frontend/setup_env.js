import fs from 'fs';
import path from 'path';

const envContent = `VITE_FIREBASE_API_KEY=AIzaSyCZXBrND44YGMd9B23Q7DcAFR1CpOA0mpQ
VITE_FIREBASE_AUTH_DOMAIN=wave-5dfb4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=wave-5dfb4
VITE_FIREBASE_STORAGE_BUCKET=wave-5dfb4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=38291807984
VITE_FIREBASE_APP_ID=1:38291807984:web:c3618fa5b1e903c08cac35
VITE_FIREBASE_MEASUREMENT_ID=G-6WHWGEC4GC
VITE_FIREBASE_VAPID_KEY=
`;

const filePath = path.join(process.cwd(), '.env');

try {
    fs.writeFileSync(filePath, envContent, { encoding: 'utf8' });
    console.log('Frontend .env file written successfully.');
} catch (err) {
    console.error('Error writing .env file:', err);
}
