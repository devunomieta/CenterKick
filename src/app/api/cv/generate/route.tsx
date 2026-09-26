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

  // career_stats stores each season's league as a leagues.id foreign key, not a name —
  // resolve it here the same way public profile pages do, so the CV shows real league names.
  let enrichedCareerStats = profile.career_stats;
  if (Array.isArray(profile.career_stats) && profile.career_stats.length > 0) {
    const leagueIds = Array.from(new Set(profile.career_stats.map((s: any) => s.league).filter(Boolean)));
    if (leagueIds.length > 0) {
      const { data: leagues } = await supabase.from('leagues').select('id, name').in('id', leagueIds);
      const leagueNameById = new Map((leagues || []).map((l: any) => [l.id, l.name]));
      enrichedCareerStats = profile.career_stats.map((s: any) => ({
        ...s,
        league_name: s.league_name || leagueNameById.get(s.league) || s.league,
      }));
    }
  }

  const cv = buildCvDocument({ ...profile, career_stats: enrichedCareerStats, email: userRecord?.email }, role);
  const profileFullUrl = `${getBaseSiteUrl()}${cv.profileUrl}`;
  const qrDataUrl = await QRCode.toDataURL(profileFullUrl, { margin: 1, width: 200 });

  const buffer = await renderToBuffer(
    <CenterKickCvDocument cv={cv} qrDataUrl={qrDataUrl} profileFullUrl={profileFullUrl} />
  );

  const slugSafe = (profile.slug || cv.name || 'centerkick-profile').toString().replace(/[^a-zA-Z0-9-]+/g, '-');
  const downloadFilename = `${slugSafe}-CV.pdf`;

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${downloadFilename}"`,
      'X-Filename': downloadFilename,
      'Access-Control-Expose-Headers': 'X-Filename',
      'Cache-Control': 'no-store',
    },
  });
}
