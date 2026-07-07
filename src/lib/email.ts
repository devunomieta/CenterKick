import { Resend } from 'resend';

// Initialize Resend
// Note: RESEND_API_KEY must be set in your .env.local
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not found. Email not sent.', { to, subject });
    return { success: false, error: 'API key missing' };
  }

  try {
    const data = await resend.emails.send({
      from: 'CenterKick <notifications@centerkick.com>',
      to,
      subject,
      html
    });

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
