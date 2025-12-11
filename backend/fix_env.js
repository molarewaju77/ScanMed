import fs from 'fs';
import path from 'path';

const envContent = `MONGO_URI=mongodb://127.0.0.1:27017/scanmed
PORT=8000
JWT_SECRET=scanmed_secret_key_2024
GEMINI_API_KEY=AIzaSyC1a3DP7AtDbCBUfywTs2PhK-JTOTxzhuQ
`;

const filePath = path.join(process.cwd(), '.env');

try {
    fs.writeFileSync(filePath, envContent, { encoding: 'utf8' });
    console.log('.env file written successfully with UTF-8 encoding.');
    console.log('Content preview:');
    console.log(envContent);
} catch (err) {
    console.error('Error writing .env file:', err);
}
