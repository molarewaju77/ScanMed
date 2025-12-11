// Email functionality disabled - uncomment when ready to use
// import * as Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

// Placeholder exports (email functionality disabled)
export const transactionalEmailsApi = null;
export const sender = { email: process.env.BREVO_EMAIL || "noreply@scanmed.com", name: "ScanMed" };

/*
// Original Brevo configuration - uncomment when email is enabled
export const transactionalEmailsApi = new Brevo.TransactionalEmailsApi();

// Configure API key authorization: api-key
const apiKey = transactionalEmailsApi.authentications["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY;

console.log(
  "Brevo API Key Loaded:",
  process.env.BREVO_API_KEY
    ? "YES (" + process.env.BREVO_API_KEY.substring(0, 5) + "...)"
    : "NO"
);
*/
