import { transactionalEmailsApi, sender } from "./brevo.config.js";
import {
  verificationEmailTemplate,
  resetPasswordTemplate,
  resetSuccessTemplate,
  welcomeEmailTemplate,
} from "./emailTemplates.js";

// Send verification email
// Send verification email
export const sendVerificationEmail = async (name, email, verificationToken) => {
  try {
    const emailData = {
      subject: "Verify Your Email",
      htmlContent: verificationEmailTemplate(name, verificationToken),
      sender: sender,
      to: [{ email: email }],
    };

    const data = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("Verification email sent:", data);
  } catch (err) {
    console.error("Verification email error:", err);
    throw err;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const emailData = {
      subject: "Welcome to Our Platform!",
      htmlContent: welcomeEmailTemplate(name),
      sender: sender,
      to: [{ email: email }],
    };

    const data = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("Welcome email sent:", data);
  } catch (err) {
    console.error("Welcome email error:", err);
    throw err;
  }
};

export const sendPasswordResetEmail = async (email, otp) => {
  try {
    const emailData = {
      subject: "Your Password Reset Code",
      htmlContent: resetPasswordTemplate(otp),
      sender: sender,
      to: [{ email: email }],
    };

    const data = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("Password reset email sent:", data);
  } catch (err) {
    console.error("Password reset email error:", err);
    throw err;
  }
};

// Send password reset success email
export const sendResetSuccessEmail = async (email) => {
  try {
    const emailData = {
      subject: "Your Password Has Been Reset",
      htmlContent: resetSuccessTemplate(),
      sender: sender,
      to: [{ email: email }],
    };

    const data = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("Password reset success email sent:", data);
  } catch (err) {
    console.error("Reset success email error:", err);
    throw err;
  }
};

//contact email

export const contactEmail = async (email) => {};
