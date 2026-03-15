import { Resend } from 'resend';

// Provide a mock instance if key is missing during build/dev
const resendApiKey = process.env.RESEND_API_KEY || 're_mock_key';
export const resend = new Resend(resendApiKey);

export async function sendWelcomeEmail(email: string, firstName: string) {
  try {
    const data = await resend.emails.send({
      from: 'CenterKick <onboarding@centerkick.com>',
      to: [email],
      subject: 'Welcome to CenterKick!',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #171717;">
            <h1 style="color: #B91C1C;">Welcome, ${firstName}!</h1>
            <p>Thank you for joining CenterKick, the premium sports profile management platform.</p>
            <p>Your profile is currently pending review. You'll be notified as soon as it's approved.</p>
            <br/>
            <p>Best,<br/>The CenterKick Team</p>
        </div>
      `,
    });
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
