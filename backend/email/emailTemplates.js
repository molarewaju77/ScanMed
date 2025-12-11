export const verificationEmailTemplate = (name, verificationToken) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - ScanMed</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <div style="background-color: rgba(255,255,255,0.2); border-radius: 16px; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ScanMed</h1>
        <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">AI-Powered Health Companion</p>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="margin-top: 0; color: #1f2937; font-size: 24px;">Verify Your Email</h2>
        <p style="color: #4b5563; font-size: 16px;">Hi ${name},</p>
        <p style="color: #4b5563; font-size: 16px;">Welcome to ScanMed! Please use the verification code below to complete your registration and start your health journey with us:</p>
        
        <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center; border: 2px dashed #667eea;">
          <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${verificationToken}</span>
        </div>
        
        <p style="color: #9ca3af; font-size: 14px; text-align: center;">This code will expire in 10 minutes</p>
        <p style="color: #4b5563; font-size: 14px; margin-top: 24px;">If you didn't create a ScanMed account, you can safely ignore this email.</p>
      </div>
      <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} ScanMed. All rights reserved.</p>
        <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">Your trusted AI health companion</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const resetPasswordTemplate = (resetURL) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - ScanMed</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center;">
        <div style="background-color: rgba(255,255,255,0.2); border-radius: 16px; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ScanMed</h1>
        <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">Password Reset Request</p>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="margin-top: 0; color: #1f2937; font-size: 24px;">Reset Your Password</h2>
        <p style="color: #4b5563; font-size: 16px;">We received a request to reset your ScanMed account password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 36px 0;">
          <a href="${resetURL}" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">Reset Password</a>
        </div>
        
        <p style="color: #6b7280; font-size: 13px; padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #667eea;">If the button doesn't work, copy and paste this link:<br><span style="color: #667eea; word-break: break-all;">${resetURL}</span></p>
        
        <p style="color: #9ca3af; font-size: 14px; margin-top: 24px; text-align: center;">This link will expire in 1 hour</p>
        <p style="color: #4b5563; font-size: 14px; margin-top: 16px;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
      </div>
      <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} ScanMed. All rights reserved.</p>
        <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">Your trusted AI health companion</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const resetSuccessTemplate = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed - ScanMed</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
        <div style="background-color: rgba(255,255,255,0.2); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px; color: #ffffff;">✓</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ScanMed</h1>
        <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">Password Updated Successfully</p>
      </div>
      <div style="padding: 40px 30px; text-align: center;">
        <h2 style="margin-top: 0; color: #1f2937; font-size: 24px;">All Set!</h2>
        <p style="color: #4b5563; font-size: 16px;">Your ScanMed account password has been successfully updated. You can now log in with your new password.</p>
        
        <div style="background: linear-gradient(135deg, #10b98115 0%, #05966915 100%); padding: 20px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #10b981;">
          <p style="margin: 0; color: #059669; font-weight: 600;">🔒 Your account is now secure</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">If you didn't make this change, please contact our support team immediately.</p>
      </div>
      <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} ScanMed. All rights reserved.</p>
        <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">Your trusted AI health companion</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const welcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ScanMed</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 20px; text-align: center;">
        <div style="background-color: rgba(255,255,255,0.2); border-radius: 20px; width: 100px; height: 100px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            <circle cx="12" cy="12" r="10" opacity="0.3"/>
          </svg>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">Welcome to ScanMed!</h1>
        <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin-top: 12px;">Your AI-Powered Health Journey Starts Here</p>
      </div>
      <div style="padding: 40px 30px;">
        <p style="color: #4b5563; font-size: 16px;">Hi ${name},</p>
        <p style="color: #4b5563; font-size: 16px;">Thank you for joining ScanMed! We're excited to be part of your health and wellness journey.</p>
        
        <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); padding: 24px; border-radius: 12px; margin: 30px 0;">
          <h3 style="margin: 0 0 16px 0; color: #667eea; font-size: 18px;">What You Can Do:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
            <li style="margin-bottom: 12px;">🩺 <strong>AI Health Scans</strong> - Analyze eyes, teeth, and skin with our advanced ML technology</li>
            <li style="margin-bottom: 12px;">💬 <strong>Health Assistant</strong> - Chat with our AI for personalized health insights</li>
            <li style="margin-bottom: 12px;">💊 <strong>Medication Tracking</strong> - Never miss a dose with smart reminders</li>
            <li style="margin-bottom: 12px;">📚 <strong>Health Library</strong> - Access expert articles and wellness tips</li>
          </ul>
        </div>
        
        <p style="color: #4b5563; font-size: 14px; margin-top: 24px;">If you have any questions or need assistance, our support team is always here to help!</p>
      </div>
      <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} ScanMed. All rights reserved.</p>
        <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">Your trusted AI health companion</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
