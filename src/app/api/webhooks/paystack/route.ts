import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    // Verify signature
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = await createClient();

    // Handle the event
    if (event.event === 'charge.success') {
      const { reference, customer, metadata } = event.data;
      
      // Update subscription status in Supabase
      // Assuming metadata contains userId and plan
      if (metadata?.userId) {
        await supabase.from('subscriptions').upsert({
          user_id: metadata.userId,
          plan_name: metadata.plan,
          status: 'active',
          gateway: 'paystack',
          external_id: reference,
        });
        
        // TODO: Trigger Resend email receipt here if needed
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
