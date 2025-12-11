import fs from 'fs';
import path from 'path';

const envContent = `MONGO_URI=mongodb://127.0.0.1:27017/scanmed
PORT=8000
JWT_SECRET=scanmed_secret_key_2024
GEMINI_API_KEY=AIzaSyDXqgZZG8hOutVd-m9JQG_YoRIreQHbdEQ
`;

const filePath = path.join(process.cwd(), '.env');

try {
    fs.writeFileSync(filePath, envContent, { encoding: 'utf8' });
    console.log('.env file updated successfully with new API Key.');
} catch (err) {
    console.error('Error writing .env file:', err);
}
