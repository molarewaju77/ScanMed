import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
const newKey = "AIzaSyC1a3DP7AtDbCBUfywTs2PhK-JTOTxzhuQ";

try {
    let content = "";
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
    }

    const lines = content.split('\n');
    let found = false;
    const newLines = lines.map(line => {
        if (line.trim().startsWith('GEMINI_API_KEY=')) {
            found = true;
            return `GEMINI_API_KEY=${newKey}`;
        }
        return line;
    });

    if (!found) {
        newLines.push(`GEMINI_API_KEY=${newKey}`);
    }

    fs.writeFileSync(envPath, newLines.join('\n'));
    console.log("Updated .env successfully.");
} catch (e) {
    console.error("Error updating .env:", e);
}
