import dotenv from 'dotenv';
import dns from 'dns';
import { promisify } from 'util';

dotenv.config();

const resolveSrv = promisify(dns.resolveSrv);

async function check() {
    console.log("Checking MONGO_URI...");
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("MONGO_URI is missing in .env");
        return;
    }

    console.log("MONGO_URI exists.");

    if (uri.startsWith("mongodb+srv://")) {
        console.log("Scheme is valid (mongodb+srv://).");

        // Extract hostname
        try {
            const url = new URL(uri.replace("mongodb+srv://", "http://")); // Hack to parse host
            const hostname = url.hostname;
            console.log(`Checking DNS for hostname: ${hostname}`);

            try {
                // For SRV, we typically query _mongodb._tcp.<hostname>
                // But let's just try to resolve the hostname or check SRV record if possible
                // Actually mongoose does the SRV lookup.
                // Let's manually do what querySrv does
                const addresses = await resolveSrv(`_mongodb._tcp.${hostname}`);
                console.log("✅ DNS SRV lookup successful:", addresses);
            } catch (dnsError) {
                console.error("❌ DNS SRV lookup failed:", dnsError.code, dnsError.message);
                console.log("👉 Suggestion: This might be a DNS issue. Try using a standard connection string or checking your internet connection.");
            }

        } catch (e) {
            console.error("⚠️ Could not parse hostname from URI:", e.message);
        }
    } else {
        console.log("⚠️ URI does not start with mongodb+srv:// (using standard connection?)");
    }
}

check();
