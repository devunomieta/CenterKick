import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { checkRateLimit } from '@/lib/ratelimit';
import { resolveIsSubscribed } from '@/lib/subscription';
import { buildCvDocument } from '@/lib/cv/mapper';
import { CenterKickCvDocument } from '@/lib/cv/template';
import { getBaseSiteUrl } from '@/lib/utils/og';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateCheck = await checkRateLimit(`cvGenerate:${user.id}`);
  if (!rateCheck.success) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment before trying again.' }, { status: 429 });
  }

  const [{ data: userRecord }, { data: profile }] = await Promise.all([
    supabase.from('users').select('role, email').eq('id', user.id).single(),
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
  ]);

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const role = userRecord?.role || 'player';

  const [{ data: subscriptions }, { data: confirmedTxs }, { data: redemptions }] = await Promise.all([
    supabase.from('subscriptions').select('id').eq('user_id', user.id).eq('status', 'active'),
    supabase.from('transactions').select('id').eq('user_id', profile.id).eq('status', 'confirmed').limit(1),
    supabase.from('coupon_redemptions').select('id').or(`redeemer_id.eq.${user.id},redeemer_id.eq.${profile.id}`).limit(1),
  ]);

  const isSubscribed = resolveIsSubscribed({
    isSubscribedFlag: profile.is_subscribed,
    subscriptionStatus: profile.subscription_status,
    hasActiveSubscriptionRow: Boolean(subscriptions && subscriptions.length > 0),
    hasConfirmedTransaction: Boolean(confirmedTxs && confirmedTxs.length > 0),
    hasCouponRedemption: Boolean(redemptions && redemptions.length > 0),
  });

  const isAdminOrOps = ['superadmin', 'admin', 'operations'].includes(role);

  if (!isSubscribed && !isAdminOrOps) {
    return NextResponse.json({ error: 'An active subscription is required to download your CV.', code: 'SUBSCRIPTION_REQUIRED' }, { status: 403 });
  }

  const cv = buildCvDocument({ ...profile, email: userRecord?.email }, role);
  const profileFullUrl = `${getBaseSiteUrl()}${cv.profileUrl}`;
  const qrDataUrl = await QRCode.toDataURL(profileFullUrl, { margin: 1, width: 200 });

  const buffer = await renderToBuffer(
    <CenterKickCvDocument cv={cv} qrDataUrl={qrDataUrl} profileFullUrl={profileFullUrl} />
  );

  const fileNameSafe = (cv.name || 'CenterKick-Profile').replace(/[^a-z0-9]+/gi, '_');

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${fileNameSafe}-CenterKick-CV.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
