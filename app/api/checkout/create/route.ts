import { NextResponse } from 'next/server';
import { compactAnswersForStripe } from '@/lib/numerology';
import { quizAnswersSchema } from '@/lib/schemas';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const answers = quizAnswersSchema.parse(json);

    if (!process.env.STRIPE_PRICE_ID_PROFILE) {
      return NextResponse.json({ error: 'Stripe n’est pas encore configuré.' }, { status: 500 });
    }

    const requestOrigin = new URL(req.url).origin;
    const baseUrl = process.env.APP_BASE_URL || requestOrigin;
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: process.env.STRIPE_PRICE_ID_PROFILE, quantity: 1 }],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/resultat`,
      billing_address_collection: 'auto',
      customer_creation: 'always',
      allow_promotion_codes: true,
      metadata: {
        analysis_type: 'premium_profile',
        answers: compactAnswersForStripe(answers),
      },
      custom_text: {
        submit: {
          message: 'Votre lecture complète se préparera juste après validation du paiement.',
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Impossible de créer la session de paiement.' }, { status: 400 });
  }
}
