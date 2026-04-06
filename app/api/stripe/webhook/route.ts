import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response('Configuration webhook manquante.', { status: 400 });
  }

  try {
    const stripe = getStripe();
    const payload = await req.text();

    stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);

    return new Response('ok');
  } catch (error) {
    console.error(error);
    return new Response('Webhook error', { status: 400 });
  }
}
