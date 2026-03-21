import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendAdminInvitationEmail } from '@/lib/resend';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the requester is a superadmin or admin
    const { data: userRecord } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!userRecord || !['superadmin', 'admin'].includes(userRecord.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    const token = Buffer.from(Math.random().toString(36).substring(2) + Date.now().toString(36)).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const { error: inviteError } = await supabase
      .from('admin_invitations')
      .insert({
        email,
        role,
        token,
        invited_by: session.user.id,
        expires_at: expiresAt.toISOString(),
      });

    if (inviteError) {
      console.error('Invitation Error:', inviteError);
      return NextResponse.json({ error: inviteError.message }, { status: 500 });
    }

    const invitationLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/complete-signup?token=${token}`;

    await sendAdminInvitationEmail(email, role, invitationLink);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
